export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  capacity: number;
  shortDescription: string;
  description: string;
  images: string[];
  image?: string;
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  birds: string[];
  warranty: string;
  delivery: string;
  availability: string;
  relatedProducts: string[];
  whatsappMessage: string;
}

export interface Spare {
  id: string;
  slug: string;
  name: string;
  description: string;
  compatibleModels: string[];
  images: string[];
  whatsappMessage: string;
}
