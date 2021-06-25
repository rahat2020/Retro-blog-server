const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config
const { MongoClient } = require('mongodb');
const port =process.env.PORT ||2000


app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello there! this project is running on this port')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edqlt.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
console.log('database connection established')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})