const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000;
const app=express();
require('dotenv').config()

// middle weare
app.use(cors())
app.use(express.json())



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t90v0gz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const servicesCollection=client.db("geniusCar").collection("services");
        const orderCollection=client.db("geniusCar").collection('orders');
        app.get("/services",async(req,res)=>{
            const  query={};
            const cursor=servicesCollection.find(query);
            const services=await cursor.toArray();
            res.send(services);
        });

        app.get("/services/:id",async(req,res)=>{
            const id=req.params.id;
            const quary={_id:ObjectId(id)};
            const service=await servicesCollection.findOne(quary);
            res.send(service);
        });

        app.get("/orders",async(req,res)=>{
            let query={};
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            const cursor=orderCollection.find(query);
            const orders=await cursor.toArray();
            res.send(orders);
        
        })

        app.post("/orders",async(req,res)=>{
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.send(result);
        })
        app.delete("/orders/:id",async(req,res)=>{
            const deleteId=req.params.id;
            const quary={_id:ObjectId(deleteId)}
            const result=await orderCollection.deleteOne(quary);
            res.send(result);
        })
        app.patch("/orders/:id",async(req,res)=>{
            const updateId=req.params.id;
            const status=req.body.status;
            const query={_id:ObjectId(updateId)}
            const updateDoc={
                $set:{
                    status:status
                }
            }
            const result=await orderCollection.updateOne(query,updateDoc);
            res.send(result);
        })


    }
    finally{

    }

}

run().catch(error=>console.error("Error",error))


app.get("/",(req,res)=>{
    res.send("Genius Server is Running");
})

app.listen(port,()=>{
    console.log(`Genius server is running on ${port}`)
})