export interface ProductInput {
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  materials: string[];
  bulletPoints: string[];
  packageContents: string;
}

export interface Product extends ProductInput {
  _id: string;
  createdAt: string;
}
