export interface typeUser {
  username: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  _id?: string;
  isActive?: boolean;
}

export interface SingleProduct {
  name: string;
  description: string;
  price: number;
  media: [{ "" }];
  category: string;
  onBid: boolean;
  size: string;
  condition: string;
  seller: any;
  tags: string[];
}
