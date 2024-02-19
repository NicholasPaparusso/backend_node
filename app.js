const bodyParser = require('body-parser');
const express = require('express');
const app = express();
// const fileUpload = require("express-fileupload");
const cors = require("cors");

const bevandeRoutes = require('./routes/bevande');
const merendineRoutes = require('./routes/merendine');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');


app.use(express.json());
// app.use(fileUpload({debug:true}))
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});


app.use('/bevande', bevandeRoutes);  
app.use('/merendine', merendineRoutes);
app.use(authRoutes);  
app.use('/order',orderRoutes);  

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong.';
    res.status(status).json({ message: message });
  });
 
  

const port = process.env.PORT || 8080;
app.listen(port, (err, res) => {
  if (err) {
    console.log(err)
    return res.status(500).send(err.message)
  }else {
      console.log('[INFO] Server Running on port:', port);
  }
});

module.exports = app;
