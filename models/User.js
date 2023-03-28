const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, index: {unique: true}},
    password: { type: String, required: true},
    type: {type: String, required: true},
    _id: {type: String, default: uuid4}
});

//register model to collection
const User = mongoose.model("users", UserSchema);

//make out model accesible to files
module.exports = User;