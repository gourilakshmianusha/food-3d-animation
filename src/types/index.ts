export type FoodCategory =
  | 'Indian'
  | 'Continental'
  | 'Italian'
  | 'Pizza'
  | 'Burgers'
  | 'Pasta'
  | 'Desserts'
  | 'Beverages'
  | 'Coffee'
  | 'Special Offers'
  | 'Starters'
  | 'Soups'
  | 'Salads'
  | 'Main Course';

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category: FoodCategory;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  threeDImage?: string; // High-resolution transparent 3D-rendered food asset
  model3d?: 'cloche' | 'steak' | 'burger' | 'pizza' | 'pasta' | 'dessert' | 'beverage' | 'coffee';
  isVeg: boolean;
  spicyLevel: 0 | 1 | 2 | 3;
  isBestseller: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
  ingredients: string[];
  allergens: string[];
  prepTime: string;
  calories: number;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export interface Food3DAsset {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  type: 'dish' | 'ingredient' | 'plate' | 'beverage';
  shadowType?: 'soft' | 'contact' | 'ambient' | 'dramatic';
  scale?: number;
  rotation?: number;
  isTransparent?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItemRecord {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItemRecord[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Google Pay' | 'Cash on Delivery';
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Completed';

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: ReservationStatus;
  tableNumber?: string;
  createdAt: string;
}

export interface Chef {
  id: string;
  name: string;
  designation: string;
  biography: string;
  experience: string;
  specialization: string;
  awards: string[];
  signatureDishes: string[];
  photo: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  publishDate: string;
  status: 'Published' | 'Draft';
  readTime: string;
}

export type GalleryCategory =
  | 'Food'
  | 'Restaurant'
  | 'Kitchen'
  | 'Events'
  | 'Chefs'
  | 'Customers'
  | 'Behind the scenes';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  description: string;
  date: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  designation: string;
  rating: number;
  review: string;
  image: string;
  location?: string;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  isActive: boolean;
  bannerImage: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  capacity: string;
  price: string;
  category: string;
}

export interface CateringPackage {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  minGuests: number;
  itemsIncluded: string[];
  image: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'Unread' | 'Read';
}

export interface SiteSettings {
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  googleMapsUrl: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // e.g. 0.0825 (8.25%)
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses: string[];
  favoriteItemIds: string[];
}
