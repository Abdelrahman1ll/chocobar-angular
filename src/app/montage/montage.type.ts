export type MontageResponse = {
  projects: Product[];
};

export type Product = {
  _id: string;
  title: string;
  image: string;
  price: number;
  chocolates: {
    _id: string;
    price: number;
    chocolate?: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }[];
  addOns: {
    _id: string;
    price: number;
    addOn?: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }[];
  TwoKindsOfChocolate: boolean;
  FourTypesOfChocolate: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
