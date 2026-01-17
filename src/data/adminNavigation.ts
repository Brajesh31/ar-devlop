import {
    LayoutDashboard,
    BarChart2,
    Calendar,
    Trophy,
    Users,
    School,
    MonitorPlay, // For Showcase
    FileText,
    Briefcase,
    Award,
    PenTool,
    LifeBuoy,
    Handshake,
    Settings,
    PlusCircle,
    List,
    CheckCircle,
    XCircle,
    Clock,
    Video,
    File,
    History,
    Activity,
    Globe,
    Database,
    Search,
    Target,
    Smartphone,
    MousePointer,
    UserCheck,
    Cpu,
    Glasses // Using 'Glasses' or 'Link' for Lens
} from 'lucide-react';

export interface NavItem {
    title: string;
    url?: string;
    icon?: any;
    items?: NavItem[];
}

export const adminNavigation: NavItem[] = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Analytics",
        icon: BarChart2,
        items: [
            {
                title: "Google Analytics",
                url: "/admin/analytics/google",
                icon: Globe,
            },
            {
                title: "Database Analytics",
                icon: Database,
                items: [
                    { title: "Reports Snapshot", url: "/admin/analytics/db/snapshot", icon: FileText },
                    {
                        title: "Realtime",
                        icon: Clock,
                        items: [
                            { title: "Overview", url: "/admin/analytics/db/realtime/overview" },
                            { title: "Pages & Screens", url: "/admin/analytics/db/realtime/pages" },
                        ]
                    },
                    {
                        title: "Business Objectives",
                        icon: Target,
                        items: [
                            {
                                title: "Generate Leads",
                                items: [
                                    { title: "Overview", url: "/admin/analytics/db/leads/overview" },
                                    { title: "Audiences", url: "/admin/analytics/db/leads/audiences" },
                                    { title: "User Acquisition", url: "/admin/analytics/db/leads/acquisition" },
                                    { title: "Traffic Acquisition", url: "/admin/analytics/db/leads/traffic" },
                                    { title: "Landing Page", url: "/admin/analytics/db/leads/landing" },
                                    { title: "Cohorts", url: "/admin/analytics/db/leads/cohorts" },
                                ]
                            }
                        ]
                    },
                    {
                        title: "User Engagement",
                        icon: MousePointer,
                        items: [
                            { title: "Overview", url: "/admin/analytics/db/engagement/overview" },
                            { title: "Events", url: "/admin/analytics/db/engagement/events" },
                            { title: "Pages and Screens", url: "/admin/analytics/db/engagement/pages" },
                        ]
                    },
                    {
                        title: "User Attributes",
                        icon: UserCheck,
                        items: [
                            { title: "Overview", url: "/admin/analytics/db/users/overview" },
                            { title: "Demographic Details", url: "/admin/analytics/db/users/demographics" },
                            { title: "Audiences", url: "/admin/analytics/db/users/audiences" },
                        ]
                    },
                    {
                        title: "Tech Details",
                        url: "/admin/analytics/db/tech",
                        icon: Cpu
                    }
                ]
            }
        ]
    },
    {
        title: "Events",
        icon: Calendar,
        items: [
            { title: "Create Event", url: "/admin/events/create", icon: PlusCircle },
            { title: "View All Events", url: "/admin/events", icon: List },
            { title: "Overall Analytics", url: "/admin/events/analytics", icon: BarChart2 },
            { title: "Event Posts", url: "/admin/events/posts" },
            { title: "Speakers", url: "/admin/events/speakers" },
            { title: "Forms & Feedback", url: "/admin/events/forms" },
        ]
    },
    {
        title: "Hackathons",
        icon: Trophy,
        items: [
            { title: "Create Hackathon", url: "/admin/hackathons/create", icon: PlusCircle },
            { title: "View Hackathons", url: "/admin/hackathons/list", icon: List },
            { title: "Analytics", url: "/admin/hackathons/analytics", icon: BarChart2 },
            { title: "Mentors & Judges", url: "/admin/hackathons/people" },
        ]
    },
    {
        title: "Students",
        icon: Users,
        items: [
            { title: "Student List", url: "/admin/students/list" },
            { title: "Verifications", url: "/admin/students/verifications" },
        ]
    },
    {
        title: "Colleges",
        icon: School,
        items: [
            { title: "College List", url: "/admin/colleges/list" },
            { title: "College Analytics", url: "/admin/colleges/analytics" },
        ]
    },

    // === UPDATED SECTION: SHOWCASE ===
    {
        title: "Showcase (Videos)",
        icon: MonitorPlay,
        items: [
            { title: "Manage All Videos", url: "/admin/showcase/manage", icon: List }, // Unified Pending/Approved Table
            { title: "Export Data (CSV)", url: "/admin/showcase/export", icon: FileText },
            { title: "View Live Gallery", url: "/showcase", icon: Globe }, // Direct link to website
        ]
    },

    // === UPDATED SECTION: LENS ===
    {
        title: "Lens Submissions",
        icon: Glasses, // Or Link
        items: [
            { title: "Manage All Lenses", url: "/admin/lens/manage", icon: List }, // Unified Pending/Verified Table
            { title: "Export Data (CSV)", url: "/admin/lens/export", icon: FileText },
            { title: "View Live Gallery", url: "/lens", icon: Globe },
        ]
    },

    {
        title: "Resources",
        icon: FileText,
        items: [
            { title: "Documents", url: "/admin/resources/docs", icon: File },
            { title: "Videos", url: "/admin/resources/videos", icon: Video },
            { title: "Add Resource", url: "/admin/resources/create", icon: PlusCircle },
        ]
    },
    {
        title: "Careers",
        icon: Briefcase,
        items: [
            { title: "Post New Job", url: "/admin/careers/create", icon: PlusCircle },
            { title: "Active Jobs", url: "/admin/careers/active", icon: Activity },
            { title: "Job History", url: "/admin/careers/history", icon: History },
        ]
    },
    {
        title: "Ambassador Program",
        icon: Award,
        items: [
            { title: "Ambassador Tasks", url: "/admin/ambassador/tasks" },
            { title: "Program Analytics", url: "/admin/ambassador/analytics" },
        ]
    },
    {
        title: "Blogs",
        icon: PenTool,
        items: [
            { title: "Main Panel", url: "/admin/blogs/main" },
            { title: "Approved Blogs", url: "/admin/blogs/approved", icon: CheckCircle },
            { title: "Rejected Blogs", url: "/admin/blogs/rejected", icon: XCircle },
        ]
    },
    {
        title: "Support & Issues",
        icon: LifeBuoy,
        items: [
            { title: "Log New Issue", url: "/admin/support/log", icon: PlusCircle },
            { title: "Open Issues", url: "/admin/support/open", icon: Clock },
            { title: "Fixed Issues", url: "/admin/support/fixed", icon: CheckCircle },
        ]
    },
    {
        title: "Partners",
        icon: Handshake,
        items: [
            { title: "Directory", url: "/admin/partners/list" },
            { title: "Sponsorships", url: "/admin/partners/sponsorships" },
        ]
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
];