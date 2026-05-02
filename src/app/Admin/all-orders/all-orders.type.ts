// ... (other imports and code)

export interface Order {
  // existing properties
  deliveryPrice?: number;
  orderNumber?: string;
  createdAt?: string;
  name?: string;
  phone?: string;
  address?: string;
  user?: {
    name?: string;
    phone?: string;
  };
  totalPrice?: number;
  isPaid?: boolean;
  basket?: Array<{
    Project?: {
      image?: string;
      name?: string;
      price?: number;
      _id?: string;
      
    };
    price?: number;
    quantity?: number;
  }>;
}