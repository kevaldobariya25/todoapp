const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const json2csv = require('json2csv').parse;
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port= 3000;

const upload = multer({ dest: 'uploads/' });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const TodoSchema = new mongoose.Schema({
  description: String,
  status: String,
});

const Todo = mongoose.model('Todo', TodoSchema);

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Cannot find todo' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({
    description: req.body.description,
    status: 'pending',
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Cannot find todo' });
    }

    if (req.body.description != null) {
      todo.description = req.body.description;
    }
    if (req.body.status != null) {
      todo.status = req.body.status;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Cannot find todo' });
    }

    await todo.remove();
    res.json({ message: 'Deleted Todo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/todos/upload', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Todo.insertMany(results);
        res.status(201).json({ message: 'CSV data imported successfully' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      } finally {
        fs.unlinkSync(req.file.path);
      }
    });
});

app.get('/todos/download', async (req, res) => {
  try {
    const todos = await Todo.find();
    const csv = json2csv(todos, { fields: ['description', 'status'] });
    res.header('Content-Type', 'text/csv');
    res.attachment('todos.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
