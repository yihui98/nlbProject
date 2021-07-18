const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  BID: {
      type: String,
      unique: true,
      required: true,
  },
  TitleName: String,
  Author: String,
  OtherAuthors: String,
  Publisher: String,
  PhysicalDesc: String,
  Sumamry: String,
})

bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.BID.toString()
  }
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book