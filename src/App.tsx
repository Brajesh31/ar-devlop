import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ScrollRestoration } from "@/components/layout/ScrollRestoration";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { CookieConsent } from "@/components/ui/CookieConsent";

// --- Public Pages ---
import HomePage from "./pages/Home";
import EventsPage from "./pages/Events";
import EventDetailPage from "./pages/EventDetail";
import EventRegisterPage from "./pages/EventDetail/EventRegisterPage";
import AboutPage from "./pages/About";
import HackathonsPage from "./pages/Hackathons";
import HackathonDetailPage from "./pages/HackathonDetail";
import ShowcasePage from "./pages/Showcase";
import ResourcesPage from "./pages/Resources";
import PartnerPage from "./pages/Partner";
import ContactPage from "./pages/Contact";
import AuthPage from "./pages/Auth";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsConditions from "./pages/Legal/TermsConditions";
import CodeOfConduct from "./pages/Legal/CodeOfConduct";
import CookiePolicy from "./pages/Legal/CookiePolicy";
import FAQsPage from "./pages/Support/FAQsPage";
import HelpPage from "./pages/Support/HelpPage";
import CareersPage from "./pages/Careers";
import NotFound from "./pages/NotFound";

// --- Admin Pages ---
import AdminLogin from "./pages/Admin/AdminLogin";
import ResetPassword from "./pages/Admin/ResetPassword";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";

// --- Admin Event Pages ---
import EventsList from "./pages/Admin/Events/EventsList";
import CreateEvent from "./pages/Admin/Events/CreateEvent";
import EventAnalytics from "./pages/Admin/Events/EventAnalytics";
import OverallEventAnalytics from "./pages/Admin/Events/OverallEventAnalytics"; // ✅ Added Import

const queryClient = new QueryClient();

const App = () => (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SmoothScrollProvider>
              <ScrollRestoration />
              <Routes>
                {/* === PUBLIC ROUTES === */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/events/:id/register" element={<EventRegisterPage />} />
                <Route path="/hackathons" element={<HackathonsPage />} />
                <Route path="/hackathons/:id" element={<HackathonDetailPage />} />
                <Route path="/showcase" element={<ShowcasePage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/partner" element={<PartnerPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
                <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />

                {/* Legal & Support */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/code-of-conduct" element={<CodeOfConduct />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/faqs" element={<FAQsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/careers" element={<CareersPage />} />

                {/* === ADMIN AUTH ROUTES === */}
                <Route path="/bharatxrpannelpanneladmin" element={<AdminLogin />} />
                <Route path="/bharatxrpannelpanneladmin/reset" element={<ResetPassword />} />

                {/* === PROTECTED ADMIN DASHBOARD === */}
                <Route path="/admin" element={<AdminLayout />}>
                  {/* Redirect /admin to /admin/dashboard */}
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />

                  {/* Dashboard Main */}
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Events Management Routes */}
                  <Route path="events" element={<EventsList />} />
                  <Route path="events/list" element={<EventsList />} /> {/* ✅ Matches Sidebar Link */}

                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="events/edit/:id" element={<CreateEvent />} /> {/* ✅ Enables Editing */}

                  {/* Analytics must come before :id to prevent conflict */}
                  <Route path="events/analytics" element={<OverallEventAnalytics />} /> {/* ✅ Overall Stats */}
                  <Route path="events/:id" element={<EventAnalytics />} />  {/* ✅ Specific Event */}

                  {/* Future Admin Routes */}
                  {/* <Route path="hackathons/create" element={<CreateHackathon />} /> */}
                </Route>

                {/* === 404 FALLBACK === */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <ScrollToTop />
              <CookieConsent />
            </SmoothScrollProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
);

export default App;