const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/todolistDB')

const itemSchema = {
  name: String
}

const Item = mongoose.model('Item', itemSchema)

const item1 = new Item({
  name : 'Welcome to your todolist!'
})

const item2 = new Item({
  name : 'Hit the + button to add a new task'
})

const item3 = new Item({
  name : '<-- Hit this to cross out an item'
})

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {

  Item.find((err, items) => {

    if(items.length === 0){
      Item.insertMany(defaultItems, err =>{
        if(err){
          console.log(err)
        } else {
          console.log('All documents have been added.');
        }
      })
      res.redirect('/')
    } else {
      res.render('list', {
        listTitle: 'Today',
        newListItems: items
      });
    }

  })

});

app.post('/', (req, res) => {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })
  item.save()
  res.redirect('/')

  // if (req.body.list == 'Work'){
  //   workItems.push(item)
  //   res.redirect('/work')
  // } else {
  //   items.push(item);
  // }

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