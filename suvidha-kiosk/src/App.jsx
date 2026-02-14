import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./i18n";

import KioskLayout from "./layouts/KioskLayout";
import AdminLayout from "./layouts/AdminLayout";

import LanguageSelect from "./pages/kiosk/LanguageSelect";
import Home from "./pages/kiosk/Home";
import DepartmentServices from "./pages/kiosk/DepartmentServices";
import CitizenLogin from "./pages/kiosk/CitizenLogin";
import OTPVerify from "./pages/kiosk/OTPVerify";
import ServiceForm from "./pages/kiosk/ServiceForm";
import UploadViaQR from "./pages/kiosk/UploadViaQR";
import ReviewSubmit from "./pages/kiosk/ReviewSubmit";
import Receipt from "./pages/kiosk/Receipt";
import TrackStatus from "./pages/kiosk/TrackStatus";
import Alerts from "./pages/kiosk/Alerts";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TicketDetails from "./pages/admin/TicketDetails";
import Analytics from "./pages/admin/Analytics";

import PhoneUpload from "./pages/phone/PhoneUpload";

import ProtectedRoute from "./shared/ProtectedRoute";
import AdminProtectedRoute from "./shared/AdminProtectedRoute";
import { useKioskStore } from "./store/kioskStore";

export default function App() {
  const { citizen, service, formData, ticket, lastReceipt } = useKioskStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* KIOSK */}
        <Route element={<KioskLayout />}>
          <Route path="/" element={<Navigate to="/language" replace />} />

          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services/:dept" element={<DepartmentServices />} />

          <Route path="/login" element={<CitizenLogin />} />

          {/* ✅ OTP page should not open unless phone exists */}
          <Route
            path="/otp"
            element={
              <ProtectedRoute
                allow={!!citizen?.phone}
                redirectTo="/login"
              >
                <OTPVerify />
              </ProtectedRoute>
            }
          />

          {/* ✅ Form page should not open unless service selected */}
          <Route
            path="/form"
            element={
              <ProtectedRoute
                allow={!!service?.id}
                redirectTo="/home"
              >
                <ServiceForm />
              </ProtectedRoute>
            }
          />

          {/* ✅ Review page should not open unless formData exists */}
          <Route
            path="/review"
            element={
              <ProtectedRoute
                allow={!!service?.id && Object.keys(formData || {}).length > 0}
                redirectTo="/form"
              >
                <ReviewSubmit />
              </ProtectedRoute>
            }
          />

          {/* ✅ Upload QR should not open unless ticket exists */}
          <Route
            path="/upload-qr"
            element={
              <ProtectedRoute
                allow={!!ticket?.id}
                redirectTo="/review"
              >
                <UploadViaQR />
              </ProtectedRoute>
            }
          />

          {/* ✅ Receipt should not open unless receipt exists */}
          <Route
            path="/receipt"
            element={
              <ProtectedRoute
                allow={!!lastReceipt?.requestId}
                redirectTo="/home"
              >
                <Receipt />
              </ProtectedRoute>
            }
          />

          <Route path="/track" element={<TrackStatus />} />
          <Route path="/alerts" element={<Alerts />} />
        </Route>

        {/* ADMIN */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard"element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}/>          
          <Route path="/admin/tickets/:id" element={<TicketDetails />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>

        {/* PHONE UPLOAD (from QR) */}
        <Route path="/upload/:sessionId" element={<PhoneUpload />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/language" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
