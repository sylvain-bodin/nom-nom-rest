export interface Recipe {
  _id: number | null;
  name: string;
  ingredients: string[];
  url?: string;
  image?: string;
  tags?: string[];
}
