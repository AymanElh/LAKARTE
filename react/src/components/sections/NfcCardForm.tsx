import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Upload } from 'lucide-react';

// Types
import { CardOrientation, CardModelType, CardPackType, PersonalizationFormData, CardTemplate } from '../../types';

// Sample templates data
const cardTemplates: CardTemplate[] = [
  {
    id: 'template1',
    name: 'Classic',
    frontImage: 'https://images.pexels.com/photos/7821836/pexels-photo-7821836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/7821723/pexels-photo-7821723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    packTypes: ['standard', 'professional', 'custom']
  },
  {
    id: 'template2',
    name: 'Minimal',
    frontImage: 'https://images.pexels.com/photos/7821704/pexels-photo-7821704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/7821726/pexels-photo-7821726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    packTypes: ['standard', 'professional', 'custom']
  },
  {
    id: 'template3',
    name: 'Corporate',
    frontImage: 'https://images.pexels.com/photos/5077047/pexels-photo-5077047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/5077045/pexels-photo-5077045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    packTypes: ['professional', 'custom']
  },
  {
    id: 'template4',
    name: 'Premium',
    frontImage: 'https://images.pexels.com/photos/7821721/pexels-photo-7821721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/7821719/pexels-photo-7821719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    packTypes: ['professional', 'custom']
  },
  {
    id: 'template5',
    name: 'Elite',
    frontImage: 'https://images.pexels.com/photos/7412095/pexels-photo-7412095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    packTypes: ['custom']
  },
  {
    id: 'template6',
    name: 'Creative',
    frontImage: 'https://images.pexels.com/photos/6121448/pexels-photo-6121448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    backImage: 'https://images.pexels.com/photos/6120194/pexels-photo-6120194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    packTypes: ['custom']
  }
];

interface NfcCardFormProps {
  formData: PersonalizationFormData;
  setFormData: React.Dispatch<React.SetStateAction<PersonalizationFormData>>;
}

