const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Errors outside Express: Uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');

  // Give server basically time to finish all request that are still pending or being handled at this time, and after then kill it
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Errors outside Express: Unhandle Rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLE REJECTION! 💥 Shutting down...');

  // Give server basically time to finish all request that are still pending or being handled at this time, and after then kill it
  server.close(() => {
    process.exit(1);
  });
});
