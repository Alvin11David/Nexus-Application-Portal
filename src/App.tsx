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
import DonatePage from "./pages/DonatePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

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
        <Route path="/donate" element={<DonatePage />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
