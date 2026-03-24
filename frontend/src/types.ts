export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  isAdmin: boolean;
};

export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  category: string;
  imageUrl: string;
  status: "available" | "sold" | "donated";
  createdAt: string;
  seller?: {
    fullName: string;
    email: string;
    phone: string;
  };
};

export type Donation = {
  _id: string;
  donorName: string;
  donorEmail: string;
  createdAt: string;
  product?: {
    title: string;
    category: string;
    price: number;
  };
};
