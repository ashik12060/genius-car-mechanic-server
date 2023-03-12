const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;



const app = express();

const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

// users
//  name: arabian1 pass: QbbaWLRyRMeTIPud
// name: CarShop pass: xr72MoivM3zm43MA
// userSample j8akL4Xr9Mw5RJl3

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdurn9t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("hit the api", service);

           
            
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            app.json(result);
        })
    }
    finally {
        //await client.close()
    }
}



run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("hitting the server.")
})

app.listen(port, (req, res) => {
    console.log("listening on port", port);
})