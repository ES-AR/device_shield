import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import RegisterDevice from "./pages/RegisterDevice.jsx";
import VerifyDevice from "./pages/VerifyDevice.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportStolen from "./pages/ReportStolen.jsx";
import TransferOwnership from "./pages/TransferOwnership.jsx";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterDevice />} />
        <Route path="/verify" element={<VerifyDevice />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportStolen />} />
        <Route path="/transfer" element={<TransferOwnership />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
