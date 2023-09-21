import bcrypt from 'bcryptjs';
export default class Login {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = bcrypt.hash(password, 10);
    }
}
/*
import mongoose from 'mongoose';

const conn = mongoose.connect('mongodb://localhost:27017/mydb');

const regLoginSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const regLogin = mongoose.model('regLogin', regLoginSchema);

export default regLogin;


*/ 
