import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Upload, ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';

import { packService, Pack, Template } from '../services/packService';
import { authService } from '../services/authService';

interface OrderFormData {
  // Pack and template selection
  pack_id: number | null;
  template_id: number | null;
  
  // Personal information
  client_name: string;
  client_email: string;
  phone: string;
  city: string;
  neighborhood: string;
  
  // Card customization
  orientation: 'vertical' | 'horizontal';
  color: 'white' | 'black' | 'gold';
  quantity: number;
  
  // Files
  logo: File | null;
  brief: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

const CustomizePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [packs, setPacks] = useState<Pack[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>({
    pack_id: null,
    template_id: null,
    client_name: '',
    client_email: '',
    phone: '',
    city: '',
    neighborhood: '',
    orientation: 'vertical',
    color: 'white',
    quantity: 1,
    logo: null,
    brief: ''
  });

  // Fetch packs on component mount
  const fetchPacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await packService.getAllPacks();
      
      if (response.success) {
        setPacks(response.data);
      } else {
        setError(response.message || t('customize.errorFetchingPacks'));
      }
    } catch (err) {
      console.error('Error fetching packs:', err);
      setError(t('customize.errorFetchingPacks'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Fetch templates for selected pack
  const fetchTemplates = useCallback(async (packId: number) => {
    try {
      const pack = packs.find(p => p.id === packId);
      if (pack?.templates) {
        setTemplates(pack.templates);
      } else {
        // If templates not loaded with pack, fetch separately
        const response = await packService.getPackBySlug(pack?.slug || '');
        if (response.success && response.data.templates) {
          setTemplates(response.data.templates);
        }
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  }, [packs]);

  useEffect(() => {
    fetchPacks();
  }, [fetchPacks]);

  useEffect(() => {
    if (formData.pack_id) {
      fetchTemplates(formData.pack_id);
    }
  }, [formData.pack_id, fetchTemplates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handlePackSelect = (packId: number) => {
    setFormData(prev => ({ 
      ...prev, 
      pack_id: packId,
      template_id: null // Reset template when pack changes
    }));
  };

  const handleTemplateSelect = (templateId: number) => {
    setFormData(prev => ({ ...prev, template_id: templateId }));
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return formData.pack_id !== null;
      case 2:
        return formData.template_id !== null;
      case 3:
        return formData.client_name && formData.client_email && formData.phone && formData.city;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmitOrder = async () => {
    if (!canProceedToNextStep()) return;

    try {
      setSubmitting(true);
      setError(null);
      setValidationErrors({});
      
      const orderData = new FormData();
      
      // Add required fields
      if (formData.pack_id) orderData.append('pack_id', formData.pack_id.toString());
      if (formData.template_id) orderData.append('template_id', formData.template_id.toString());
      orderData.append('client_name', formData.client_name);
      orderData.append('client_email', formData.client_email);
      orderData.append('phone', formData.phone);
      orderData.append('city', formData.city);
      orderData.append('neighborhood', formData.neighborhood || ''); // Ensure it's not null
      orderData.append('orientation', formData.orientation);
      orderData.append('color', formData.color);
      orderData.append('quantity', formData.quantity.toString());
      orderData.append('channel', 'form');
      
      // Add optional fields
      if (formData.logo) {
        orderData.append('logo', formData.logo);
      }
      // Note: brief is handled as text, not file in our form, but backend expects file
      // For now, we'll create a text file from the brief content
      if (formData.brief) {
        const briefBlob = new Blob([formData.brief], { type: 'text/plain' });
        const briefFile = new File([briefBlob], 'brief.txt', { type: 'text/plain' });
        orderData.append('brief', briefFile);
      }

      console.log('Submitting order data:', {
        pack_id: formData.pack_id,
        template_id: formData.template_id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        phone: formData.phone,
        city: formData.city,
        neighborhood: formData.neighborhood || '',
        orientation: formData.orientation,
        color: formData.color,
        quantity: formData.quantity,
        channel: 'form',
        logo: formData.logo ? formData.logo.name : 'none',
        brief: formData.brief ? 'text provided' : 'none'
      });

      // Log the actual FormData entries
      console.log('FormData entries:');
      for (const [key, value] of orderData.entries()) {
        console.log(key, ':', value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type for FormData - let browser set it with boundary
          ...(authService.getToken() && {
            'Authorization': `Bearer ${authService.getToken()}`
          })
        },
        body: orderData,
      });

      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        console.error('Server response:', response.status, result);
        
        if (response.status === 422 && result.errors) {
          // Handle Laravel validation errors
          setValidationErrors(result.errors);
          setError(t('customize.order.validationError'));
        } else {
          setError(result.message || result.error || `Server error: ${response.status}`);
        }
        return;
      }

      if (result.success) {
        alert(t('customize.order.success'));
        navigate('/');
      } else {
        if (result.errors) {
          setValidationErrors(result.errors);
        } else {
          setError(result.message || t('customize.order.error'));
        }
      }
    } catch (err) {
      console.error('Network/Parse error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Network error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPack = packs.find(p => p.id === formData.pack_id);
  const selectedTemplate = templates.find(t => t.id === formData.template_id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button
              onClick={fetchPacks}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('customize.title')}</h1>
          <p className="text-xl text-gray-600">{t('customize.subtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${
                  step >= i 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                } transition-colors duration-300`}
              >
                {step > i ? <Check size={16} /> : i}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>{t('customize.steps.selectPack')}</span>
            <span>{t('customize.steps.selectTemplate')}</span>
            <span>{t('customize.steps.personalInfo')}</span>
            <span>{t('customize.steps.review')}</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Pack */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-center mb-8">{t('customize.steps.selectPack')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => handlePackSelect(pack.id)}
                    className={`cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      formData.pack_id === pack.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {pack.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={pack.image_url} 
                          alt={pack.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{pack.name}</h3>
                        {pack.highlight && (
                          <span className="px-2 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-medium">
                            {t('packs.highlighted')}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{pack.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t('packs.price')}:</span>
                          <span className="font-semibold text-lg text-gray-900">{pack.price} MAD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t('packs.deliveryTime')}:</span>
                          <span className="text-gray-700">{pack.delivery_time_days} {t('packs.days')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Template */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-center mb-8">{t('customize.steps.selectTemplate')}</h2>
              
              {selectedPack && (
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    {t('customize.selectedPack')}: <span className="font-semibold">{selectedPack.name}</span>
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      formData.template_id === template.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {template.preview_url && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={template.preview_url} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                      {template.description && (
                        <p className="text-gray-600 text-sm">{template.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {templates.length === 0 && (
                <div className="text-center text-gray-600">
                  <p>{t('customize.noTemplatesAvailable')}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-center mb-8">{t('customize.steps.personalInfo')}</h2>
              
              {/* Error Display */}
              {error && (
                <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customize.form.fullName')} *
                    </label>
                    <input
                      type="text"
                      id="client_name"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.client_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.client_name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.client_name[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customize.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="client_email"
                      name="client_email"
                      value={formData.client_email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.client_email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.client_email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.client_email[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customize.form.phone')} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone[0]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customize.form.city')} *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    {validationErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.city[0]}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('customize.form.neighborhood')}
                    </label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.neighborhood ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.neighborhood && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.neighborhood[0]}</p>
                    )}
                  </div>
                </div>
                
                {/* Card Customization */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-6">{t('customize.form.cardOptions')}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Orientation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t('customize.form.orientation')}
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="orientation"
                            value="vertical"
                            checked={formData.orientation === 'vertical'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          {t('customize.form.vertical')}
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="orientation"
                            value="horizontal"
                            checked={formData.orientation === 'horizontal'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          {t('customize.form.horizontal')}
                        </label>
                      </div>
                    </div>
                    
                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t('customize.form.color')}
                      </label>
                      <div className="space-y-2">
                        {['white', 'black', 'gold'].map((color) => (
                          <label key={color} className="flex items-center">
                            <input
                              type="radio"
                              name="color"
                              value={color}
                              checked={formData.color === color}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            {t(`customize.form.colors.${color}`)}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-3">
                        {t('customize.form.quantity')}
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* File Upload */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('customize.form.logo')}
                      </label>
                      <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          id="logo"
                          name="logo"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <label htmlFor="logo" className="cursor-pointer">
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            {formData.logo ? formData.logo.name : t('customize.form.uploadLogo')}
                          </p>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="brief" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('customize.form.brief')}
                      </label>
                      <textarea
                        id="brief"
                        name="brief"
                        rows={4}
                        value={formData.brief}
                        onChange={handleInputChange}
                        placeholder={t('customize.form.briefPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-center mb-8">{t('customize.steps.review')}</h2>
              
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('customize.orderSummary')}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('customize.selectedPack')}:</span>
                        <span className="font-medium">{selectedPack?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('customize.selectedTemplate')}:</span>
                        <span className="font-medium">{selectedTemplate?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('customize.form.quantity')}:</span>
                        <span className="font-medium">{formData.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('customize.form.orientation')}:</span>
                        <span className="font-medium">{t(`customize.form.${formData.orientation}`)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('customize.form.color')}:</span>
                        <span className="font-medium">{t(`customize.form.colors.${formData.color}`)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>{t('customize.total')}:</span>
                        <span>{selectedPack ? (selectedPack.price * formData.quantity).toFixed(2) : '0'} MAD</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer Information */}
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">{t('customize.customerInfo')}</h3>
                    <div className="space-y-2">
                      <div><strong>{t('customize.form.fullName')}:</strong> {formData.client_name}</div>
                      <div><strong>{t('customize.form.email')}:</strong> {formData.client_email}</div>
                      <div><strong>{t('customize.form.phone')}:</strong> {formData.phone}</div>
                      <div><strong>{t('customize.form.city')}:</strong> {formData.city}</div>
                      {formData.neighborhood && (
                        <div><strong>{t('customize.form.neighborhood')}:</strong> {formData.neighborhood}</div>
                      )}
                      {formData.logo && (
                        <div><strong>{t('customize.form.logo')}:</strong> {formData.logo.name}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 max-w-4xl mx-auto">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center px-6 py-3 rounded-md transition-colors ${
              step === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="mr-2" size={20} />
            {t('common.back')}
          </button>
          
          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canProceedToNextStep()}
              className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                canProceedToNextStep()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {t('common.next')}
              <ArrowRight className="ml-2" size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmitOrder}
              disabled={submitting || !canProceedToNextStep()}
              className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                submitting || !canProceedToNextStep()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <ShoppingCart className="mr-2" size={20} />
              {submitting ? t('common.submitting') : t('customize.placeOrder')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