const NfcCardForm: React.FC<NfcCardFormProps> = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [showCardBack, setShowCardBack] = useState(false);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };
  
  // Get filtered templates based on selected pack
  const filteredTemplates = cardTemplates.filter(template => 
    template.packTypes.includes(formData.pack)
  );

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  
  return (
    <section className="section bg-white py-16">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          {t('nfc.form.title')}
        </h2>
        
        {/* Progress steps */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between relative">
            {/* Progress bar */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary-200 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gold-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${(step - 1) * 33.3}%` }}
            ></div>
            
            {/* Step indicators */}
            {[1, 2, 3, 4].map((i) => (
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
            {/* Step 1: Card Orientation and Model */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Orientation */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('nfc.form.orientation')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.orientation === 'vertical' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-primary-200 hover:border-primary-300'}
                    `}>
                      <input
                        type="radio"
                        name="orientation"
                        value="vertical"
                        checked={formData.orientation === 'vertical'}
                        onChange={() => setFormData(prev => ({ ...prev, orientation: 'vertical' }))}
                        className="sr-only"
                      />
                      <div className="w-20 h-32 bg-primary-100 rounded-lg mb-3 flex items-center justify-center">
                        <div className="w-14 h-24 bg-white border border-primary-300 rounded"></div>
                      </div>
                      <span>{t('nfc.form.orientation.vertical')}</span>
                    </label>
                    
                    <label className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.orientation === 'horizontal' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-primary-200 hover:border-primary-300'}
                    `}>
                      <input
                        type="radio"
                        name="orientation"
                        value="horizontal"
                        checked={formData.orientation === 'horizontal'}
                        onChange={() => setFormData(prev => ({ ...prev, orientation: 'horizontal' }))}
                        className="sr-only"
                      />
                      <div className="w-32 h-20 bg-primary-100 rounded-lg mb-3 flex items-center justify-center">
                        <div className="w-24 h-14 bg-white border border-primary-300 rounded"></div>
                      </div>
                      <span>{t('nfc.form.orientation.horizontal')}</span>
                    </label>
                  </div>
                </div>
                
                {/* Card Model */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('nfc.form.model')}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <label className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.model === 'white' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-primary-200 hover:border-primary-300'}
                    `}>
                      <input
                        type="radio"
                        name="model"
                        value="white"
                        checked={formData.model === 'white'}
                        onChange={() => setFormData(prev => ({ ...prev, model: 'white' }))}
                        className="sr-only"
                      />
                      <div className="w-20 h-12 bg-white border border-primary-300 rounded-lg mb-3"></div>
                      <span className="text-center text-sm">{t('nfc.form.model.white')}</span>
                    </label>
                    
                    <label className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.model === 'black' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-primary-200 hover:border-primary-300'}
                    `}>
                      <input
                        type="radio"
                        name="model"
                        value="black"
                        checked={formData.model === 'black'}
                        onChange={() => setFormData(prev => ({ ...prev, model: 'black' }))}
                        className="sr-only"
                      />
                      <div className="w-20 h-12 bg-primary-900 rounded-lg mb-3"></div>
                      <span className="text-center text-sm">{t('nfc.form.model.black')}</span>
                    </label>
                    
                    <label className={`
                      flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${formData.model === 'gold' 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-primary-200 hover:border-primary-300'}
                    `}>
                      <input
                        type="radio"
                        name="model"
                        value="gold"
                        checked={formData.model === 'gold'}
                        onChange={() => setFormData(prev => ({ ...prev, model: 'gold' }))}
                        className="sr-only"
                      />
                      <div className="w-20 h-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg mb-3"></div>
                      <span className="text-center text-sm">{t('nfc.form.model.gold')}</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Pack Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <h3 className="text-lg font-medium mb-4">{t('nfc.form.pack')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Standard Pack */}
                  <label className={`
                    flex flex-col border-2 rounded-lg cursor-pointer transition-all overflow-hidden
                    ${formData.pack === 'standard' 
                      ? 'border-gold-500 shadow-md' 
                      : 'border-primary-200 hover:border-primary-300'}
                  `}>
                    <input
                      type="radio"
                      name="pack"
                      value="standard"
                      checked={formData.pack === 'standard'}
                      onChange={() => setFormData(prev => ({ ...prev, pack: 'standard', template: '' }))}
                      className="sr-only"
                    />
                    <div className="bg-primary-900 text-white p-3 text-center">
                      <h4 className="font-medium">{t('nfc.form.pack.standard')}</h4>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="text-center mb-3">
                        <span className="text-xl font-bold text-primary-900">{t('nfc.form.pack.standard.price')}</span>
                      </div>
                      <ul className="space-y-2 mb-4 flex-1">
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">3 templates</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">{t('nfc.form.pack.standard.delivery')}</span>
                        </li>
                      </ul>
                      {formData.pack === 'standard' && (
                        <div className="bg-gold-500 text-white text-center py-1 rounded">
                          {t('select')}
                        </div>
                      )}
                    </div>
                  </label>
                  
                  {/* Professional Pack */}
                  <label className={`
                    flex flex-col border-2 rounded-lg cursor-pointer transition-all overflow-hidden
                    ${formData.pack === 'professional' 
                      ? 'border-gold-500 shadow-md' 
                      : 'border-primary-200 hover:border-primary-300'}
                  `}>
                    <input
                      type="radio"
                      name="pack"
                      value="professional"
                      checked={formData.pack === 'professional'}
                      onChange={() => setFormData(prev => ({ ...prev, pack: 'professional', template: '' }))}
                      className="sr-only"
                    />
                    <div className="bg-primary-900 text-white p-3 text-center">
                      <h4 className="font-medium">{t('nfc.form.pack.professional')}</h4>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="text-center mb-3">
                        <span className="text-xl font-bold text-primary-900">{t('nfc.form.pack.professional.price')}</span>
                      </div>
                      <ul className="space-y-2 mb-4 flex-1">
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">6 templates</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">Logo professionnel</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">{t('nfc.form.pack.professional.delivery')}</span>
                        </li>
                      </ul>
                      {formData.pack === 'professional' && (
                        <div className="bg-gold-500 text-white text-center py-1 rounded">
                          {t('select')}
                        </div>
                      )}
                    </div>
                  </label>
                  
                  {/* Custom Pack */}
                  <label className={`
                    flex flex-col border-2 rounded-lg cursor-pointer transition-all overflow-hidden
                    ${formData.pack === 'custom' 
                      ? 'border-gold-500 shadow-md' 
                      : 'border-primary-200 hover:border-primary-300'}
                  `}>
                    <input
                      type="radio"
                      name="pack"
                      value="custom"
                      checked={formData.pack === 'custom'}
                      onChange={() => setFormData(prev => ({ ...prev, pack: 'custom', template: '' }))}
                      className="sr-only"
                    />
                    <div className="bg-gold-500 text-white p-3 text-center">
                      <h4 className="font-medium">{t('nfc.form.pack.custom')}</h4>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="text-center mb-3">
                        <span className="text-xl font-bold text-primary-900">{t('nfc.form.pack.custom.price')}</span>
                      </div>
                      <ul className="space-y-2 mb-4 flex-1">
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">Design unique</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">3 modifications</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">Logo professionnel</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-gold-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-sm">{t('nfc.form.pack.custom.delivery')}</span>
                        </li>
                      </ul>
                      {formData.pack === 'custom' && (
                        <div className="bg-gold-500 text-white text-center py-1 rounded">
                          {t('select')}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                
                {/* Templates for selected pack */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">{t('nfc.form.template')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                        <div className="aspect-[2/3] relative">
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
            
            {/* Step 3: Personal Info */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium mb-4">{t('nfc.form.info.title')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      {t('nfc.form.info.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      {t('nfc.form.info.lastName')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('nfc.form.info.position')}
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('nfc.form.info.website')}
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
                    {t('nfc.form.info.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('nfc.form.info.email')}
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {t('nfc.form.info.logo')}
                  </label>
                  <div className="border border-dashed border-primary-300 rounded-md p-4 text-center">
                    <input
                      type="file"
                      name="logo"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload size={24} className="text-primary-500" />
                        <span className="text-primary-500 text-sm">
                          {formData.logo ? formData.logo.name : 'Click to upload logo'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {formData.pack === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      {t('nfc.form.info.briefing')}
                    </label>
                    <textarea
                      name="briefing"
                      value={formData.briefing}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Describe your design requirements..."
                    ></textarea>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Step 4: Delivery Information */}
            {step === 4 && (
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
              
              {step < 4 && (
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
              <div className={`max-w-xs mx-auto relative ${
                formData.orientation === 'horizontal' ? 'aspect-[5/3]' : 'aspect-[3/5]'
              }`}>
                <div className={`w-full h-full rounded-xl overflow-hidden shadow-lg ${
                  formData.model === 'white' ? 'bg-white border border-primary-200' :
                  formData.model === 'black' ? 'bg-primary-900' : 
                  'bg-gradient-to-r from-gold-400 to-gold-600'
                }`}>
                  {/* If a template is selected, show it */}
                  {formData.template && 
                    <div className="relative w-full h-full">
                      {formData.firstName && formData.lastName && (
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <div className={`
                            text-${formData.model !== 'white' ? 'white' : 'primary-900'}
                          `}>
                            <p className="font-bold text-lg">{`${formData.firstName} ${formData.lastName}`}</p>
                            {formData.position && <p className="text-sm opacity-80">{formData.position}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  
                  {/* If no template is selected, show a basic preview */}
                  {!formData.template && (
                    <div className="w-full h-full flex flex-col justify-between p-6">
                      <div className={`text-${formData.model !== 'white' ? 'white' : 'primary-900'}`}>
                        <p className="font-bold">LAKARTE</p>
                      </div>
                      
                      {formData.logo && (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20"></div>
                        </div>
                      )}
                      
                      <div className={`text-${formData.model !== 'white' ? 'white' : 'primary-900'}`}>
                        {formData.firstName && formData.lastName ? (
                          <>
                            <p className="font-bold">{`${formData.firstName} ${formData.lastName}`}</p>
                            {formData.position && <p className="text-sm opacity-80">{formData.position}</p>}
                          </>
                        ) : (
                          <>
                            <p className="font-bold">Your Name</p>
                            <p className="text-sm opacity-80">Your Position</p>
                          </>
                        )}
                      </div>
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
                    <span className="font-medium">{t(`nfc.form.pack.${formData.pack}`)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Model:</span>
                    <span className="font-medium">{formData.model.charAt(0).toUpperCase() + formData.model.slice(1)}</span>
                  </div>
                  {formData.model !== 'white' && (
                    <div className="flex justify-between text-sm">
                      <span>Model Surcharge:</span>
                      <span>{formData.model === 'black' ? '+10 Dhs' : '+15 Dhs'}</span>
                    </div>
                  )}
                  <div className="border-t border-primary-200 my-2 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-gold-600">
                      {formData.pack === 'standard' ? '165 Dhs' : 
                       formData.pack === 'professional' ? '185 Dhs' : '235 Dhs'}
                      {formData.model === 'black' ? ' + 10 Dhs' : 
                       formData.model === 'gold' ? ' + 15 Dhs' : ''}
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

export default NfcCardForm;