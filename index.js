const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wacbf1n.mongodb.net/?retryWrites=true&w=majority`;

// mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wacbf1n.mongodb.net/?retryWrites=true&w=majority
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("brandWebsite").collection("brandNames");
    const ProductCollection = client.db("brandWebsite").collection("products");
    const ProductCart = client.db("brandWebsite").collection("cart");
    ///getting brand names api
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
///getting cart api
app.get("/cart", async (req, res) => {
  const cursor = ProductCart.find();
  const result = await cursor.toArray();
  res.send(result);
});

    ///adding product api
    app.post("/addtocart", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await ProductCart.insertOne(newProduct);
      res.send(result);
    });

     ///adding product to cart api
     app.post("/addtoCart", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await ProductCollection.insertOne(newProduct);
      res.send(result);
    });

    ///getting specific brand products
    app.get("/brandproducts/:type", async (req, res) => {
      const type = req.params.type;
      const query = { brand: type };
      const result = await ProductCollection.find(query);
      const Brandproducts = await result.toArray();
      res.send(Brandproducts);
    });
///deleting product from cart api 
app.delete('/cartproduct/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await ProductCart.deleteOne(query);
  res.send(result);
})
    ///loading specific product api
    app.get("/specificProduct/:id", async (req, res) => {
      const id = req.params.id;

      console.log(" update id: ", id);
      const query = { _id: new ObjectId(id) };
      const result = await ProductCollection.findOne(query);
      console.log("to update result", result);
      res.send(result);
    });

    ///updating a product
    app.put("/updateproduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      console.log("from body update",updatedProduct)
      const newproduct = {
        
          name:updatedProduct.name,
          brand: updatedProduct.brand,
          date: updatedProduct.date,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          description: updatedProduct.description,
          type: updatedProduct.type,
          photo: updatedProduct.photo,
        }
        console.log("new product",newproduct)
      const product = {
        $set: {
          name:updatedProduct.name,
          brand: updatedProduct.brand,
          date: updatedProduct.date,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          description: updatedProduct.description,
          type: updatedProduct.type,
          photo: updatedProduct.photo,
        },
      };

      const result = await ProductCollection.updateOne(filter, product, options);
      console.log("updated obj", result);
      res.send(result);
    });

    ///adding all products

    // app.get('/addallproduct', async (req, res) => {
    //     const newProduct = products;
    //     console.log(newProduct);
    //     const options = { ordered: true };
    //     const result = await ProductCollection.insertMany(newProduct, options);
    //     if(result)
    //     console.log(" added succesfully");
    //     res.send(result);
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("brand server is running");
});

app.listen(port, () => {
  console.log(
    `brand Server is running on port: ${port}, ${process.env.DB_USER},${process.env.DB_PASS} `
  );
});
