import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import RegisterAccount from "./pages/RegisterAccount.jsx";
import Login from "./pages/Login.jsx";
import RegisterDevice from "./pages/RegisterDevice.jsx";
import VerifyDevice from "./pages/VerifyDevice.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportStolen from "./pages/ReportStolen.jsx";
import TransferOwnership from "./pages/TransferOwnership.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DeviceDetails from "./pages/DeviceDetails.jsx";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<RegisterAccount />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <RegisterDevice />
            </ProtectedRoute>
          }
        />
        <Route path="/verify" element={<VerifyDevice />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices/:id"
          element={
            <ProtectedRoute>
              <DeviceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportStolen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <TransferOwnership />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  );
};

export default App;
