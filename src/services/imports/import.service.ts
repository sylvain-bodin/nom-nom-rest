import { Recipe } from '../../types/recipe';

export declare interface ImportService {
  import(url: string): Promise<Recipe>;
}
