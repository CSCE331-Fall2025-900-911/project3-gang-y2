const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0');

app.get('/', (req, res) => {
  res.send('Basic template for our POS');
});

app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
});