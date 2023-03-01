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



app.post('/test', async (req,res) => {
  async function mainNewsCall(){
  
  let category = req.body.category
  let pageNumber = 1
  
  const mainNewsRequestURL = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.API_KEY}&categories=${category}&language=en&locale=us&page=${pageNumber}&exclude_domains=news.google.com,npr.org`
  let returnedData = await fetch(mainNewsRequestURL)
  .then((response) => response.json())
  .then((result) => {
    return result
  })
  return returnedData
  }
  const mainNewsData = await removeTitleDuplicates(await mainNewsCall())
  const uniqueObjTitle = removeDuplicates(mainNewsData, 'title');
  //const uniqueObjSource = removeDuplicates(uniqueObjTitle, 'source');

  let similarNewsData = [] 

  for (let index = 0; index < 5; index++) {
    try {
      similarNewsData.push(await similarNewsCall(uniqueObjTitle[index].uuid))
    } catch (error) {
      console.log(error)
    }
  }
  for (let index = 0; index < 5; index++) {
    try {
      uniqueObjTitle[index].similarNews = await similarNewsData[index]
    } catch (error) {
      console.log(error)
    }
  }
  //This code filters the data to include only articles that have at least three similar news articles.
  const shorterDataArray = shorteningDataArray(mainNewsData)
  function shorteningDataArray(obj){
    let newArray = obj.filter(element => {
      try {
        return element.similarNews.length >= 3
      } catch (error) {
        
      }
    })
    return newArray
  }
  // this code removes unneeded elements from the data
  const elementsRemoved = removingUnusedElements(shorterDataArray)
  function removingUnusedElements(obj){
    const newArray = obj.map(element => {
      const {uuid, description, keywords, snippet, language, relevance_score, locale, similarNews, ...rest} = element;
      
      const newSimilarNews = [];
      similarNews.forEach(({uuid, description, keywords, snippet, language, relevance_score, locale, image_url, categories, ...similarRest}) => {
        newSimilarNews.push(similarRest);
      });
      
      return {...rest, similarNews: newSimilarNews};
    });
    return newArray;
  }

  async function similarNewsCall(uuid){
    if(uuid !== 'undefined' && uuid.length > 1){
      const dateTwoWeeksAgo = getLastTwoWeeksDates();
      const similarNewsRequestURL = `https://api.thenewsapi.com/v1/news/similar/${uuid}?api_token=${process.env.API_KEY}&language=en&locale=us&limit=25&published_after=${dateTwoWeeksAgo}&exclude_domains=news.google.com`;
      
      const similarNewsResponse = await fetch(similarNewsRequestURL);
      const result = await similarNewsResponse.json();

      const deduplicatedData = await removeTitleDuplicates(result);

      const filteredData = await filterByNumberOfArticles(deduplicatedData, 3);
      console.log(filteredData)
      return filteredData;
    }
  }
  res.send({fetchResult: await elementsRemoved})
})



function getLastTwoWeeksDates() {
  const date = new Date();
  date.setDate(date.getDate() - 14);
  return date.toISOString().split('T')[0];
}

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

async function removeTitleDuplicates(obj){
  // Count the number of title occurrences
  const titleCounts = {};
  obj.data.forEach(x => { titleCounts[x.title] = (titleCounts[x.title] || 0) + 1;});
  
  // Get an array of duplicated titles
  const duplicatedTitles = Object.entries(titleCounts)
      .filter(entry => entry[1] >= 2)
      .map(entry => entry[0]);
  
  // Remove duplicated titles from the object
  obj = obj.data.filter(x => !duplicatedTitles.includes(x.title));  //ORIGNAL WORKING 
  // return the updated object

  return obj; 
}


function removeDuplicates(obj, key) {
  const propertyValues = Object.values(obj)
  const seen = new Set();
  return propertyValues.filter((item) => {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
}

async function filterByNumberOfArticles(obj){
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
