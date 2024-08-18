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

    app.get("/products", async (req, res) => {
      const size = parseInt(req.query.size) || 10; // Default size if not provided
      const page = (parseInt(req.query.page) || 1) - 1; // Default page if not provided
      const search = req.query.search;
      const sort = req.query.sort; // Sort parameter
      const brandName = req.query.brandName;
      const category = req.query.category;
      const priceRange = req.query.priceRange; // "under100" or "above100"
    
      let query = {};
    
      // Handle search keyword
      if (search) {
        const lowercasedSearch = search.toLowerCase();
        query["productName"] = { $regex: new RegExp(lowercasedSearch, "i") };
      }
    
      // Handle brand name filter
      if (brandName) {
        query["brandName"] = brandName;
      }
    
      // Handle category filter
      if (category) {
        query["category"] = category;
      }
    
      // Handle price range filter
      if (priceRange === "under100") {
        query["price"] = { $lte: 100 };
      } else if (priceRange === "above100") {
        query["price"] = { $gt: 100 };
      }
    
      const cursor = productCollection.find(query);
    
      // Handle sorting
      if (sort === "-price") {
        cursor.sort({ price: -1 }); // Price High to Low
      } else if (sort === "price") {
        cursor.sort({ price: 1 }); // Price Low to High
      } else if (sort === "-productCreationDate") {
        cursor.sort({ productCreationDate: -1 }); // Newest First
      }
    
      const result = await cursor.skip(page * size).limit(size).toArray();
      console.log("Products fetched:", result); // Detailed log
      res.send(result);
  });
    
  // Route to fetch product count with filters and search
  app.get("/products-count", async (req, res) => {
      const search = req.query.search;
      const brandName = req.query.brandName;
      const category = req.query.category;
      const priceRange = req.query.priceRange; // "under100" or "above100"
    
      let query = {};
    
      // Handle search keyword
      if (search) {
        const lowercasedSearch = search.toLowerCase();
        query["productName"] = { $regex: new RegExp(lowercasedSearch, "i") };
      }
    
      // Handle brand name filter
      if (brandName) {
        query["brandName"] = brandName;
      }
    
      // Handle category filter
      if (category) {
        query["category"] = category;
      }
    
      // Handle price range filter
      if (priceRange === "under100") {
        query["price"] = { $lte: 100 };
      } else if (priceRange === "above100") {
        query["price"] = { $gt: 100 };
      }
    
      const count = await productCollection.countDocuments(query);
      console.log("Total count:", count); // Detailed log
      res.send({ count });
  });
  
   
    // app.get("/products", async (req, res) => {
    //   const size = parseInt(req.query.size);
    //   const page = parseInt(req.query.page) - 1;
    //   const search = req.query.search;
    //   const sort = req.query.sort; // Sort parameter
    //   const brandName = req.query.brandName;
    //   const category = req.query.category;
    //   const priceRange = req.query.priceRange; // "under100" or "above100"
  
    //   let query = {};
  
    //   // Handle search keyword
    //   if (search) {
    //     const lowercasedSearch = search.toLowerCase();
    //     query["productName"] = { $regex: new RegExp(lowercasedSearch, "i") };
    //   }
  
    //   // Handle brand name filter
    //   if (brandName) {
    //     query["brandName"] = brandName;
    //   }
  
    //   // Handle category filter
    //   if (category) {
    //     query["category"] = category;
    //   }
  
    //   // Handle price range filter
    //   if (priceRange === "under100") {
    //     query["price"] = { $lte: 100 };
    //   } else if (priceRange === "above100") {
    //     query["price"] = { $gt: 100 };
    //   }
  
    //   const cursor = productCollection.find(query);
  
    //   // Handle sorting
    //   if (sort === "-price") {
    //     cursor.sort({ price: -1 }); // Price High to Low
    //   } else if (sort === "price") {
    //     cursor.sort({ price: 1 }); // Price Low to High
    //   } else if (sort === "-productCreationDate") {
    //     cursor.sort({ productCreationDate: -1 }); // Newest First
    //   }
  
    //   const result = await cursor.skip(page * size).limit(size).toArray();
    //   console.log(result);
    //   res.send(result);
    // });
  
    // // Route to fetch product count with filters and search
    // app.get("/products-count", async (req, res) => {
    //   const search = req.query.search;
    //   const brandName = req.query.brandName;
    //   const category = req.query.category;
    //   const priceRange = req.query.priceRange; // "under100" or "above100"
  
    //   let query = {};
  
    //   // Handle search keyword
    //   if (search) {
    //     const lowercasedSearch = search.toLowerCase();
    //     query["productName"] = { $regex: new RegExp(lowercasedSearch, "i") };
    //   }
  
    //   // Handle brand name filter
    //   if (brandName) {
    //     query["brandName"] = brandName;
    //   }
  
    //   // Handle category filter
    //   if (category) {
    //     query["category"] = category;
    //   }
  
    //   // Handle price range filter
    //   if (priceRange === "under100") {
    //     query["price"] = { $lte: 100 };
    //   } else if (priceRange === "above100") {
    //     query["price"] = { $gt: 100 };
    //   }
  
    //   const count = await productCollection.countDocuments(query);
    //   console.log(count);
    //   res.send({ count });
    // });







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
 