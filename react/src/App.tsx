import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PacksPage from './pages/PacksPage';
import CustomizePage from './pages/CustomizePage';
import TemplatesPage from './pages/TemplatesPage';

// Types
import { CardOrientation, CardModelType, CardPackType, GoogleReviewCardType } from './types';

function App() {
  // State to track the form's visibility and selected card type
  const [selectedCardType, setSelectedCardType] = useState<'nfc' | 'google' | null>(null);

  // NFC Card form state
  const [nfcFormData, setNfcFormData] = useState({
    orientation: 'vertical' as CardOrientation,
    model: 'white' as CardModelType,
    pack: 'standard' as CardPackType,
    template: '',
    firstName: '',
    lastName: '',
    position: '',
    website: '',
    phoneNumber: '',
    emailAddress: '',
    logo: null as File | null,
    briefing: ''
  });

  // Google Reviews form state
  const [googleFormData, setGoogleFormData] = useState({
    type: 'standard' as GoogleReviewCardType,
    template: '',
    quantity: 100,
    businessName: '',
    website: '',
    logo: null as File | null,
  });

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    selectedCardType={selectedCardType}
                    setSelectedCardType={setSelectedCardType}
                    nfcFormData={nfcFormData}
                    setNfcFormData={setNfcFormData}
                    googleFormData={googleFormData}
                    setGoogleFormData={setGoogleFormData}
                  />
                }
              />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/customize" element={<CustomizePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/packs" element={<PacksPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
            </Routes>
          </main>

          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
