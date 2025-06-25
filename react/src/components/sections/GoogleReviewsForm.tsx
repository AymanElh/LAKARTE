import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Upload, Star } from 'lucide-react';

// Types
import { GoogleReviewCardType, GoogleReviewFormData, GoogleReviewTemplate } from '../../types';

// Sample templates data
const googleTemplates: GoogleReviewTemplate[] = [
  {
    id: 'google1',
    name: 'Classic',
    frontImage: 'https://images.pexels.com/photos/5717456/pexels-photo-5717456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/5717454/pexels-photo-5717454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    types: ['standard', 'custom']
  },
  {
    id: 'google2',
    name: 'Modern',
    frontImage: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    types: ['standard', 'custom']
  },
  {
    id: 'google3',
    name: 'Minimal',
    frontImage: 'https://images.pexels.com/photos/12630090/pexels-photo-12630090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/12630083/pexels-photo-12630083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    types: ['custom']
  },
  {
    id: 'google4',
    name: 'Premium',
    frontImage: 'https://images.pexels.com/photos/8867265/pexels-photo-8867265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/8867231/pexels-photo-8867231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    types: ['custom']
  }
];

// Price tiers for Google Reviews cards
const priceTiers = [
  { min: 50, max: 99, price: 220 },
  { min: 100, max: 199, price: 380 },
  { min: 200, max: 499, price: 700 },
  { min: 500, max: 999, price: 1500 },
  { min: 1000, max: Infinity, price: 2700 }
];

interface GoogleReviewsFormProps {
  formData: GoogleReviewFormData;
  setFormData: React.Dispatch<React.SetStateAction<GoogleReviewFormData>>;
}

