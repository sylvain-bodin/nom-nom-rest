import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  providers: {
    type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    required: true,
  },


});
const User = model('users', userSchema);
export default User;
