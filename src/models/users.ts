import { model, Schema, SchemaTypes } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: SchemaTypes.String,
    required: true,
  },
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  providers: {
    type: [
      {
        name: { type: SchemaTypes.String, required: true },
        id: { type: SchemaTypes.String, required: true },
      },
    ],
    required: true,
  },


});
const User = model('users', userSchema);
export default User;
