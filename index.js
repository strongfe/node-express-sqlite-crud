const express = require('express');
const app = express();
const ejs = require('ejs');

// let comments = [];
const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
// console.log(comments === sequelize.models.comments); // true

(async() => {
await Comments.sync();
console.log("All models were synchronized successfully.");
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set EJS as the view engine
app.set('view engine', 'ejs');

// read
app.get('/', async function(req, res) {
  const comments = await Comments.findAll();

  res.render('index', { comments:comments });
});

// create
app.post('/create', async function(req, res) {
  console.log(req.body)

  const {content} = req.body

  // Create a new user
  await Comments.create({ content: content });

  res.redirect('/')
});

// update
app.post('/update/:id', async function(req, res) {
  console.log(req.params)
  console.log(req.body)

  const {content} = req.body
  const {id} = req.params
  // Change content where id = id
  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });


  res.redirect('/')
});

// delete
app.post('/delete/:id', async function(req, res) {
  console.log(req.params)

  const {id} = req.params

  await Comments.destroy({
    where: {
      id: id
    }
  });



  res.redirect('/')
});



// Start the server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});
