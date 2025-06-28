import React from 'react';
import { CreditCard } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center space-x-2">
      <CreditCard className="text-gold-500" size={32} />
      <span className="text-2xl font-bold text-primary-900">LA<span className="text-gold-500">KARTE</span></span>
    </a>
  );
};

export default Logo;