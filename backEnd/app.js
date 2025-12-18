import express from "express";
const app = express();
const Port = 3000;

app.get("/",(req, res)=>{
    res.send("hellow world")
});

app.listen(Port,()=>{
    console.log(`here is the ${Port}`)
});