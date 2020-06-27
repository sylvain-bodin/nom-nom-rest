import { model, Schema, SchemaTypes } from 'mongoose';

const ingredientSchema = new Schema({
  value: SchemaTypes.Number,
  unit: SchemaTypes.String,
  name: SchemaTypes.String,
});

const recipeSchema = new Schema({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  url: SchemaTypes.String,
  image: SchemaTypes.String,
  tags: [SchemaTypes.String],
  userId: {
    type: SchemaTypes.ObjectId,
    required:
        true,
  },
  ingredients: [ingredientSchema],
  nbPortions: SchemaTypes.Number,
  preparationTime: SchemaTypes.Number,
  waitingTime: SchemaTypes.Number,
  cookingTime: SchemaTypes.Number,
},
{
  timestamps: true,
});
const Recipe = model('recipes', recipeSchema);
export default Recipe;
