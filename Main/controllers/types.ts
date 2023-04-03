export interface typeUser {
  username: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  userID?: string;
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
