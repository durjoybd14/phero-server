const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient;

const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghclx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("error", err);
  const ticketsCollection = client.db("airticket").collection("allTickets");
  const ordersCollection = client.db("airticket").collection("addOrder");
  const dhakaToKalkataCollection = client.db("airticket").collection("dhakaTokalkata");

  // post
  app.post("/addTickets", (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addDhakaToKalkata", (req, res) => {
    const order = req.body;
    dhakaToKalkataCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //get

  app.get("/alltickets", (req, res) => {
    ticketsCollection.find().toArray((err, result) => {
      res.send(result);
    });
  });

  app.get("/dhakaToKalkata", (req, res) => {
    dhakaToKalkataCollection.find().toArray((err, result) => {
      res.send(result);
    });
  });
});

app.listen(port, () => {
  console.log(`app listening at port ${port}`);
});
