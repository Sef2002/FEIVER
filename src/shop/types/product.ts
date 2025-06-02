export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}