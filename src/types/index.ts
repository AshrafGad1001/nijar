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

export interface Dimensions {
  length: number | null;
  width: number | null;
  height: number | null;
}

export interface TechnicalDetails {
  woodType?: string;
  paintType?: string;
  mechanism?: string;
  handles?: string;
  hinges?: string;
  warranty?: string;
  productionTime?: string;
  dimensions?: Dimensions;
}

export interface VariantDetails {
  woodType?: string;
  paintType?: string;
  mechanism?: string;
  handles?: string;
  hinges?: string;
  warranty?: string;
  productionTime?: string;
  dimensions?: Dimensions;
}

export interface ProductVariant {
  name: string;
  price: number;
  variantDetails?: VariantDetails;
}

export interface Product {
  _id: string;
  productCode?: string;
  name: string;
  description: string;
  price: number | null;
  components?: string[];
  hasSizes?: boolean;
  sizes?: ProductVariant[];
  technicalDetails?: TechnicalDetails;
  image: CategoryImage;
  gallery?: CategoryImage[];
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
