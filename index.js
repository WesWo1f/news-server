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


app.post('/category', async (req,res) => {
  let category = req.body.category
  let pageNumber = req.body.page

  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  } 
  else if (category === 'trending') {
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&language=en&locale=us&page=${pageNumber}`
    fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      res.send({fetchResult: result} )
    })
  } 
  else{
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&categories=${category}&language=en&locale=us&page=${pageNumber}`
    fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      res.send({fetchResult: result} )
    })
  }
})

app.post('/crawldata', async (req,res) => {
  let pageNumber = req.body.page
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  } 
  else {
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&language=en&locale=us&page=${pageNumber}`
    fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      res.send({fetchResult: result} )
      //console.log('Success:', result);
    })
  }
})

app.post('/similardata',async (req,res) => {
  let newsUuid = req.body.page
  let date = new Date();
  date.setDate(date.getDate() - 14);
  let twoWeeksAgo = date.toISOString().split('T')[0];

  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  } 
  else {
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/similar/${newsUuid}?api_token=${process.env.API_KEY}&language=en&locale=us&limit=3&published_on=${twoWeeksAgo}`
    fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      res.send({fetchResult: result} )
      //console.log('Success:', result);
    })
  }


})




app.listen(port,() => {
  console.log(`Server is running on port ${port}`)
})
//app.listen(8000, () => console.log(`Server is running on port ${PORT}`))



