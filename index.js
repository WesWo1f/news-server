//const PORT = 8000
let port = process.env.PORT || 8000;
const express = require('express')
const cors = require("cors")
const axios = require("axios");
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser');
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());


app.post('/newsendpoint', async (req,res) => {
  let category = req.body.category
  let pageNumber = req.body.page
  const mainNewsRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&categories=${category}&language=en&locale=us&page=${pageNumber}&exclude_domains=news.google.com,npr.org`
  const returnedData = await fetch(mainNewsRequestURL)
  .then((response) => response.json())
  .then((result) => {
    return result
  })
  res.send({fetchResult: await returnedData })
})

app.post('/crawldata', async (req,res) => {
  let pageNumber = req.body.page
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  } 
  else {
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&language=en&locale=us&page=${pageNumber}&exclude_domains=news.google.com`
    const returnedData = await fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      return result
    })
    res.send({fetchResult: returnedData})
  }
})

app.listen(port,() => {
  console.log(`Server is running on port ${port}`)
})
