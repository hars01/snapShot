require('dotenv').config(); // eshke bina hum .env file ke keys aur value ko access nahi kar payenge

const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});