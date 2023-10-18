const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
app.use(cors());
app.use(express.json());
const products = [
  {
    name: "Galaxy S21",
    brand: "Samsung",
    date: "2023-01-15",
    price: 799.99,
    rating: 4.5,
    description: "The latest flagship smartphone from Samsung.",
    type: "phone",
    photo:
      "https://images.unsplash.com/photo-1610792516286-524726503fb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2FsYXh5JTIwUzIxfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Galaxy Tab S7",
    brand: "Samsung",
    date: "2023-02-20",
    price: 649.99,
    rating: 4.7,
    description: "Powerful tablet with a large AMOLED display.",
    type: "tablet",
    photo:
      "https://images.unsplash.com/photo-1620288650879-20db0eb38c05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2FsYXh5JTIwVGFiJTIwUzd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Samsung Galaxy Watch 4",
    brand: "Samsung",
    date: "2023-03-25",
    price: 299.99,
    rating: 4.6,
    description: "Smartwatch with health and fitness tracking features.",
    type: "wearable",
    photo:
      "https://unsplash.com/photos/a-person-with-a-tattoo-on-their-arm-holding-an-apple-watch-hwn20c-tQrQ",
  },
  {
    name: "Samsung Odyssey G9",
    brand: "Samsung",
    date: "2023-04-10",
    price: 1499.99,
    rating: 4.8,
    description: "Ultra-wide gaming monitor with high refresh rate.",
    type: "monitor",
    photo:
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "iPhone 13 Pro",
    brand: "Apple",
    date: "2023-03-10",
    price: 999.99,
    rating: 4.8,
    description:
      "Apple's latest pro-level smartphone with advanced camera features.",
    type: "phone",
    photo:
      "https://media.istockphoto.com/id/1401647536/photo/male-hand-holding-phone-isolated-on-white-mock-up-smartphone-blank-screen-with-clipping-path.webp?b=1&s=612x612&w=0&k=20&c=sLojkozdtqARf-G22V34Tz9W-nkwY_jUOEeZ41M71A0= ",
  },
  {
    name: "MacBook Air",
    brand: "Apple",
    date: "2023-04-05",
    price: 1199.99,
    rating: 4.6,
    description: "Ultra-thin and lightweight laptop for everyday use.",
    type: "laptop",
    photo:
      "https://cdn.pixabay.com/photo/2016/10/15/13/40/laptop-1742462_640.jpg",
  },
  {
    name: "iPad Air (2023)",
    brand: "Apple",
    date: "2023-02-15",
    price: 599.99,
    rating: 4.7,
    description:
      "Powerful and versatile tablet for productivity and entertainment.",
    type: "tablet",
    photo:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aXBhZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "AirPods Pro",
    brand: "Apple",
    date: "2023-01-05",
    price: 249.99,
    rating: 4.5,
    description: "High-quality noise-canceling earbuds with immersive sound.",
    type: "earbuds",
    photo:
      "https://images.unsplash.com/photo-1574920162043-b872873f19c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWlyJTIwcG9kc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Core i9-12900K",
    brand: "Intel",
    date: "2023-02-28",
    price: 599.99,
    rating: 4.9,
    description:
      "High-performance desktop processor for gaming and multitasking.",
    type: "processor",
    photo: "https://cdn.pixabay.com/photo/2019/08/08/16/56/cpu-4393384_640.jpg",
  },
  {
    name: "Core i7-12700K",
    brand: "Intel",
    date: "2023-03-20",
    price: 449.99,
    rating: 4.7,
    description:
      "Top-tier processor with excellent performance for gaming and content creation.",
    type: "processor",
    photo:
      "https://media.istockphoto.com/id/1423747086/photo/intel-i5-12600k.webp?b=1&s=612x612&w=0&k=20&c=j30nFAndCtJoNJEw1TpFsId_UxfBzLihSyjI2-ZfUhk=",
  },
  {
    name: "Intel SSD 670p",
    brand: "Intel",
    date: "2023-04-12",
    price: 129.99,
    rating: 4.6,
    description: "Fast and reliable NVMe SSD for storage upgrades.",
    type: "storage",
    photo: "intel_ssd_670p.jpg",
  },
  {
    name: "Intel NUC 11",
    brand: "Intel",
    date: "2023-01-30",
    price: 699.99,
    rating: 4.8,
    description: "Compact and powerful mini PC for various computing needs.",
    type: "mini PC",
    photo:
      "https://media.istockphoto.com/id/621977854/photo/hard-disks-and-solid-state-sata-drives.webp?b=1&s=612x612&w=0&k=20&c=M0XyIEDUQz24rUEZAnmj0s8LPBqZ0YNLMcQLxCUsIXE=",
  },
  {
    name: "ROG Phone 6",
    brand: "Asus",
    date: "2023-01-10",
    price: 899.99,
    rating: 4.7,
    description: "Gaming smartphone with high-refresh-rate display.",
    type: "phone",
    photo:
      "https://cdn.pixabay.com/photo/2016/12/09/11/33/smartphone-1894723_640.jpg",
  },
  {
    name: "Asus ROG Strix Scar 17",
    brand: "Asus",
    date: "2023-02-28",
    price: 1799.99,
    rating: 4.8,
    description:
      "High-end gaming laptop with powerful graphics and fast display.",
    type: "laptop",
    photo:
      "https://media.istockphoto.com/id/1394988455/photo/laptop-with-a-blank-screen-on-a-white-background.webp?b=1&s=612x612&w=0&k=20&c=VCCVeK25QpSCdGjiDgeviwz2pJfikLyclwhX-MQblhg=",
  },
  {
    name: "Asus TUF Gaming VG279QM",
    brand: "Asus",
    date: "2023-03-15",
    price: 399.99,
    rating: 4.6,
    description:
      "27-inch gaming monitor with high refresh rate and low input lag.",
    type: "monitor",
    photo: "https://cdn.pixabay.com/photo/2012/04/13/17/00/lcd-32872_640.png",
  },
  {
    name: "Asus ROG Claymore II",
    brand: "Asus",
    date: "2023-04-05",
    price: 199.99,
    rating: 4.7,
    description: "Mechanical gaming keyboard with customizable RGB lighting.",
    type: "keyboard",
    photo:
      "https://cdn.pixabay.com/photo/2015/05/26/23/52/technology-785742_640.jpg",
  },
  {
    name: "WH-1000XM4",
    brand: "Sony",
    date: "2023-03-28",
    price: 349.99,
    rating: 4.9,
    description:
      "Premium noise-canceling headphones with excellent sound quality.",
    type: "headphone",
    photo:
      "https://media.istockphoto.com/id/1325906677/photo/modern-design-of-black-color-wireless-earphone-isolated.webp?b=1&s=612x612&w=0&k=20&c=d4XpB0vQjh3Yx-9Ab0bOyYDmuDXUKduEwygr3PVX5nk=",
  },
  {
    name: "Sony A7 IV",
    brand: "Sony",
    date: "2023-02-20",
    price: 2499.99,
    rating: 4.8,
    description:
      "High-quality mirrorless camera with advanced features for photography and videography.",
    type: "camera",
    photo:
      "https://cdn.pixabay.com/photo/2013/11/28/10/02/camera-219958_640.jpg",
  },
  {
    name: "Sony X900H 4K TV",
    brand: "Sony",
    date: "2023-01-05",
    price: 1199.99,
    rating: 4.7,
    description: "4K HDR TV with excellent picture quality and smart features.",
    type: "tv",
    photo:
      "https://media.istockphoto.com/id/486895337/photo/high-definition-television.webp?b=1&s=612x612&w=0&k=20&c=YxxDz_UBpte12KGVdYTrZIEH1WOtrkCMIxaZd1eK4JY=",
  },
  {
    name: "Sony WH-XB900N",
    brand: "Sony",
    date: "2023-04-15",
    price: 199.99,
    rating: 4.6,
    description:
      "Wireless headphones with extra bass for a powerful audio experience.",
    type: "headphone",
    photo:
      "https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg",
  },
];

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

    ///getting brand names api
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    ///adding product api
    app.post("/addproduct", async (req, res) => {
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
