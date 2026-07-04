import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AIChatAssistant from './components/common/AIChatAssistant';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Hospitals from './pages/Hospitals';
import HospitalDetail from './pages/HospitalDetail';
import HospitalDoctorProfile from './pages/HospitalDoctorProfile';
import ClinicDoctors from './pages/ClinicDoctors';
import ClinicDoctorDetail from './pages/ClinicDoctorDetail';
import Nurses from './pages/Nurses';
import NurseDetail from './pages/NurseDetail';
import Complaints from './pages/Complaints';
import Consent from './pages/Consent';
import ConsentDetail from './pages/ConsentDetail';
import Physiotherapy from './pages/Physiotherapy';
import PhysioDetail from './pages/PhysioDetail';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Module 1: Hospital Directory */}
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/hospitals/:id" element={<HospitalDetail />} />
              <Route path="/hospitals/doctors/:doctorId" element={<HospitalDoctorProfile />} />

              {/* Module 2: Clinic Doctor + Home Visit */}
              <Route path="/clinic-doctors" element={<ClinicDoctors />} />
              <Route path="/clinic-doctors/:id" element={<ClinicDoctorDetail />} />

              {/* Module 3: Nursing System */}
              <Route path="/nurses" element={<Nurses />} />
              <Route path="/nurses/:id" element={<NurseDetail />} />

              {/* Module 4: Complaint Box */}
              <Route path="/complaints" element={<Complaints />} />

              {/* Module 5: Online Consent */}
              <Route path="/consent" element={
                <ProtectedRoute>
                  <Consent />
                </ProtectedRoute>
              } />
              <Route path="/consent/:id" element={
                <ProtectedRoute>
                  <ConsentDetail />
                </ProtectedRoute>
              } />

              {/* Module 6: Physiotherapy Home Visit */}
              <Route path="/physiotherapy" element={<Physiotherapy />} />
              <Route path="/physiotherapy/:id" element={<PhysioDetail />} />

              {/* User Dashboard / Profile */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
          <AIChatAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}
