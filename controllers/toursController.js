const fs = require('fs');


/********************************************* IO OPERATIONS *********************************************/

// Get tours to serve from json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/********************************************* ROUTE HANDLERS/ CONTROLLERS *********************************************/

// Get all tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
}

// Get tour by id
exports.getTourById = (req, res) => {
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
exports.createTour = (req, res) => {
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
exports.editTour = (req, res) => {
  console.log('running');
  res.status(200).json({
    status: 'success',
    data: {
      tour: tours[+req.params.id - 1]
    }
  });
}

// Delete tour
exports.deleteTour = (req, res) => {
  console.log('running');
  res.status(204).json({
    status: 'success',
    data: null
  });
}
