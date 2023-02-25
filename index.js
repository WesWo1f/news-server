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
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&language=en&locale=us&page=${pageNumber}&exclude_domains=news.google.com`
    fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      res.send({fetchResult: result} )
    })
  } 
  else{
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&categories=${category}&language=en&locale=us&page=${pageNumber}&exclude_domains=news.google.com`
    fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      //result = findDuplicateTitles(result)
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
    const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&language=en&locale=us&page=${pageNumber}&exclude_domains=news.google.com`
    const returnedData = await fetch(theFetchRequestURL)
    .then((response) => response.json())
    .then((result) => {
      return result
    })
    res.send({fetchResult: await parsingCrawlData(returnedData)})
  }
  async function parsingCrawlData(obj) {
    let data = [];
    for (let index = 0; index < obj.data.length; index++) {
      data.push({ // Add each crawlData object to the data array
        title: obj.data[index].title,
        url: obj.data[index].url,
        source: obj.data[index].source
      });
    }
    let crawlData = { // Create a crawlData object with a data property that contains the data array
      data: data
    };
    return crawlData; 
  }
})

app.post('/similarnewsdata', async (req, res) => {
  let newsUuid = req.body.newsUuid;
  let date = new Date();
  date.setDate(date.getDate() - 14);
  let twoWeeksAgo = date.toISOString().split('T')[0];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: "Content cannot be empty" });
  }

  const theFetchRequestURL = `https://api.thenewsapi.com/v1/news/similar/${newsUuid}?api_token=${process.env.API_KEY}&language=en&locale=us&limit=25&published_after=${twoWeeksAgo}&exclude_domains=news.google.com`;
  const response = await fetch(theFetchRequestURL);
  const result = await response.json();
  const duplicatedTitlesRemoved = await findDuplicateTitles(result);
  const filteredData = await numberOfArticlesToReturn(duplicatedTitlesRemoved);

  return res.send({ fetchResult: filteredData });
});

async function findDuplicateTitles(obj){
  // Count the number of title occurrences
  const titleCounts = {};
  obj.data.forEach(x => { titleCounts[x.title] = (titleCounts[x.title] || 0) + 1;});
  
  // Get an array of duplicated titles
  const duplicatedTitles = Object.entries(titleCounts)
      .filter(entry => entry[1] >= 2)
      .map(entry => entry[0]);
  
  // Remove duplicated titles from the object
  obj = obj.data.filter(x => !duplicatedTitles.includes(x.title));
  // return the updated object
  return obj;
}

async function numberOfArticlesToReturn(obj){
  try {
    obj = obj.slice(0, 3);
  } catch (error) {
    //console.log(error)
  }
  return obj
}








app.listen(port,() => {
  console.log(`Server is running on port ${port}`)
})
