const PORT = 8000
const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()

app.use(cors());
app.get('/',(req,res) =>  {
    res.json({name: "wes", key: process.env.SECRET_KEY })
    console.log(process.env.SECRET_KEY)
})



app.listen(8000, () => console.log(`Server is running on port ${PORT}`))



