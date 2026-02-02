import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Web3 from "./pages/Web3";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

// ✅ T-Link Pay pages
import TLinkPayHome from "./pages/tlinkpay/TLinkPayHome";
import TLinkPayInvoices from "./pages/tlinkpay/TLinkPayInvoices";
import TLinkPayInvoiceDetail from "./pages/tlinkpay/TLinkPayInvoiceDetail";
import TLinkPayPay from "./pages/tlinkpay/TLinkPayPay";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/web3" element={<Web3 />} />

          {/* ✅ T-Link Pay routes */}
          <Route path="/t-link-pay" element={<TLinkPayHome />} />
          <Route path="/t-link-pay/invoices" element={<TLinkPayInvoices />} />
          <Route path="/t-link-pay/invoices/:invoiceId" element={<TLinkPayInvoiceDetail />} />
          <Route path="/t-link-pay/pay/:invoiceId" element={<TLinkPayPay />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
