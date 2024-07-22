const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Handle connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String
});

// Define Model
const Student = mongoose.model('Student', studentSchema);

// Routes
app.post('/api/students', (req, res) => {
  const newStudent = new Student({
    name: req.body.name,
    age: req.body.age,
    grade: req.body.grade
  });

  newStudent.save()
    .then(() => {
      console.log('Student saved successfully');
      res.status(201).send('Student successfully added');
    })
    .catch(err => {
      console.error('Error saving student:', err);
      res.status(500).send(err);
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
