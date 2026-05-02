export type BasketResponse = {
  status: string;
  basket: Basket;
};

export type Basket = {
  _id: string;
  Projects: BasketProject[];
  user: string;
  totalBasketPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BasketProject = {
  Project: ProjectInfo;
  chocolates: SelectedChocolate[];
  addOns: SelectedAddOn[];
  price: number;
  quantity: number;
  _id: string;
};

export type ProjectInfo = {
  _id: string;
  title: string;
  image: string;
  price: number;
  chocolates: {
    chocolate: string; // فقط ID
    _id: string;
  }[];
  addOns: {
    addOn: string; // فقط ID
    _id: string;
  }[];
  TwoKindsOfChocolate: boolean;
  FourTypesOfChocolate: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type SelectedChocolate = {
  chocolate: {
    _id: string;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  price: number;
  _id: string;
};

export type SelectedAddOn = {
  // في هذا الرد addOns كانت فاضية، لكن يمكن تكميلها لاحقًا إن احتجت
  // هنا نموذج مبدئي إذا لزم الأمر
  addOn?: {
    _id: string;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  price?: number;
  _id?: string;
};
