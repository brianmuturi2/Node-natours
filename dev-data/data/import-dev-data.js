const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/TourModel');

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(conn => {
  console.log('DB Connection is')
})

// read json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported')
  } catch (e) {
    console.log('Not imported', e)
  }
  process.exit();
}

// delete all data

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('deleted all documents')
  } catch (e) {
    console.log('couldnt delete ', e);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv)
