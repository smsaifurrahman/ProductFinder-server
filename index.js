const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
//Middleware
app.use(cors());
app.use(express.json());

//ProductFinderDb J1FCPh7lKKBHZXBa




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjovpu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const productCollection = client.db("ProductFinderDb").collection("products");


    // Get all products with sorting
    app.get("/products", async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page) - 1;
      const search = req.query.search;
      const sort = req.query.sort; // Sort parameter
  
      let query = {};
      if (search) {
          const lowercasedSearch = search.toLowerCase();
          query["productName"] = { $regex: new RegExp(lowercasedSearch, "i") };
      }
  
      const cursor = productCollection.find(query);
  
      // Handle sorting
      if (sort === "-price") {
          cursor.sort({ price: -1 }); // Price Low to High
      } else if (sort === "price") {
          cursor.sort({ price: 1 }); // Price High to Low
      } else if (sort === "-productCreationDate") {
          cursor.sort({ productCreationDate: -1 }); // Newest First
      }
  
      const result = await cursor.skip(page * size).limit(size).toArray();
  
      res.send(result);
  });
  


    //    //Get all products
    //    app.get("/products", async (req, res) => {
    //     const size = parseInt(req.query.size);
    //     const page = parseInt(req.query.page) - 1;
    //     const search = req.query.search;
    //     console.log(search);
    //     let query = {} ;
    //     if (search) {
    //        const lowercasedSearch = search.toLowerCase();
    //        query["productName"] = { $in: [new RegExp(lowercasedSearch, "i")] }; // Using regex for case-insensitive search

    //       // query["productName"] = { $regex: new RegExp(lowercasedSearch, "i") };
    //     }
    //     const result = await productCollection
    //        .find(query)
    //        .skip(page * size)
    //        .limit(size)
    //        .toArray();
    //     console.log(result);
    //     res.send(result);
    //  });



           //Get all products count
           app.get("/products-count",  async (req, res) => {
            let query = {} ;
            const search = req.query.search;
            if (search) {
               const lowercasedSearch = search.toLowerCase();
               query["productName"] = { $in: [new RegExp(lowercasedSearch, "i")] }; // Using regex for case-insensitive search
              // query["productName"] = { $regex: new RegExp(lowercasedSearch, "i") };
            }
            const count = await productCollection.countDocuments(query);
            res.send({ count });
         });

  // // get all users from db
  //     app.get("/products",  async (req, res) => {
  //        const result = await productCollection.find().toArray();
  //        res.send(result);
  //     });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("ProductFinder is working");
 });
 
 app.listen(port, () => {
    console.log(`ProductFinder is sitting on port ${port}`);
 });
 