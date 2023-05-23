const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const { Timestamp } = require('mongodb')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)) throw new Error('Email is invalid')
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value){
      if(value.toLowerCase().includes('password')) throw new Error('Please change your password.')
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value){
      if (value < 0) throw new Error('Age must be a positive number')
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
},
{
  timestamps: true
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign( { _id: user['_id'] }, process.env.JWT_SECRET )

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user =  await User.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  const is_match = await bcrypt.compare(password, user.password);

  if(!is_match){
    throw new Error('User not found')
  }
  return user;
}

userSchema.pre('save', async function(next){
  const user = this;
  if(user.isModified('password'))
    user.password = bcrypt.hashSync(user.password, 8);
  next();
})

userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id })

  next();
})

const User = mongoose.model('User', userSchema)

module.exports = User