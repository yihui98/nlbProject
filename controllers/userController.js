const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    return response.json(users.map(user => user.toJSON()))
    
  })

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    return response.json(user.toJSON())
    
  })

usersRouter.delete('/:id', async (request, response) => {
  const user = await User.findByIdAndRemove(request.params.id)
  return response.json(user.toJSON())
  
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3){
    return response.status(400).send({ error: 'password length less than 3' }).end()
  } 
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
  username: body.username,
  name: body.name,
  passwordHash: passwordHash,
  books: new Map()
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
  // Dictionary with key = BID, value = book object
  newUser = await User.findById(request.params.id)
  
  if (request.body.type === "DELETE"){
    newUser.books.delete(request.body.bid) //delete BID 
  } else if (request.body.type === "TEST"){
    console.log(newUser.books)
    console.log(book)
  }  else {
    const book = request.body.book
    newUser.books.set(book.BID, book)
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, newUser, {new : true})
  response.json(updatedUser)
})

module.exports = usersRouter