const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;
const app = express();
require('dotenv').config()

app.use(express.json());
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jheyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();

    const database = client.db("newsDB");
    const userCollection = database.collection("newsAdmin");
    const commentCollection = database.collection("comment");

   app.post('/posts', async(req, res)=>{
       const post = req.body;
       const result = await userCollection.insertOne(post)
       res.send(result)
   })

   app.get('/posts', async(req, res)=>{
      const posts = userCollection.find()
      const result = await posts.toArray()
      res.send(result);
   })

   app.get('/posts/:id', async(req, res)=>{
      const id = req.params.id;
      const filter  = {_id: new ObjectId(id)}
      const post = await userCollection.findOne(filter)
      res.send(post)
   })

   app.put('/post/:id', async(req, res)=>{
    const id = req.params.id;
    const body = req.body;
    const { PostTitle, imgPath, description, name, category, time } = body || {}
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            PostTitle:PostTitle,
            imgPath : imgPath,
            description:description,
            name: name,
            category:category,
            time:time

        },
      };

      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
   })

   app.delete('/post/:id', async(req, res)=>{
       const id = req.params.id;
       const filter = {_id: new ObjectId(id)}
       const result = await userCollection.deleteOne(filter)
       res.send(result)  
   })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('hello world')
})


app.listen(port , ()=>{
    console.log(`Running Port : ${port}`)
})