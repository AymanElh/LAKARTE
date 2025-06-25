import React from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhatsAppButton: React.FC = () => {
  const { t } = useTranslation();
  const phoneNumber = '+212691600160';
  const message = encodeURIComponent(t('whatsapp.message'));
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <Phone size={24} />
    </a>
  );
};

export default WhatsAppButton;