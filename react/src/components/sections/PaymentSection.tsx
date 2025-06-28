import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CreditCard, DollarSign, ArrowRight } from 'lucide-react';

// Types
import { PersonalizationFormData, GoogleReviewFormData } from '../../types';

interface PaymentSectionProps {
  cardType: 'nfc' | 'google' | null;
  nfcFormData: PersonalizationFormData;
  googleFormData: GoogleReviewFormData;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ 
  cardType, 
  nfcFormData, 
  googleFormData 
}) => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  return (
    <section id="payment" className="section bg-primary-50 py-20" ref={ref}>
      <div className="container-custom">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            {t('payment.title')}
          </motion.h2>
        </div>
        
        <div className="max-w-4xl mx-auto mt-10">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-primary-900 text-white p-6">
              <h3 className="text-xl font-medium">{cardType === 'nfc' ? 'Carte NFC Personnalisée' : 'Carte Google Reviews'}</h3>
            </div>
            
            <div className="p-6">
              {/* Payment Summary */}
              {cardType === 'nfc' && (
                <div className="mb-8">
                  <div className="flex justify-between py-2 border-b border-primary-200">
                    <span>Type de pack:</span>
                    <span className="font-medium">
                      {nfcFormData.pack === 'standard' 
                        ? 'Pack Standard' 
                        : nfcFormData.pack === 'professional' 
                          ? 'Pack Professionnel' 
                          : 'Pack Sur Mesure'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-200">
                    <span>Modèle de carte:</span>
                    <span className="font-medium">
                      {nfcFormData.model.charAt(0).toUpperCase() + nfcFormData.model.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-200">
                    <span>Prix base:</span>
                    <span className="font-medium">
                      {nfcFormData.pack === 'standard' 
                        ? '165 Dhs' 
                        : nfcFormData.pack === 'professional' 
                          ? '185 Dhs' 
                          : '235 Dhs'}
                    </span>
                  </div>
                  {nfcFormData.model !== 'white' && (
                    <div className="flex justify-between py-2 border-b border-primary-200">
                      <span>Supplément modèle:</span>
                      <span className="font-medium">
                        {nfcFormData.model === 'black' ? '+10 Dhs' : '+15 Dhs'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 font-bold text-lg">
                    <span>TOTAL:</span>
                    <span className="text-gold-600">
                      {nfcFormData.pack === 'standard' 
                        ? nfcFormData.model === 'white' 
                          ? '165 Dhs' 
                          : nfcFormData.model === 'black' 
                            ? '175 Dhs' 
                            : '180 Dhs' 
                        : nfcFormData.pack === 'professional' 
                          ? nfcFormData.model === 'white' 
                            ? '185 Dhs' 
                            : nfcFormData.model === 'black' 
                              ? '195 Dhs' 
                              : '200 Dhs'
                          : nfcFormData.model === 'white' 
                            ? '235 Dhs' 
                            : nfcFormData.model === 'black' 
                              ? '245 Dhs' 
                              : '250 Dhs'}
                    </span>
                  </div>
                </div>
              )}
              
              {cardType === 'google' && (
                <div className="mb-8">
                  <div className="flex justify-between py-2 border-b border-primary-200">
                    <span>Type de carte:</span>
                    <span className="font-medium">
                      {googleFormData.type === 'standard' ? 'Standard' : 'Custom'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-200">
                    <span>Quantité:</span>
                    <span className="font-medium">{googleFormData.quantity} cartes</span>
                  </div>
                  <div className="flex justify-between py-3 font-bold text-lg">
                    <span>TOTAL:</span>
                    <span className="text-gold-600">
                      {googleFormData.quantity >= 50 && googleFormData.quantity < 100 
                        ? '220 Dhs' 
                        : googleFormData.quantity >= 100 && googleFormData.quantity < 200 
                          ? '380 Dhs' 
                          : googleFormData.quantity >= 200 && googleFormData.quantity < 500 
                            ? '700 Dhs' 
                            : googleFormData.quantity >= 500 && googleFormData.quantity < 1000 
                              ? '1500 Dhs' 
                              : '2700 Dhs'}
                    </span>
                  </div>
                </div>
              )}
              
              {!cardType && (
                <div className="bg-gold-50 p-4 rounded-lg mb-8">
                  <p className="text-primary-700">Veuillez d'abord personnaliser votre carte.</p>
                </div>
              )}
              
              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  {t('payment.email')}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>
              
              {/* Payment Instructions */}
              <div className="mb-6">
                <h4 className="font-medium mb-4">{t('payment.instructions')}</h4>
                <div className="bg-primary-50 rounded-lg p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-gold-500 rounded-full p-2 text-white mt-1 mr-3">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{t('payment.rib')}</p>
                        <p className="text-primary-600 text-sm">Vous recevrez les détails de paiement par email.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gold-500 rounded-full p-2 text-white mt-1 mr-3">
                        <ArrowRight size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{t('payment.transfer')}</p>
                        <p className="text-primary-600 text-sm">contact@lakarte.com</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gold-500 rounded-full p-2 text-white mt-1 mr-3">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{t('payment.access')}</p>
                        <p className="text-primary-600 text-sm">Votre carte sera livrée sous 12h à 24h.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!cardType}
              >
                {t('payment.validate')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;