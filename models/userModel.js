const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, // transform email to lowercase
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String, // url to image in file system
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on create and save (cant use findOneAndUpdate mongoose method)
      validator: function(confirmPassword) {
        return confirmPassword === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  // only run if password is modified
  if (!this.isModified('password')) return next();

  // hash password with cost of 12
  // 12 is the computational cost for encrypting; the higher the stronger but slower
  this.password = await bcrypt.hash(this.password, 11);

  // delete confirm password field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // false means not changed
  return false
}

userSchema.methods.createPasswordResetToken = function() {

}

const User = mongoose.model('User', userSchema);

module.exports = User;
