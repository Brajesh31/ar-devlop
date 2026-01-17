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
import OverallEventAnalytics from "./pages/Admin/Events/OverallEventAnalytics";

// --- Admin Hackathon Pages (NEW) ---
import HackathonsList from "./pages/Admin/Hackathons/HackathonsList";
import CreateHackathon from "./pages/Admin/Hackathons/CreateHackathon";
import HackathonManager from "./pages/Admin/Hackathons/HackathonManager";

// --- Showcase & Lens Pages ---
import { SubmitProjectPage } from "./pages/Showcase/SubmitProjectPage";
import { SubmitLensPage } from "./pages/Showcase/SubmitLensPage";

// --- Student Pages ---
import StudentLayout from "./components/layout/StudentLayout";
import StudentDashboard from "./pages/Student/Dashboard";

// ⚠️ Uncomment these imports once you create the files
import MyEvents from "./pages/Student/MyEvents";
// import MyHackathons from "./pages/Student/MyHackathons";
// import ShowcaseSubmission from "./pages/Student/Showcase/ShowcaseSubmission";
// import LensSubmission from "./pages/Student/Lens/LensSubmission";
// import StudentSurveys from "./pages/Student/StudentSurveys";
// import StudentProfile from "./pages/Student/StudentProfile";

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
                <Route path="/showcase/SubmitProjectPage" element={<SubmitProjectPage />} />
                <Route path="/showcase/SubmitLensPage" element={<SubmitLensPage />} />

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
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Events Management */}
                  <Route path="events" element={<EventsList />} />
                  <Route path="events/list" element={<EventsList />} />
                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="events/edit/:id" element={<CreateEvent />} />
                  <Route path="events/analytics" element={<OverallEventAnalytics />} />
                  <Route path="events/:id" element={<EventAnalytics />} />

                  {/* Hackathons Management (NEW) */}
                  <Route path="hackathons" element={<HackathonsList />} />
                  <Route path="hackathons/list" element={<HackathonsList />} />
                  <Route path="hackathons/create" element={<CreateHackathon />} />
                  <Route path="hackathons/manage/:id" element={<HackathonManager />} />
                  {/* Note: Edit route can reuse Create or separate Edit component if needed later */}
                  <Route path="hackathons/edit/:id" element={<CreateHackathon />} />
                </Route>

                {/* === PROTECTED STUDENT DASHBOARD === */}
                <Route path="/student" element={<StudentLayout />}>
                  <Route index element={<Navigate to="/student/dashboard" replace />} />
                  <Route path="dashboard" element={<StudentDashboard />} />

                  {/* ✅ Student Routes */}
                  <Route path="events" element={<MyEvents />} />
                  {/* <Route path="hackathons" element={<MyHackathons />} /> */}

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>

                {/* === 404 FALLBACK === */}
                <Route path="/404" element={<NotFound />} />
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