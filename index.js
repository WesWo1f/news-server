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



app.post('/category', async (req,res) =>  {
  console.log(req.body)
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
    return;
  } 
  else{
    res.send({thisIsBody: req.body})
  }
 })

//**********NOTES********************
//  &search=
//  &language=en
//  &categories=
//  &exclude_categories=travel&published_after=2023-01-16
//  FULL EXAMPLE BELOW!
// https://api.thenewsapi.com/v1/news/all?&search=forex + (usd | gbp) -cad&language=en&categories=business,tech&exclude_categories=travel&published_after=2023-01-16



//  app.post('/category', async (req,res) => {
//   const searchRequest = req.body
//   const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/all?api_token=${process.env.API_KEY}&search=${searchRequest}`
//   fetch(theFetchRequestURL)
//   .then((response) => response.json())
//   .then((result) => {
//     res.send({fetchResult: result} )
//     console.log('Success:', result);
//   })
// })






app.listen(port,() => {
  console.log(`Server is running on port ${port}`)
})
//app.listen(8000, () => console.log(`Server is running on port ${PORT}`))



