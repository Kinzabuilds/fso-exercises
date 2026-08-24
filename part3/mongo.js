const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =  `mongodb+srv://kinza:${password}@cluster0.ioreupi.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')

    const personSchema = new mongoose.Schema({
      name: String,
      number: String
    })

    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {
      // Only password was given
      Person.find({})
        .then(persons => {
          console.log('phonebook:')

          persons.forEach(person => {
            console.log(person.name, person.number)
          })

          mongoose.connection.close()
        })
    } else {
      // Password, name and number were given
      const person = new Person({
        name: name,
        number: number
      })

      person.save()
        .then(() => {
          console.log(`added ${name} number ${number} to phonebook`)
          mongoose.connection.close()
        })
    }
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
    mongoose.connection.close()
  })