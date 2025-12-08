export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string; // ISO Date
  status: 'pending' | 'completed';
  total: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface StorefrontAnalytics {
  revenue: number;
  totalOrders: number;
  avgSale: number;
  salesOverTime: Array<{
    label: string;
    amount: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export interface Storefront {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  ownerId: string;
  products: Product[];
  orders: Order[];
}
