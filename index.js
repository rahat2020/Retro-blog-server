const express = require('express')
const app = express()
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfnjt.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const postCollection = client.db("retro").collection("items");
  const adminCollection = client.db("retro").collection("admin");

  // post uploading to the database
  app.post("/addPost", (req, res) => {
    const item = req.body
    postCollection.insertOne(item)
      .then((result) => {
        res.send(result.insertedCount > 0)
        console.log(result.insertedCount > 0)
      })
  })

  // showing post to the UI 
  app.get('/showPost', (req, res) => {
    postCollection.find({ id: req.params._id })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  // showing data to the BlogDetails
  app.get('/readBlog', (req, res) => {
    postCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  // adding admin to the database
  app.post('/addAdmin', (req, res) => {
    const isAdmin = req.body;
    adminCollection.insertOne(isAdmin)
      .then((result) => {
        res.send(result.insertedCount > 0)
        console.log(result.insertedCount > 0)
      })
  })

  // showing admin to the UI 
  app.get('/showAdmin', (req, res) => {
    adminCollection.find({ id: req.params._id })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  // admin management
  app.delete('/deletePost/:id', (req, res)=>{
    const id = ObjectID(req.params.id);
    postCollection.findOneAndDelete({_id: id})
    .then((err, result)=>{
      console.log(result)
      result.deletedCount > 0
    })
  })

  // If admin sign in the form
  app.post('/ifAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err, admin) => {
      res.send(admin.length > 0 )
    })
  })

  // perform actions on the collection object
  console.log('database connection established')
});

app.get('/', (req, res) => {
  res.send('Hello there! this project is running on this port')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})