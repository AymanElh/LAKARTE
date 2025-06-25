import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import GallerySection from '../components/sections/GallerySection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import NfcAnimationSection from '../components/sections/NfcAnimationSection';
import CategorySelection from '../components/sections/CategorySelection';
import NfcCardForm from '../components/sections/NfcCardForm';
import GoogleReviewsForm from '../components/sections/GoogleReviewsForm';
import StatisticsSection from '../components/sections/StatisticsSection';
import PaymentSection from '../components/sections/PaymentSection';
import BlogSection from '../components/sections/BlogSection';

interface HomePageProps {
  selectedCardType: 'nfc' | 'google' | null;
  setSelectedCardType: (type: 'nfc' | 'google') => void;
  nfcFormData: any;
  setNfcFormData: React.Dispatch<React.SetStateAction<any>>;
  googleFormData: any;
  setGoogleFormData: React.Dispatch<React.SetStateAction<any>>;
}

const HomePage: React.FC<HomePageProps> = ({
  selectedCardType,
  setSelectedCardType,
  nfcFormData,
  setNfcFormData,
  googleFormData,
  setGoogleFormData
}) => {
  return (
    <>
      <HeroSection />
      <GallerySection />
      <TestimonialsSection />
      <NfcAnimationSection />
      
      <div id="customize" className="scroll-mt-24">
        <CategorySelection onSelectType={setSelectedCardType} />
        
        {selectedCardType === 'nfc' && (
          <NfcCardForm 
            formData={nfcFormData}
            setFormData={setNfcFormData}
          />
        )}
        
        {selectedCardType === 'google' && (
          <GoogleReviewsForm 
            formData={googleFormData}
            setFormData={setGoogleFormData}
          />
        )}
      </div>
      
      <StatisticsSection />
      <PaymentSection 
        cardType={selectedCardType}
        nfcFormData={nfcFormData}
        googleFormData={googleFormData}
      />
      <BlogSection />
    </>
  );
};

export default HomePage;