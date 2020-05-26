import { model, Schema } from 'mongoose';

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  tags: {
    type: String,
  },
},
{ timestamps: true });
const Recipe = model('Recipe', recipeSchema);
export default Recipe;
