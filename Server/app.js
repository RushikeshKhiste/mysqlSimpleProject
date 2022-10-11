const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const dbservices = require('./dbServices');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//create
app.post('/insert',(req,res)=>{
    // console.log(req.body);
    const {name} = req.body;
    const db = dbservices.createDbInstance();
    const result = db.insertData(name);
    result
    .then(data => res.json({data:data}))
    .catch(err => console.log(err));

});

//display
app.get('/getAll',(req,res)=>{
    const db = dbservices.createDbInstance();
    const result = db.getAllData();
    result
    .then(data => res.json({data: data}))
    .catch(err => console.log(err));
})
//update
app.put('/update', (req,res)=>{
    const {name ,id} = req.body;
    const db = dbservices.createDbInstance();
    const result = db.updateName(id,name);
    result
    .then(data => res.json({success: data}))
    .catch(err => console.log(err));

})

//delete
app.delete('/delete/:id', (req,res) => {
    const {id} = req.params;
    // console.log(id);
    const db = dbservices.createDbInstance();
    const result = db.deleteElement(id);
    result
    .then(data => res.json({success:data}))
    .catch(err => console.log(err));

})

// search
app.get('/search/:name' ,(req,res)=>{
    const {name} = req.params;
    const db = dbservices.createDbInstance();
    const result = db.searchName(name);
    result
    .then(data => res.json({data:data}))
    .catch(err => console.log(err));

})

app.listen(process.env.port,()=> console.log('app is running'));