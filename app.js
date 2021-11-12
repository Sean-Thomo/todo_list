const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

// const items =[];
// const workItems =[];

mongoose.connect('mongodb://localhost:27017/todolistDB')

const itemSchema = {
  name: String
}

const Item = mongoose.model('Item', itemSchema)

const testing = new Item({
  name : 'Run tests'
})

const code = new Item({
  name : 'Code for an hour'
})

const exercise = new Item({
  name : 'Jog for 30 mins'
})

const defaultItems = [testing, code, exercise];

Item.insertMany(defaultItems, err =>{
  if(err){
    console.log(err)
  } else {
    console.log('All documents have been added.');
  }
})

app.get("/", (req, res) => {

  res.render('list', {
    listTitle: 'Today',
    newListItems: items
  });

});

app.post('/', (req, res) => {
  item = req.body.newItem;

  if (req.body.list == 'Work'){
    workItems.push(item)
    res.redirect('/work')
  } else {
    items.push(item);
    res.redirect('/')
  }

});

app.get('/work', (req, res) => {
  res.render('list', {
    listTitle: 'Work List',
    newListItems: workItems
  })
})

app.post('/work', (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work')
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
})