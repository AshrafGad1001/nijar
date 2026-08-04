export interface CategoryImage {
  url: string;
  publicId: string;
}

export interface Category {
  _id: string;
  name: string;
  image: CategoryImage;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image: CategoryImage;
  category: string | Category;
  isAvailable: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogCategory extends Category {
  items: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}