const GoogleReviewsForm: React.FC<GoogleReviewsFormProps> = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [showCardBack, setShowCardBack] = useState(false);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle quantity change with numeric validation
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 50) {
      setFormData(prev => ({ ...prev, quantity: value }));
    }
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };
  
  // Get filtered templates based on selected type
  const filteredTemplates = googleTemplates.filter(template => 
    template.types.includes(formData.type)
  );
  
  // Get current price based on quantity
  const getCurrentPrice = () => {
    const tier = priceTiers.find(tier => 
      formData.quantity >= tier.min && formData.quantity <= tier.max
    );
    return tier ? tier.price : 0;
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  
  return (
    <section className="section bg-white py-16">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          {t('google.form.title')}
        </h2>
        
        {/* Progress steps */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between relative">
            {/* Progress bar */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary-200 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gold-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
            
            {/* Step indicators */}
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${
                  step >= i 
                    ? 'bg-gold-500 text-white' 
                    : 'bg-primary-200 text-primary-600'
                } transition-colors duration-300`}
              >
                {step > i ? <Check size={16} /> : i}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form Section */}
          <div className="order-2 lg:order-1">
            {/* Step 1: Card Type and Quantity */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Card Type */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('google.form.type')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.type === 'standard' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-primary-200 hover:border-primary-300'}
                    `}>
                      <input
                        type="radio"
                        name="type"
                        value="standard"
                        checked={formData.type === 'standard'}
                        onChange={() => setFormData(prev => ({ ...prev, type: 'standard', template: '' }))}
                        className="sr-only"
                      />
                      <div className="w-40 h-24 bg-primary-100 rounded-lg mb-3 flex items-center justify-center">
                        <div className="w-32 h-20 bg-white border border-primary-300 rounded flex items-center justify-center">
                          <Star className="text-gold-500" size={24} />
                        </div>
                      </div>
                      <span>{t('google.form.type.standard')}</span>
                    </label>
                    
                    <label className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.type === 'custom' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-primary-200 hover:border-primary-300'}
                    `}>
                      <input
                        type="radio"
                        name="type"
                        value="custom"
                        checked={formData.type === 'custom'}
                        onChange={() => setFormData(prev => ({ ...prev, type: 'custom', template: '' }))}
                        className="sr-only"
                      />
                      <div className="w-40 h-24 bg-primary-100 rounded-lg mb-3 flex items-center justify-center">
                        <div className="w-32 h-20 bg-white border border-primary-300 rounded flex items-center justify-center">
                          <Star className="text-gold-500" size={24} />
                        </div>
                      </div>
                      <span>{t('google.form.type.custom')}</span>
                    </label>
                  </div>
                </div>
                
                {/* Quantity */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('google.form.quantity')}</h3>
                  <div className="max-w-xs">
                    <input
                      type="number"
                      min="50"
                      step="10"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleQuantityChange}
                      className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  
                  {/* Price Tiers Table */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-3">{t('google.form.pricing')}</h4>
                    <div className="overflow-hidden border border-primary-200 rounded-lg">
                      <table className="min-w-full divide-y divide-primary-200">
                        <thead className="bg-primary-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                              Quantité
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                              Prix (DHs)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-primary-200">
                          {priceTiers.map((tier, index) => (
                            <tr key={index} className={formData.quantity >= tier.min && formData.quantity <= tier.max ? 'bg-gold-50' : ''}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {tier.max !== Infinity ? `${tier.min} - ${tier.max}` : `${tier.min}+`}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                {tier.price} Dhs
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Templates for selected type */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">{t('nfc.form.template')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredTemplates.map(template => (
                      <label key={template.id} className={`
                        card overflow-hidden cursor-pointer transition-all
                        ${formData.template === template.id 
                          ? 'ring-2 ring-gold-500 shadow-md' 
                          : 'hover:shadow-md'}
                      `}>
                        <input
                          type="radio"
                          name="template"
                          value={template.id}
                          checked={formData.template === template.id}
                          onChange={() => setFormData(prev => ({ ...prev, template: template.id }))}
                          className="sr-only"
                        />
                        <div className="aspect-[3/2] relative">
                          <img 
                            src={template.frontImage} 
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                          {formData.template === template.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-3 text-center bg-primary-50">
                          <span>{template.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Business Info */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium mb-4">{t('google.form.info.title')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('google.form.info.name')}
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('google.form.info.website')}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('google.form.info.logo')}
                  </label>
                  <div className="border border-dashed border-primary-300 rounded-md p-4 text-center">
                    <input
                      type="file"
                      name="logo"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="google-logo-upload"
                    />
                    <label htmlFor="google-logo-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload size={24} className="text-primary-500" />
                        <span className="text-primary-500 text-sm">
                          {formData.logo ? formData.logo.name : 'Click to upload logo'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="pt-6">
                  <div className="bg-gold-50 border-l-4 border-gold-500 p-4 rounded-r-lg">
                    <p className="text-primary-700">
                      Nous vous contacterons pour finaliser les détails de conception de vos cartes Google Reviews.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Delivery Information */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium mb-4">{t('delivery.title')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('delivery.name')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('delivery.city')}
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="casablanca">Casablanca</option>
                    <option value="rabat">Rabat</option>
                    <option value="marrakech">Marrakech</option>
                    <option value="tanger">Tanger</option>
                    <option value="other">Autre ville</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('delivery.district')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('delivery.phone')}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div className="pt-4">
                  <div className="bg-gold-50 border-l-4 border-gold-500 p-4 rounded-r-lg">
                    <p className="text-primary-700">
                      {t('hero.promo')}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <a href="#payment" className="btn btn-primary w-full">
                    {t('payment.validate')}
                  </a>
                </div>
              </motion.div>
            )}
            
            {/* Navigation buttons */}
            <div className={`mt-8 flex ${step === 1 ? 'justify-end' : 'justify-between'}`}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  {t('back')}
                </button>
              )}
              
              {step < 3 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  {t('next')}
                </button>
              )}
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold mb-4 text-center">
                {t('nfc.form.preview.title')}
              </h3>
              
              {/* Card Preview Tabs */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-primary-100 p-1 rounded-full">
                  <button
                    className={`px-4 py-1 rounded-full text-sm transition-colors ${
                      !showCardBack ? 'bg-white shadow-sm text-primary-900' : 'text-primary-600'
                    }`}
                    onClick={() => setShowCardBack(false)}
                  >
                    {t('nfc.form.preview.front')}
                  </button>
                  <button
                    className={`px-4 py-1 rounded-full text-sm transition-colors ${
                      showCardBack ? 'bg-white shadow-sm text-primary-900' : 'text-primary-600'
                    }`}
                    onClick={() => setShowCardBack(true)}
                  >
                    {t('nfc.form.preview.back')}
                  </button>
                </div>
              </div>
              
              {/* Card Preview */}
              <div className="max-w-xs mx-auto aspect-[5/3] relative">
                <div className="w-full h-full rounded-xl overflow-hidden shadow-lg bg-white border border-primary-200">
                  {/* If a template is selected, show it */}
                  {formData.template && (
                    <div className="relative w-full h-full">
                      <img 
                        src={showCardBack ? 
                          googleTemplates.find(t => t.id === formData.template)?.backImage || '' :
                          googleTemplates.find(t => t.id === formData.template)?.frontImage || ''
                        } 
                        alt="Google Review Card Preview"
                        className="w-full h-full object-cover"
                      />
                      
                      {formData.businessName && !showCardBack && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <div className="text-white">
                            <p className="font-bold">{formData.businessName}</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="text-gold-500" size={14} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* If no template is selected, show a basic preview */}
                  {!formData.template && (
                    <div className="w-full h-full flex flex-col justify-between p-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                          <Star className="text-white" size={18} />
                        </div>
                        <div className="ml-3">
                          <p className="font-bold">Google Reviews</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        {formData.businessName ? (
                          <p className="font-bold text-lg">{formData.businessName}</p>
                        ) : (
                          <p className="font-bold text-lg">Your Business Name</p>
                        )}
                        <div className="flex items-center justify-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="text-gold-500" size={16} />
                          ))}
                        </div>
                        <p className="mt-2 text-sm">Scannez pour laisser un avis</p>
                      </div>
                      
                      <div className="h-16 w-16 bg-primary-200 mx-auto"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Price summary */}
              <div className="mt-8 p-6 bg-primary-50 rounded-lg">
                <h4 className="font-medium mb-3">Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Card Type:</span>
                    <span className="font-medium">{formData.type === 'standard' ? 'Standard' : 'Custom'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{formData.quantity} cards</span>
                  </div>
                  <div className="border-t border-primary-200 my-2 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-gold-600">
                      {getCurrentPrice()} Dhs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsForm;