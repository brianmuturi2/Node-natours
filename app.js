const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json())

/*app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server side!', app: 'natours' });
});
app.post('/', (req, res) => {
  res.status(200).send('You can post to this endpoint')
})*/

// Get tours to serve
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Get tours
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      }
    })
})

// Get tour by id
app.get('/api/v1/tours/:id', (req, res) => {
  console.log('request params is ', req.params);
  const tour = tours.find(cur => cur.id === +req.params.id);
  if (tour) {
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } else {
    res.status(404).json({
      status: 'error'
    })
  }

})

// Post tours
app.post('/api/v1/tours', (req, res) => {
  const id = +((tours[tours.length-1].id) + 1);
  const newTour = {...req.body, id}
  const newTours = [...tours, newTour];
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  });
});

// Patch tour
app.patch('/api/v1/tours/:id', (req, res) => {
  console.log('running');
  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[+req.params.id - 1]
    }
  })
})

// Delete tour
app.delete('/api/v1/tours/:id', (req, res) => {
  console.log('running');
  res.status(204).json({
    status: 'success',
    data: null
  })
})

// Start server
const port = 3000;

app.listen(port,  () => {
  console.log(`App running on port ${port}`);
});

