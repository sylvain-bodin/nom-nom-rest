import { Ingredient } from './ingredient';

export interface Recipe {
  _id: number | null;
  name: string;
  nbPortions?: number;
  ingredients: Ingredient[];
  url?: string;
  image?: string;
  tags?: string[];
  preparationTime?: number;
  cookingTime?: number;
}
