import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Type, Image as ImageIcon, Loader2, ArrowLeft, Plus, Trash2, Trophy, HelpCircle, Clock, CheckCircle, Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormDescription
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/api';

const CreateEvent = () => {
    const { id } = useParams(); // Check for ID to determine Edit Mode
    const isEditMode = !!id;

    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!id);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [existingBanner, setExistingBanner] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            title: "",
            slug: "", // <--- NEW FIELD
            subtitle: "",
            description: "",
            long_description: "",
            event_type: "workshop",
            start_date: "",
            end_date: "",
            registration_deadline: "",
            mode: "online",
            venue_name: "",
            location_city: "",
            fee_type: "free",
            price: "0",
            team_size: "Individual",
            terms_conditions: "",
            rewards: [{ position: "", prize: "" }],
            faqs: [{ question: "", answer: "" }],
            timeline: [{ title: "", date: "", description: "" }],
            tags: "",
            eligibility_age: "18+",
            eligibility_region: "Global"
        },
    });

    const { fields: rewardFields, append: addReward, remove: removeReward } = useFieldArray({ control: form.control, name: "rewards" });
    const { fields: faqFields, append: addFaq, remove: removeFaq } = useFieldArray({ control: form.control, name: "faqs" });
    const { fields: timelineFields, append: addTimeline, remove: removeTimeline } = useFieldArray({ control: form.control, name: "timeline" });

    // --- 1. FETCH DATA IF EDITING ---
    useEffect(() => {
        if (isEditMode) {
            const loadEvent = async () => {
                try {
                    const res = await adminService.events.getDetails(id);
                    if (res.status === 'success' && res.event) {
                        const e = res.event;

                        // Helper to safely parse JSON
                        const parse = (jsonStr: string) => {
                            try { return JSON.parse(jsonStr) || [] } catch { return [] }
                        };

                        // Parse Eligibility separately as it's an object
                        let eligibility = { age: "18+", region: "Global" };
                        try {
                            const parsedElig = JSON.parse(e.eligibility);
                            if (parsedElig) eligibility = parsedElig;
                        } catch (err) { /* ignore */ }

                        // Reset form with fetched data
                        form.reset({
                            title: e.title,
                            slug: e.slug || "", // <--- LOAD EXISTING SLUG
                            subtitle: e.subtitle || "",
                            description: e.description || "",
                            long_description: e.long_description || "",
                            event_type: e.event_type || "workshop",
                            // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
                            start_date: e.start_date ? e.start_date.replace(" ", "T").slice(0, 16) : "",
                            end_date: e.end_date ? e.end_date.replace(" ", "T").slice(0, 16) : "",
                            registration_deadline: e.registration_deadline ? e.registration_deadline.replace(" ", "T").slice(0, 16) : "",
                            mode: e.mode || "online",
                            venue_name: e.venue_name || "",
                            location_city: e.location_city || "",
                            fee_type: e.fee_type || "free",
                            price: e.price || "0",
                            team_size: e.team_size || "Individual",
                            terms_conditions: e.terms_conditions || "",
                            rewards: parse(e.rewards),
                            faqs: parse(e.faqs),
                            timeline: parse(e.timeline),
                            tags: parse(e.tags).join(', '), // Convert array back to string
                            eligibility_age: eligibility.age || "18+",
                            eligibility_region: eligibility.region || "Global"
                        });
                        setExistingBanner(e.banner_image_url);
                    } else {
                        throw new Error("Event not found");
                    }
                } catch (error) {
                    toast({ title: "Error", description: "Failed to load event details.", variant: "destructive" });
                    navigate('/admin/events');
                } finally {
                    setIsFetching(false);
                }
            };
            loadEvent();
        }
    }, [id, isEditMode, form, navigate, toast]);

    // --- Helper to auto-generate slug from title ---
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        form.setValue("title", title);

        // Only auto-generate slug if it's empty or we are creating new
        if (!isEditMode && !form.getValues("slug")) {
            const autoSlug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
                .replace(/^-+|-+$/g, '');   // Trim hyphens
            form.setValue("slug", autoSlug);
        }
    };

    // --- 2. SUBMIT HANDLER ---
    const onSubmit = async (values: any) => {
        // Validation: Image is mandatory only for creation
        if (!isEditMode && !bannerFile) {
            toast({ title: "Image Required", description: "Please upload a banner image.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            let bannerUrl = existingBanner;

            // Upload new image if user selected one
            if (bannerFile) {
                const uploadRes = await adminService.uploadImage(bannerFile);
                if (uploadRes.status === 'success' && uploadRes.url) {
                    bannerUrl = uploadRes.url;
                } else {
                    throw new Error("Image upload failed.");
                }
            }

            // Prepare Payload
            const eventData = {
                ...values,
                event_id: id, // Required for Update
                banner_image_url: bannerUrl,
                tags: values.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
                eligibility: {
                    age: values.eligibility_age,
                    region: values.eligibility_region,
                    openFor: ["Students", "Developers"]
                }
            };

            // Call Create or Update API
            let response;
            if (isEditMode) {
                response = await adminService.events.update(eventData);
            } else {
                response = await adminService.events.create(eventData);
            }

            if (response.status === 'success') {
                toast({
                    title: isEditMode ? "Event Updated" : "Event Created",
                    description: "Changes have been saved successfully.",
                    className: "bg-green-50 text-green-900"
                });
                navigate('/admin/events');
            } else {
                throw new Error(response.message);
            }

        } catch (error: any) {
            console.error("Submit Error:", error);
            toast({ title: "Error", description: error.message || "Operation failed", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#FF6B35]" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/events')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? "Edit Event" : "Create New Event"}</h1>
                    <p className="text-slate-500">{isEditMode ? "Update event details and settings." : "Add details. A dedicated database table will be created automatically."}</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Basic Info */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" /> Basic Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Title *</FormLabel>
                                        <FormControl>
                                            <Input {...field} onChange={handleTitleChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />

                                {/* --- CUSTOM SLUG INPUT --- */}
                                <FormField control={form.control} name="slug" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Custom URL (Slug) *</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <span className="bg-slate-100 border border-r-0 rounded-l-md px-3 py-2 text-xs text-slate-500 hidden xl:block">
                                                    events/
                                                </span>
                                                <Input {...field} placeholder="my-custom-event-name" className="xl:rounded-l-none" />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Unique ID for the URL. Use letters, numbers, and hyphens only.
                                        </FormDescription>
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="event_type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="workshop">Workshop</SelectItem>
                                                <SelectItem value="hackathon">Hackathon</SelectItem>
                                                <SelectItem value="meetup">Meetup</SelectItem>
                                                <SelectItem value="challenge">Challenge</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="subtitle" render={({ field }) => (
                                    <FormItem><FormLabel>Short Tagline</FormLabel><FormControl><Input placeholder="e.g. India's biggest XR meet" {...field} /></FormControl></FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Short Description (Card View)</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="long_description" render={({ field }) => (
                                <FormItem><FormLabel>Full Description (Detail Page)</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="tags" render={({ field }) => (
                                <FormItem><FormLabel>Tags (comma separated)</FormLabel><FormControl><Input placeholder="AR, VR, Coding" {...field} /></FormControl></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Banner Image */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Banner Image</CardTitle></CardHeader>
                        <CardContent>
                            {existingBanner && !bannerFile && (
                                <div className="mb-4 relative w-fit group">
                                    <img src={existingBanner} alt="Current" className="h-40 w-auto rounded-lg object-cover border" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity text-white text-xs">
                                        Current Image
                                    </div>
                                </div>
                            )}
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
                                <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="hidden" id="banner-upload" />
                                <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <ImageIcon className="w-10 h-10 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700">
                                        {bannerFile ? <span className="text-green-600">{bannerFile.name}</span> : (isEditMode ? "Click to change banner (Optional)" : "Click to upload banner")}
                                    </span>
                                    <span className="text-xs text-slate-400">JPG, PNG or WEBP (Max 5MB)</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logistics */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> When & Where</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="start_date" render={({ field }) => (
                                    <FormItem><FormLabel>Start Date *</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="end_date" render={({ field }) => (
                                    <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="registration_deadline" render={({ field }) => (
                                    <FormItem><FormLabel>Reg. Deadline</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="mode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mode</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="online">Online</SelectItem><SelectItem value="offline">Offline</SelectItem></SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="location_city" render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="venue_name" render={({ field }) => (
                                    <FormItem><FormLabel>Venue</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Eligibility & Fee */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Eligibility & Fee</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="eligibility_age" render={({ field }) => (
                                    <FormItem><FormLabel>Min Age</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="eligibility_region" render={({ field }) => (
                                    <FormItem><FormLabel>Region</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="team_size" render={({ field }) => (
                                    <FormItem><FormLabel>Team Size</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="fee_type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fee Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="paid">Paid</SelectItem></SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="price" render={({ field }) => (
                                    <FormItem><FormLabel>Price (₹)</FormLabel><FormControl><Input type="number" {...field} disabled={form.watch('fee_type') === 'free'} /></FormControl></FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rewards */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Rewards</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={() => addReward({ position: "", prize: "" })}><Plus className="w-4 h-4 mr-2" /> Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rewardFields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-end">
                                    <FormField control={form.control} name={`rewards.${index}.position`} render={({ field }) => (
                                        <FormItem className="flex-1"><FormControl><Input placeholder="Position" {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name={`rewards.${index}.prize`} render={({ field }) => (
                                        <FormItem className="flex-[2]"><FormControl><Input placeholder="Prize" {...field} /></FormControl></FormItem>
                                    )} />
                                    <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeReward(index)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* FAQs */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5" /> FAQs</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={() => addFaq({ question: "", answer: "" })}><Plus className="w-4 h-4 mr-2" /> Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {faqFields.map((field, index) => (
                                <div key={field.id} className="space-y-2 p-4 border rounded-lg bg-slate-50/50">
                                    <div className="flex justify-between">
                                        <FormField control={form.control} name={`faqs.${index}.question`} render={({ field }) => (
                                            <FormItem className="flex-1 mr-4"><FormControl><Input placeholder="Question" {...field} /></FormControl></FormItem>
                                        )} />
                                        <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeFaq(index)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                    <FormField control={form.control} name={`faqs.${index}.answer`} render={({ field }) => (
                                        <FormItem><FormControl><Textarea placeholder="Answer" {...field} /></FormControl></FormItem>
                                    )} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Terms</CardTitle></CardHeader>
                        <CardContent>
                            <FormField control={form.control} name="terms_conditions" render={({ field }) => (
                                <FormItem><FormControl><Textarea placeholder="Event terms..." {...field} /></FormControl></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="sticky bottom-4 z-10">
                        <Button type="submit" size="lg" className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] shadow-xl text-lg h-14" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : (isEditMode ? "Update Event" : "Create Event")}
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default CreateEvent;