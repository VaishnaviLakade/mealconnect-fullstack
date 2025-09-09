import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DLogin from "./pages/DLogin";
import DSignup from "./pages/DSignup";
import ULogin from "./pages/Ulogin";
import USignup from "./pages/USignup";
import Dashboard from "./pages/Dashboard"; // Donor Dashboard
import UDashboard from "./pages/UDashboard"; // User Dashboard
import DonateFood from "./pages/Donatefood";
import Findfood from "./pages/Findfood";
import Landing from "./pages/Landing";
import Chatbot from "./components/Chatbot";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import RequestFood from "./pages/request";
import CurrentDonation from "./pages/Current_donation";
import PastDonations from "./pages/Past_donation";
import Rewards from "./pages/Rewards";
import Analytics from "./pages/Analytics";
import AddReceiver from "./pages/AddReceiver";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 relative">
        <Navbar />

        <Routes>
          <Route path="/home" element={<Landing />} />
          <Route path="/donor-login" element={<DLogin />} />
          <Route path="/donor-signup" element={<DSignup />} />
          <Route path="/user-login" element={<ULogin />} />
          <Route path="/user-signup" element={<USignup />} />
          <Route path="/find-food" element={<Findfood />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-request" element={<RequestFood />} />

          {/*  PERSISTENT DONOR DASHBOARD WITH NESTED ROUTES */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DonateFood />} /> {/* Default Section */}
            <Route path="donate" element={<DonateFood />} />
            <Route path="addrec" element={<AddReceiver />} />
            <Route path="current-donation" element={<CurrentDonation />} />
            <Route path="past-donations" element={<PastDonations />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/*  USER DASHBOARD WITH POSSIBLE NESTED ROUTES (IF NEEDED) */}
          <Route path="/user-dashboard" element={<UDashboard />}>
            {/* Add nested user dashboard sections here if required */}
          </Route>
        </Routes>

        <Chatbot />
      </div>
    </Router>
  );
}
