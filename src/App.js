import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wrapper from './components/wrapper';
import HomePage from './pages/homepage'; // Adjusted import path
import LoginPage from './pages/loginpage'; // Adjusted import path
import ProfilePage from './pages/profilepage'; // Adjusted import path
import ProfileCreationPage from './pages/profilecreationpage';
import ExchangeHistoryPage from './pages/exchangehistorypage'; // Adjusted import path
import { AuthProvider } from './components/authcontext'; // Adjusted import path
import ProtectedRoute from './components/protectedroute'; // Adjusted import path
import ExchangePop1 from './pages/exchangepop1';
import ExchangePop2 from './pages/exchangepop2';
import ScrollToTop from './components/scrolltotop';
import EditProfilePage from './pages/editprofilepage';
import PromotionPage from './pages/promotionpage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Wrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profilecreationpage" element={<ProfileCreationPage /> } /> 
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/exchangehistorypage" element={<ProtectedRoute><ExchangeHistoryPage /></ProtectedRoute>} />
            <Route path="/exchangepop1" element={<ProtectedRoute><ExchangePop1 /></ProtectedRoute>} />
            <Route path="/exchangepop2" element={<ProtectedRoute><ExchangePop2 /></ProtectedRoute>} />
            <Route path="/editprofilepage" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/promotionpage" element={<PromotionPage /> } /> 
            {/* Add other routes as needed */}
          </Routes>
        </Wrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
