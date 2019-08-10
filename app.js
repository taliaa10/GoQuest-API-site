const fs = require('fs');
const express = require('express');
const app = express();
const port = 4000;

// Use json() to get the body info
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'GoQuest' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to the URL!');
// });

// Parse then read JSON file in the given path
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Get the data in the JSON file and create a new JSON
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
});

// Get specific tours by their id
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// Handling tours post requests
app.post('/api/v1/tours', (req, res) => {
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
});

app.listen(port, () => {
  console.log(`GoQuest API app running on ${port}`);
});
