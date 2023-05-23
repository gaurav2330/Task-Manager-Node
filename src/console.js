const repl = require('repl')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')

const Task = require('./models/task.js')
const User = require('./models/user.js')


const options = { useColors: true };

const firstInstance = repl.start(options);


firstInstance.context.Task = Task;
firstInstance.context.User = User;
