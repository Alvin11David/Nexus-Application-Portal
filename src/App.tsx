import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index.tsx";
import StudyAtVeritas from "./pages/StudyAtVeritas.tsx";
import StudyItemPage from "./pages/StudyItemPage.tsx";
import StudentsPage from "./pages/StudentsPage.tsx";
import ResearchPage from "./pages/ResearchPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import NewsPage from "./pages/NewsPage.tsx";
import QuickLinksPage from "./pages/QuickLinksPage.tsx";
import NotFound from "./pages/NotFound.tsx";
// About Section
import AboutInstitutePage from "./pages/AboutInstitutePage.tsx";
import FactsFiguresPage from "./pages/FactsFiguresPage.tsx";
import VisitInstitutePage from "./pages/VisitInstitutePage.tsx";
import AlumniPage from "./pages/AlumniPage.tsx";
import HistoryTimelinePage from "./pages/HistoryTimelinePage.tsx";
// Admissions Section
import AdmissionsListsPage from "./pages/AdmissionsListsPage.tsx";
import HowToApplyPage from "./pages/HowToApplyPage.tsx";
import CoursesListingsPage from "./pages/CoursesListingsPage.tsx";
import FeesPaymentPage from "./pages/FeesPaymentPage.tsx";
import InternationalStudentsPage from "./pages/InternationalStudentsPage.tsx";
import ScholarshipsPage from "./pages/ScholarshipsPage.tsx";
import LearningOnlinePage from "./pages/LearningOnlinePage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
import ChatBot from "@/components/ChatBot";
// Admin
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminNewsPage from "./pages/admin/AdminNewsPage.tsx";
import AdminFacultyPage from "./pages/admin/AdminFacultyPage.tsx";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage.tsx";
import AdminPagesPage from "./pages/admin/AdminPagesPage.tsx";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
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
    );
  }

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/study" element={<StudyAtVeritas />} />
        <Route path="/study/:slug" element={<StudyItemPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/quick-links" element={<QuickLinksPage />} />
        {/* About Section */}
        <Route path="/about/institute" element={<AboutInstitutePage />} />
        <Route path="/about/facts-figures" element={<FactsFiguresPage />} />
        <Route path="/about/visit" element={<VisitInstitutePage />} />
        <Route path="/about/alumni" element={<AlumniPage />} />
        <Route path="/about/history" element={<HistoryTimelinePage />} />
        {/* Admissions Section */}
        <Route path="/admissions/lists" element={<AdmissionsListsPage />} />
        <Route path="/admissions/how-to-apply" element={<HowToApplyPage />} />
        <Route path="/admissions/courses" element={<CoursesListingsPage />} />
        <Route path="/admissions/fees" element={<FeesPaymentPage />} />
        <Route path="/admissions/international" element={<InternationalStudentsPage />} />
        <Route path="/admissions/scholarships" element={<ScholarshipsPage />} />
        <Route path="/admissions/online" element={<LearningOnlinePage />} />
        <Route path="/admissions/faq" element={<FAQPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
