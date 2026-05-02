export type Chocolate = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ChocolateResponse = {
  status: string;
  typeOfChocolates: Chocolate[];
};
