export type AddMontage = {
  _id: string;
  title: string;
  image: string;
  price: number;
  chocolates: {
    chocolate: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    price: number;
    _id: string;
  }[];
  addOns: {
    addOn: {
      _id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    price: number;
    _id: string;
  }[];
  TwoKindsOfChocolate: boolean;
  FourTypesOfChocolate: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
