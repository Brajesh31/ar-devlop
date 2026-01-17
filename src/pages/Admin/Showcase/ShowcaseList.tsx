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
    Video,
    UserCheck,
    Globe,
    Star,
    StarOff,
    ExternalLink
} from "lucide-react";
import { adminService, ShowcaseItem } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

const ShowcaseList = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    // Data State
    const [verifiedItems, setVerifiedItems] = useState<ShowcaseItem[]>([]);
    const [guestItems, setGuestItems] = useState<ShowcaseItem[]>([]);
    const [activeTab, setActiveTab] = useState("verified");
    const [searchTerm, setSearchTerm] = useState("");

    // Determine page type based on URL
    const getPageType = () => {
        if (location.pathname.includes('approved')) return 'approved';
        if (location.pathname.includes('main-video')) return 'featured'; // Special view
        return 'pending'; // Default
    };

    const pageType = getPageType();
    const statusFilter = pageType === 'featured' ? 'approved' : pageType;

    // 1. Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await adminService.showcase.getAll('showcase', {
                status: statusFilter,
                startDate: '2024-01-01'
            });

            if (response.status === 'success' && response.data) {
                setVerifiedItems(response.data.verified_students);
                setGuestItems(response.data.guest_submissions);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load showcase data.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageType]);

    // 2. Handle Actions
    const handleStatusUpdate = async (id: number, newStatus: 'approved' | 'rejected') => {
        try {
            const result = await adminService.showcase.updateStatus(id, 'showcase', newStatus);
            if (result.status === 'success') {
                toast({ title: "Success", description: `Project marked as ${newStatus}.` });
                fetchData(); // Refresh list
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast({
                title: "Action Failed",
                description: "Could not update status.",
                variant: "destructive"
            });
        }
    };

    // 3. Handle Feature Toggle (Main Page Video)
    const handleFeatureToggle = async (id: number, currentStatus: boolean) => {
        try {
            const result = await adminService.showcase.toggleFeatured(id, !currentStatus);
            if (result.status === 'success') {
                toast({
                    title: !currentStatus ? "Featured!" : "Unfeatured",
                    description: !currentStatus ? "Video is now on the Home Page." : "Video removed from Home Page."
                });
                fetchData();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update featured status.", variant: "destructive" });
        }
    };

    // 4. Filter & Search
    const filterList = (list: ShowcaseItem[]) => {
        let filtered = list.filter(item =>
            item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.project_title?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // If on "Main Page Video" view, show only featured items
        if (pageType === 'featured') {
            filtered = filtered.filter(item => item.is_featured);
        }

        return filtered;
    };

    // 5. Render Table Row
    const renderRow = (item: ShowcaseItem) => {
        // Construct video URL (handle if it's already full URL or relative)
        const videoLink = item.video_url?.startsWith('http')
            ? item.video_url
            : `${API_CONFIG.baseUrl.replace('/api', '')}${item.video_url}`;

        return (
            <TableRow key={item.submission_id}>
                <TableCell>
                    <div className="font-medium">{item.full_name}</div>
                    <div className="text-xs text-muted-foreground">{item.email}</div>
                </TableCell>
                <TableCell>{item.college_name}</TableCell>
                <TableCell>
                    <div className="font-medium">{item.project_title}</div>
                    {item.video_url && (
                        <a
                            href={videoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                            <Video className="w-3 h-3" /> Watch Video
                        </a>
                    )}
                </TableCell>
                <TableCell>
                    {pageType === 'pending' ? (
                        <Badge variant="secondary">Pending Review</Badge>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-fit">Approved</Badge>
                            {item.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 w-fit gap-1">
                                    <Star className="w-3 h-3 fill-yellow-800" /> Featured
                                </Badge>
                            )}
                        </div>
                    )}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        {pageType === 'pending' ? (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleStatusUpdate(item.submission_id, 'approved')}
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleStatusUpdate(item.submission_id, 'rejected')}
                                >
                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                            </>
                        ) : (
                            // Actions for Approved/Featured Page
                            <Button
                                size="sm"
                                variant={item.is_featured ? "default" : "outline"}
                                className={item.is_featured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                onClick={() => handleFeatureToggle(item.submission_id, !!item.is_featured)}
                                title="Toggle Main Page Feature"
                            >
                                {item.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                            </Button>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight capitalize">
                        {pageType === 'featured' ? 'Main Page Video' : `${pageType} Showcases`}
                    </h1>
                    <p className="text-muted-foreground">
                        {pageType === 'pending' ? 'Review and manage incoming video submissions.' :
                            pageType === 'featured' ? 'Select which video appears on the website homepage.' :
                                'Browse verified and approved student projects.'}
                    </p>
                </div>
                {pageType !== 'pending' && (
                    <Button variant="outline" className="gap-2" onClick={() => window.open(adminService.showcase.getExportUrl('showcase', '2024-01-01', '2025-12-31'), '_blank')}>
                        <Download className="w-4 h-4" /> Export Data
                    </Button>
                )}
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search students or projects..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="verified" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="verified" className="gap-2">
                                <UserCheck className="w-4 h-4" /> Verified Students
                                <Badge variant="secondary" className="ml-1 text-xs">{verifiedItems.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="guest" className="gap-2">
                                <Globe className="w-4 h-4" /> Guest Submissions
                                <Badge variant="secondary" className="ml-1 text-xs">{guestItems.length}</Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="verified" className="mt-0">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
                                        ) : filterList(verifiedItems).length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="h-24 text-center">No verified items found.</TableCell></TableRow>
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
                                            <TableHead>College (Input)</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
                                        ) : filterList(guestItems).length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="h-24 text-center">No guest items found.</TableCell></TableRow>
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

export default ShowcaseList;