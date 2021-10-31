const express = require('express');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();

//middleware
app.use(cors());
app.use(express.json())


// PORT
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Turista is running');
});

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyyp9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db('turista');
        const packageCollection = database.collection('packages');
        const userCollection = database.collection('users');

        // GET API
        app.get('/all-package', async (req, res) => {
            const cursor = packageCollection.find({});
            const allPackage = await cursor.toArray();
            res.send(allPackage);
        })

        // GET API
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // POST API
        app.post('/order', async (req, res) => {
            const addUser = req.body;
            const result = await userCollection.insertOne(addUser)
            res.json(result)
        })

        // POST API
        app.post('/all-package', async (req, res) => {
            const addNewPackage = req.body;
            const result = await packageCollection.insertOne(addNewPackage)
            res.json(result)
        })

        // Delete API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('Listening port is:', port);
});