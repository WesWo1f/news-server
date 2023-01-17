//const PORT = 8000
let port = process.env.PORT || 3000;
const express = require('express')
const cors = require("cors")
const axios = require("axios");
require('dotenv').config()

const app = express()
const bodyParser = require('body-parser');
//app.use(express.json())
app.use(cors())

// app.get('/', async (req,res) => {

//   async function getUser() {
//     try {
//       const response = await axios.get('/user?ID=12345');
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//     }
//   }


// });





// app.post('/', async (req,res) => {
//   const options = {
//     method: 'GET',
//     url: 'https://bing-news-search1.p.rapidapi.com/news',
//     params: {safeSearch: 'Off', textFormat: 'Raw'},
//     headers: {
//       'X-BingApis-SDK': 'true',
//       'X-RapidAPI-Key': process.env.THE_KEY,
//       'X-RapidAPI-Host': process.env.THE_HOST
//     }
//   };
  
//   axios.request(options).then(function (response) {
//     console.log(response.data);
//     res.json({ name:'wes', dataStuff: response.data})
//   }).catch(function (error) {
//     console.error(error);
//     res.json({ name:'wes',})
//   });



// });



app.post('/category', async (req,res) =>  {
    console.log("category ran!!")
    let category =  req.body.category
    if (typeof(category) !== "undefined"){
      console.log(category)
      const options = {
      method: 'GET',
      url: 'https://bing-news-search1.p.rapidapi.com/news/search',
      params: {
      q: `${category}`,
      count: '100',
      freshness: 'Day', 
      textFormat: 'Raw', 
      safeSearch: 'Off'},
      headers: {
        'X-BingApis-SDK': 'true',
        'X-RapidAPI-Key': process.env.THE_KEY,
        'X-RapidAPI-Host': process.env.THE_HOST
      }
    };
    axios.request(options).then(function (response) {
      res.json({name: "wes", theNews: response.data})
        console.log(response.data);
    }).catch(function (error) {
        console.log("category ran!!")
        console.error(error);
    });
    console.log("category ran!!")
    console.log("this is options: "+options)

    }

  })

// app.post('/category', async (req,res) =>  {
//   const category =  req.body.category
//   console.log(category)
//     const options = {
//         method: 'GET',
//         url: 'https://bing-news-search1.p.rapidapi.com/news/search',
//         params: {
//         q: `${category}`,
//         count: '100',
//         freshness: 'Day', 
//         textFormat: 'Raw', 
//         safeSearch: 'Off'},
//         headers: {
//           'X-BingApis-SDK': 'true',
//           'X-RapidAPI-Key': process.env.THE_KEY,
//           'X-RapidAPI-Host': process.env.THE_HOST
//         }
//       };
//       axios.request(options).then(function (response) {
//         res.json({name: "wes", theNews: response.data})
//           //console.log(response.data);
//       }).catch(function (error) {
//           console.error(error);
//       });

//     console.log("category ran!!")
//     //console.log("this is options: "+options)
// })



// app.post('/search', async (req,res) =>  {
//   const search =  req.body.search
//   console.log(search)
//     const options = {
//         method: 'GET',
//         url: 'https://bing-news-search1.p.rapidapi.com/news/search',
//         params: {
//         q: `${search}`,
//         count: '100',
//         freshness: 'Day', 
//         textFormat: 'Raw', 
//         safeSearch: 'Off'},
//         headers: {
//           'X-BingApis-SDK': 'true',
//           'X-RapidAPI-Key': process.env.THE_KEY,
//           'X-RapidAPI-Host': process.env.THE_HOST
//         }
//       };
      
//       axios.request(options).then(function (response) {
//         res.json({name: "wes", theNews: response.data})
//           //console.log(response.data);
//       }).catch(function (error) {
//           console.error(error);
//       });

//     console.log("search ran!!")
//     //console.log("this is options: "+options)

// })

// app.post('/trending',  async (req,res) =>  {
//   const search =  req.body.search
//   console.log(search)
//     const options = {
//         method: 'GET',
//         url: 'https://bing-news-search1.p.rapidapi.com/news/trendingtopics',
//         params: {
//         count: '100',
//         textFormat: 'Raw', 
//         safeSearch: 'Off'},
//         headers: {
//           'X-BingApis-SDK': 'true',
//           'X-RapidAPI-Key': process.env.THE_KEY,
//           'X-RapidAPI-Host': process.env.THE_HOST
//         }
//       };
      
//       axios.request(options).then(function (response) {
//         res.json({theNews: response.data})
//           //console.log(response.data);
//       }).catch(function (error) {
//           console.error(error);
//       });

//     console.log("trending ran!!")
//     //console.log("this is options: "+options)

// })





app.listen(port,() => {
  console.log(`Server is running on port ${port}`)
})
//app.listen(8000, () => console.log(`Server is running on port ${PORT}`))



