const express = require('express');
const userController = require('./controllers/userController');

const app = express();
app.use(express.json());

app.post('/api/users', userController.createUser);
app.get('/api/users/:id', userController.getUser);
app.put('/api/users/:id', userController.updateUser);
module.exports = app;