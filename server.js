const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.use('/api', require('./src/routes.js'));


app.listen('3001', () =>{
    console.log("server running on 3001");
})


