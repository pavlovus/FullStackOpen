const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: 2,
    required: true
  },
  author: String,
  url: {
    type: String,
    validate: {
      validator: (v) => {
        return /https?:\/\/.+/.test(v)
      },
      message: (props) => `${props.value} is not a valid URL!`
    },
    required: true
  },
  likes: {
    type: Number,
    min: 0,
    default: 0
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)