const express = require('express');
const bodyParser = require('body-parser');
const appRoute = require('./routes/appServer');
const authRoute = require('./routes/authServer');
const clientRoute = require('./routes/client');


const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});



app.use('/app', appRoute);
app.use('/auth', authRoute);
app.use('/login', clientRoute);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
