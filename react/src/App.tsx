import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Pages
import HomePage from './pages/HomePage';
import BlogDetailPage from './pages/BlogDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Types
import { CardOrientation, CardModelType, CardPackType, GoogleReviewCardType } from './types';

function App() {
  const { t } = useTranslation();

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
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
          </Routes>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
