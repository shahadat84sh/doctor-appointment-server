const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;
// 
//

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xu7lgvl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const doctorCollection = client.db('appointDB').collection('doctorList')
    const appointCollection = client.db('appointDB').collection('appointList')
    // Send a ping to confirm a successful connection
    app.get('/doctorlist', async (req,res) =>{
        const cursor = doctorCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.post('/appoint', async (req, res) =>{
        const appoint = req.body;
        console.log(appoint);
        const result = await appointCollection.insertOne(appoint)
        res.send(result)
    })

    app.get('/appoint', async(req, res)=>{
      console.log(req.query.email);
      let query = {}
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await appointCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/appoint/:id', async(req, res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)};
      const result = await appointCollection.deleteOne(query)
      res.send(result)
    })
    app.patch('/appoint/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateAppoint = req.body;
      console.log(updateAppoint);
      const updateDoc = {
        $set: {
          status: updateAppoint.status
        },
      };
      const result = await appointCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send("Doctor AppointMent sever Running")
})

app.listen(port, ()=>{
    console.log(`Appointment server running on port ${port}`);
})