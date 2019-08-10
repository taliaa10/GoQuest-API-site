const fs = require('fs');
const express = require('express');
const app = express();
const port = 4000;

// Use json() to get the body info
app.use(express.json());

// Parse then read JSON file in the given path
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Get the data in the JSON file and create a new JSON
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = parseInt(req.params.id);
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(updateTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log(`GoQuest API app running on ${port}`);
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
