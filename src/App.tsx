import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";
const Index = lazy(() => import("./pages/Index.tsx"));
const StudyAtVeritas = lazy(() => import("./pages/StudyAtVeritas.tsx"));
const StudyItemPage = lazy(() => import("./pages/StudyItemPage.tsx"));
const StudentsPage = lazy(() => import("./pages/StudentsPage.tsx"));
const ResearchPage = lazy(() => import("./pages/ResearchPage.tsx"));
const ResearchOpportunitiesPage = lazy(
  () => import("./pages/ResearchOpportunitiesPage.tsx"),
);
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const NewsPage = lazy(() => import("./pages/NewsPage.tsx"));
const NewsArticlePage = lazy(() => import("./pages/NewsArticlePage.tsx"));
const QuickLinksPage = lazy(() => import("./pages/QuickLinksPage.tsx"));
const QuickLinkDetailPage = lazy(
  () => import("./pages/QuickLinkDetailPage.tsx"),
);
const LegalPage = lazy(() => import("./pages/LegalPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AboutInstitutePage = lazy(() => import("./pages/AboutInstitutePage.tsx"));
const FactsFiguresPage = lazy(() => import("./pages/FactsFiguresPage.tsx"));
const VisitInstitutePage = lazy(() => import("./pages/VisitInstitutePage.tsx"));
const AlumniPage = lazy(() => import("./pages/AlumniPage.tsx"));
const HistoryTimelinePage = lazy(
  () => import("./pages/HistoryTimelinePage.tsx"),
);
const AdmissionsListsPage = lazy(
  () => import("./pages/AdmissionsListsPage.tsx"),
);
const HowToApplyPage = lazy(() => import("./pages/HowToApplyPage.tsx"));
const CoursesListingsPage = lazy(
  () => import("./pages/CoursesListingsPage.tsx"),
);
const FeesPaymentPage = lazy(() => import("./pages/FeesPaymentPage.tsx"));
const InternationalStudentsPage = lazy(
  () => import("./pages/InternationalStudentsPage.tsx"),
);
const ScholarshipsPage = lazy(() => import("./pages/ScholarshipsPage.tsx"));
const LearningOnlinePage = lazy(() => import("./pages/LearningOnlinePage.tsx"));
const FAQPage = lazy(() => import("./pages/FAQPage.tsx"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage.tsx"));
const ImpactPage = lazy(() => import("./pages/ImpactPage.tsx"));
const DonatePage = lazy(() => import("./pages/DonatePage.tsx"));
const GalleryPage = lazy(() => import("./pages/GalleryPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const ChatBot = lazy(() => import("@/components/ChatBot"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage.tsx"));
import AdminLayout from "@/components/AdminLayout";
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminNewsPage = lazy(() => import("./pages/admin/AdminNewsPage.tsx"));
const AdminFacultyPage = lazy(
  () => import("./pages/admin/AdminFacultyPage.tsx"),
);
const AdminCoursesPage = lazy(
  () => import("./pages/admin/AdminCoursesPage.tsx"),
);
const AdminPagesPage = lazy(() => import("./pages/admin/AdminPagesPage.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background px-8">
    <p className="font-body text-sm tracking-[0.2em] uppercase text-muted-foreground">
      Loading page
    </p>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="news" element={<AdminNewsPage />} />
            <Route path="faculty" element={<AdminFacultyPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="pages" element={<AdminPagesPage />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <PageTransition key={location.pathname}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/study" element={<StudyAtVeritas />} />
            <Route path="/study/:slug" element={<StudyItemPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route
              path="/research/opportunities"
              element={<ResearchOpportunitiesPage />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
            <Route path="/quick-links" element={<QuickLinksPage />} />
            <Route
              path="/quick-links/:slug"
              element={<QuickLinkDetailPage />}
            />
            <Route path="/legal/:slug" element={<LegalPage />} />
            <Route path="/about/institute" element={<AboutInstitutePage />} />
            <Route path="/about/facts-figures" element={<FactsFiguresPage />} />
            <Route path="/about/visit" element={<VisitInstitutePage />} />
            <Route path="/about/alumni" element={<AlumniPage />} />
            <Route path="/about/history" element={<HistoryTimelinePage />} />
            <Route path="/admissions/lists" element={<AdmissionsListsPage />} />
            <Route
              path="/admissions/how-to-apply"
              element={<HowToApplyPage />}
            />
            <Route
              path="/admissions/courses"
              element={<CoursesListingsPage />}
            />
            <Route path="/admissions/fees" element={<FeesPaymentPage />} />
            <Route
              path="/admissions/international"
              element={<InternationalStudentsPage />}
            />
            <Route
              path="/admissions/scholarships"
              element={<ScholarshipsPage />}
            />
            <Route path="/admissions/online" element={<LearningOnlinePage />} />
            <Route path="/admissions/faq" element={<FAQPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
