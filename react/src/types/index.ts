export interface LanguageOption {
  label: string;
  code: string;
  flag: string;
}

export type CardOrientation = 'vertical' | 'horizontal';

export type CardModelType = 'white' | 'black' | 'gold';

export type CardPackType = 'standard' | 'professional' | 'custom';

export type GoogleReviewCardType = 'standard' | 'custom';

export interface CardTemplate {
  id: string;
  name: string;
  frontImage: string;
  backImage: string;
  packTypes: CardPackType[];
}

export interface GoogleReviewTemplate {
  id: string;
  name: string;
  frontImage: string;
  backImage: string;
  types: GoogleReviewCardType[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  person?: {
    name: string;
    role: string;
  };
}

export interface Testimonial {
  id: string;
  posterImage: string;
  videoUrl: string;
  person: {
    name: string;
    role: string;
  };
}

export interface PersonalizationFormData {
  orientation: CardOrientation;
  model: CardModelType;
  pack: CardPackType;
  template: string;
  firstName: string;
  lastName: string;
  position: string;
  website: string;
  phoneNumber: string;
  emailAddress: string;
  logo?: File | null;
  briefing?: string;
}

export interface GoogleReviewFormData {
  type: GoogleReviewCardType;
  template: string;
  quantity: number;
  businessName: string;
  website: string;
  logo?: File | null;
}

export interface DeliveryInfo {
  fullName: string;
  city: string;
  district: string;
  phoneNumber: string;
  emailAddress: string;
}