import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout"; // Import MainLayout
import Inventory from "./pages/Inventory"; // Import Inventory page
import Needs from "./pages/Needs"; // Import Needs page
import Ideas from "./pages/Ideas"; // Import Ideas page
import Budget from "./pages/Budget"; // Import Budget page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to /inventory */}
          <Route path="/" element={<Navigate to="/inventory" replace />} />

          {/* Use MainLayout for nested routes */}
          <Route element={<MainLayout />}>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/needs" element={<Needs />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/budget" element={<Budget />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;