import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    CheckCircle,
    XCircle,
    Download,
    Search,
    ExternalLink,
    UserCheck,
    Globe,
    Filter
} from "lucide-react";
import { adminService, ShowcaseItem } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const LensList = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    // Data State
    const [verifiedItems, setVerifiedItems] = useState<ShowcaseItem[]>([]);
    const [guestItems, setGuestItems] = useState<ShowcaseItem[]>([]);
    const [activeTab, setActiveTab] = useState("verified");
    const [searchTerm, setSearchTerm] = useState("");

    // Determine view based on URL
    const getViewType = () => {
        if (location.pathname.includes('guest')) return 'guest';
        if (location.pathname.includes('export')) return 'export';
        return 'verified'; // Default
    };

    const viewType = getViewType();

    // If URL is 'guest', switch tab automatically
    useEffect(() => {
        if (viewType === 'guest') setActiveTab('guest');
        else setActiveTab('verified');
    }, [viewType]);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await adminService.showcase.getAll('lens', {
                startDate: '2024-01-01'
            });

            if (response.status === 'success' && response.data) {
                setVerifiedItems(response.data.verified_students);
                setGuestItems(response.data.guest_submissions);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load lens submissions",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Logic
    const filterList = (list: ShowcaseItem[]) => {
        return list.filter(item =>
            item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.college_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Render Row
    const renderRow = (item: ShowcaseItem) => (
        <TableRow key={item.submission_id}>
            <TableCell className="font-medium">
                {item.full_name}
                <div className="text-xs text-muted-foreground">{item.email}</div>
            </TableCell>
            <TableCell>{item.college_name}</TableCell>
            <TableCell>{item.gender}</TableCell>
            <TableCell>
                <a
                    href={item.lens_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
                >
                    View Lens <ExternalLink className="w-3 h-3" />
                </a>
            </TableCell>
            <TableCell>
                <Badge variant={item.account_status === 'verified' ? 'default' : 'secondary'}>
                    {item.account_status.toUpperCase()}
                </Badge>
            </TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">
                {new Date(item.submitted_at).toLocaleDateString()}
            </TableCell>
        </TableRow>
    );

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lens Submissions</h1>
                    <p className="text-muted-foreground">
                        Manage and export lens links from students and guests.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open(adminService.showcase.getExportUrl('lens', '2024-01-01', '2025-12-31'), '_blank')}
                >
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            {/* Main Card */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex justify-between gap-4">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search name or college..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="verified" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="verified" className="gap-2">
                                <UserCheck className="w-4 h-4" /> Verified Lenses
                                <Badge variant="secondary" className="ml-1">{verifiedItems.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="guest" className="gap-2">
                                <Globe className="w-4 h-4" /> Guest Lenses
                                <Badge variant="secondary" className="ml-1">{guestItems.length}</Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="verified" className="mt-0">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead>Lens Link</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell></TableRow>
                                        ) : filterList(verifiedItems).length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="h-24 text-center">No verified lenses found.</TableCell></TableRow>
                                        ) : (
                                            filterList(verifiedItems).map(renderRow)
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="guest" className="mt-0">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name (Guest)</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead>Lens Link</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell></TableRow>
                                        ) : filterList(guestItems).length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="h-24 text-center">No guest lenses found.</TableCell></TableRow>
                                        ) : (
                                            filterList(guestItems).map(renderRow)
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default LensList;