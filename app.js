const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const cars = [
  { id: 1, make: 'Toyota', model: 'GR-86', year: 1983 },
  { id: 2, make: 'Ford', model: 'Mustang', year: 1984 },
  { id: 3, make: 'Mitsubishi', model: 'EVO', year: 1985 },
  { id: 4, make: 'Nissan', model: 'GTR', year: 1986 },
  { id: 5, make: 'Honda', model: 'Civic RS', year: 1987 },
];

app.get('/api/cars', (req, res) => {
  res.send(cars);
});

app.post('/api/cars', (req, res) => {
  const { error } = validateCar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const car = {
    id: cars.length + 1,
    name: req.body.name,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year
  };
  cars.push(car);
  res.send(car);
});

app.put('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send('Car not found.');

  const { error } = validateCar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  car.make = req.body.make;
  car.model = req.body.model;
  car.year = req.body.year;
  res.send(car);
});

app.delete('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send('Car not found.');

  const index = cars.indexOf(car);
  cars.splice(index, 1);

  res.send(car);
});

app.get('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send('Car not found.');
  res.send(car);
});

function validateCar(car) {
    const schema = Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        year: Joi.number().min(1980).max(2022).required(),
    });

    return schema.validate(car);
}

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}...`));