import mongoose from "mongoose";

export type tagarray = [
  {
    tag: string;
    score: number;
  }
];
export type AnalyticsType = {
  user_id: string;
  clicks: tagarray;
  observer: tagarray;
  liked: string[];
  sum: tagarray;
  seen: string[];
  unseen: string[];
  sellerPreferences: tagarray;
  myPublishedProductsSum: tagarray;
  suggestedSellers: [
    {
      seller: string;
      score: number;
    }
  ];
};
export type ProductType = {
  name: string;
  category: string;
  seller: string;
  price: number[];
  condition: string;
  size: string;
  onBid: boolean;
  description: string;
  media: [
    {
      url: string;
      type: string;
    }
  ];
  date: string;
  status: boolean;
  review: string;
  watchers: number;
  tags: string[];
};
