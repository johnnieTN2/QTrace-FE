// server.js
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/items/`);
    res.render('index', { items: response.data });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.render('index', { items: [] });
  }
});

app.get('/items/new', (req, res) => {
  res.render('item-form', { item: null, action: 'create' });
});

app.get('/items/:id/edit', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/items/${req.params.id}`);
    res.render('item-form', { item: response.data, action: 'edit' });
  } catch (error) {
    console.error('Error fetching item:', error.message);
    res.redirect('/');
  }
});

app.post('/items', async (req, res) => {
  try {
    await axios.post(`${FASTAPI_URL}/items/`, req.body);
    res.redirect('/');
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.redirect('/items/new');
  }
});

app.post('/items/:id', async (req, res) => {
  try {
    await axios.put(`${FASTAPI_URL}/items/${req.params.id}`, req.body);
    res.redirect('/');
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.redirect(`/items/${req.params.id}/edit`);
  }
});

app.post('/items/:id/delete', async (req, res) => {
  try {
    await axios.delete(`${FASTAPI_URL}/items/${req.params.id}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
  console.log(`Connecting to FastAPI at ${FASTAPI_URL}`);
});