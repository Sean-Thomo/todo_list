const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemSchema = {
  name: String
};

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
  name : 'Welcome to your todolist!'
});

const item2 = new Item({
  name : 'Hit the + button to add a new task'
});

const item3 = new Item({
  name : '<-- Hit this to cross out an item'
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model('List', listSchema)

app.get('/:listName', (req, res) =>{
  const listName = req.params.listName;

  List.findOne({name: listName}, (err, foundList) => {
    if(!err){
      if(!foundList){
        const list = new List({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect(`/${listName}`)
      } else {
        res.render('list', {
          listTitle: foundList.name,
          newListItems:foundList.items
        })
      }
    }
  });
})

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
  });

});

app.post('/', (req, res) => {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === 'Today'){
    item.save();
    res.redirect('/');
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      if(!err){
        foundList.items.push(item);
        foundList.save();
        res.redirect(`/${listName}`);
      } else {
        console.log(err);
      }
    });
  }

});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === 'Today'){
    Item.findByIdAndRemove(checkedItemId, err =>{
      if (!err){
        console.log('Deleted Item');
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) =>{
      if(!err){
        res.redirect(`/${listName}`);
      }
    });
  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});