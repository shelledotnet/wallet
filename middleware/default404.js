const express=require('express');
const app=express();
const { v4: uuid } = require("uuid");

const default404 = app.all("*", (req, res) => {
  res.status(404).send({ code: 404, description: "failed", ref: uuid() }); //u cant res or return status u chain it send or sendStatus else the app will collapse
});

 module.exports=default404;