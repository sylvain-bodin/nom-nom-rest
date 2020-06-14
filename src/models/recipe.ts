import { model, Schema, SchemaTypes } from 'mongoose';


const recipeSchema = new Schema({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  url: {
    type: SchemaTypes.String,
  },
  image: {
    type: SchemaTypes.String,
  },
  tags: {
    type: [SchemaTypes.String],
  },
  user_id: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
},
{ timestamps: true });
const Recipe = model('recipes', recipeSchema);
export default Recipe;
