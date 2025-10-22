import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PetProvider } from "@/context/PetContext";
import Pets from "@/pages/Pets";
import PetDetail from "@/pages/PetDetail";
import AddPet from "@/pages/AddPet";
import Alerts from "@/pages/Alerts";
import Forum from "@/pages/Forum";
import Care from "@/pages/Care";
import SignIn from "@/pages/SignIn";
import Forgot from "@/pages/Forgot";
import Account from "@/pages/Account";
import ResetPassword from "@/pages/ResetPassword";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PetProvider>
        <AuthProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/pets/:id" element={<PetDetail />} />
                <Route path="/add-pet" element={<AddPet />} />
                <Route path="/care" element={<Care />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/account" element={<Account />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/forum" element={<Forum />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </AuthProvider>
      </PetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
