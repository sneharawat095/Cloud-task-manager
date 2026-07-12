require('dotenv').config();
const express = require('express');
const nano = require('nano');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// IBM Cloudant se connect
// cloudant = nano(process.env.CLOUDANT_URL);
//const nano = require('nano')(process.env.COUCH_URL);
//const db = nano.db.use(process.env.DB_NAME);//
//cloudant.db.create(dbName).catch(() => {});
//const db = cloudant.db.use(dbName);//

// CREATE
app.post('/tasks', async (req, res) => {
  const task = { _id: uuidv4(), ...req.body, createdAt: new Date() };
  const result = await db.insert(task);
  res.json(result);
});

// READ
app.get('/tasks', async (req, res) => {
  const result = await db.list({ include_docs: true });
  res.json(result.rows.map(row => row.doc));
});

// UPDATE
app.put('/tasks/:id', async (req, res) => {
  const doc = await db.get(req.params.id);
  const updated = { ...doc, ...req.body };
  const result = await db.insert(updated);
  res.json(result);
});

// DELETE
app.delete('/tasks/:id', async (req, res) => {
  const doc = await db.get(req.params.id);
  const result = await db.destroy(req.params.id, doc._rev);
  res.json(result);
});

app.get('/', (req, res) => res.send('Task Manager API Running'));
app.listen(3000, () => console.log("Server 3000 pe chal raha hai"));