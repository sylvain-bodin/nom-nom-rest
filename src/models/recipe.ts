import { model, Schema } from 'mongoose';

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  image: {
    type: String,
  },
  tags: {
    type: [String],
  },
},
{ timestamps: true });
const Recipe = model('recipes', recipeSchema);
export default Recipe;
