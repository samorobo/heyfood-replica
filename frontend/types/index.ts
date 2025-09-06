export interface Restaurant {
    id: string;
    name: string;
    imageUrl: string;
    rating: number; // Changed from string to number to match backend
    ratingsCount: string;
    isOpen: boolean;
    status: string;
    promoText?: string;
    deliveryInfo?: string;
    createdAt?: string;
    tags: Tag[];
  }
  
  export interface Tag {
    id: string;
    name: string;
    iconUrl: string;
    createdAt?: string;
  }
  
  export interface FilterParams {
    search?: string;
    tags?: string;
    sort?: string;
  }
  
  // API Response types to match backend
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    message?: string;
    error?: string;
  }
  
  export interface RestaurantsResponse extends ApiResponse<Restaurant[]> {}
  export interface TagsResponse extends ApiResponse<Tag[]> {}