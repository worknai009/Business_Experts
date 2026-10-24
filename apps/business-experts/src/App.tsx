import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AnnouncementBar from "./components/AnnouncementBar";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Popup from "./components/Popup";
import MobileActionDock from "./components/MobileActionDock";
import SearchPalette from "./components/SearchPalette";
import BusinessAiModal from "./components/BusinessAiModal";
import PitchDeckModal from "./components/PitchDeckModal";
import { SiteProvider } from "./context/SiteContext";
import HomePage from "./pages/HomePage";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const MembershipsPage = lazy(() => import("./pages/MembershipsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname, hash]);
  return null;
}

function Loader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="size-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
    </div>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [pitchModalOpen, setPitchModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("be_theme");
  }, []);

  return (
    <SiteProvider>
        <ScrollManager />
        <AnnouncementBar />
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAiModal={() => setAiModalOpen(true)}
        />
        <main className="pb-16 md:pb-0">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenAiModal={() => setAiModalOpen(true)}
                    onOpenPitchModal={() => setPitchModalOpen(true)}
                  />
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/products" element={<Navigate to="/projects" replace />} />
              <Route path="/training-programs" element={<CoursesPage />} />
              <Route path="/training-programs/:slug" element={<CourseDetailPage />} />
              <Route path="/courses" element={<Navigate to="/training-programs" replace />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/memberships" element={<MembershipsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Popup />
        <ChatWidget />

        {/* Global Floating Modals & Mobile Dock */}
        <MobileActionDock
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAiModal={() => setAiModalOpen(true)}
        />
        <SearchPalette
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
        <BusinessAiModal
          open={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
        />
        <PitchDeckModal
          open={pitchModalOpen}
          onClose={() => setPitchModalOpen(false)}
        />
      </SiteProvider>
  );
}
