
import mongoose from 'mongoose';

const regLoginSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const regLogin = mongoose.model('regLogin', regLoginSchema);

export default regLogin;


