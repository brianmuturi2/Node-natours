const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

/********************************************* MIDDLEWARES *********************************************/

app.use(express.json());

// custom middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
})

app.use(morgan('dev'));


/********************************************* IO OPERATIONS *********************************************/

// Get tours to serve from json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


/********************************************* ROUTE HANDLERS *********************************************/

// Get all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
}

// Get tour by id
const getTourById = (req, res) => {
  console.log('request params is ', req.params);
  const tour = tours.find(cur => cur.id === +req.params.id);
  if (tour) {
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } else {
    res.status(404).json({
      status: 'error'
    });
  }
}

// Create tour
const createTour = (req, res) => {
  const id = +((tours[tours.length - 1].id) + 1);
  const newTour = { ...req.body, id };
  const newTours = [...tours, newTour];
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
}


// Edit tour
const editTour = (req, res) => {
  console.log('running');
  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[+req.params.id - 1]
    }
  });
}

// Delete tour
const deleteTour = (req, res) => {
  console.log('running');
  res.status(204).json({
    status: 'success',
    data: null
  });
}

/********************************************* ROUTES *********************************************/

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id').get(getTourById).patch(editTour).delete(deleteTour);

/*app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getTourById);

app.post('/api/v1/tours', createTour);

app.patch('/api/v1/tours/:id', editTour);

app.delete('/api/v1/tours/:id', deleteTour);*/

/*app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server side!', app: 'natours' });
});
app.post('/', (req, res) => {
  res.status(200).send('You can post to this endpoint')
})*/

/********************************************* SERVER *********************************************/

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

