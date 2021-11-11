const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

let items =[];
let workItems =[];

app.get("/", (req, res) => {

  const today = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  let day = today.toLocaleDateString('en-US', options);

  res.render('list', {
    listTitle: day,
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