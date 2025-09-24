const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

var mysql = require('mysql');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    next();
});
app.use(express.json());

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
  });
con.connect(function(err) {
    if (err) throw err;
});

app.get('/api/products',function(req,res){
        con.query("SELECT * FROM product", function (err, result, fields) {
            if (err) throw res.status(400).send('Not found any books');
            console.log(result);
            res.send(result);
          });
});

app.get('/api/products/:id',function(req,res){
    const id = req.params.id;
    //const product = products.find(item=>item.id===id);
    con.query(`SELECT * FROM product where id='${id}'`, function (err, result, fields) {
        if (err) throw err;
        let product=result;
        if(product.length>0){
            res.send(product);
        }else{
            res.status(400).send('Book not foud for'+id);
        }
        console.log(result);
      });
   
});

app.delete('/api/products/:id',function(req,res){
    const id = req.params.id;
    console.log("id to delete",id);
    con.query(`DELETE FROM product where id="${id}";`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        con.query("SELECT * FROM product", function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            console.log(result);
          });
        
      });
});

app.post('/api/products',function(req,res){
    const name=req.body.name;
    const price=req.body.price; 
    const author=req.body.author; 
    const image_url=req.body.image_url;

        var sql = `INSERT INTO product (id,name, price,author,image_url) VALUES (UUID(),'${name}', '${price}', '${author}','${image_url}')`;
        con.query(sql, function (err, result) {
        if (err) throw res.status(400).send('Error cannot add a book');
        console.log("1 record inserted");
        con.query("SELECT * FROM product", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
        });
});

app.put('/api/products/:id',function(req,res){
    const id = req.params.id;
    const name=req.body.name;
    const price=req.body.price;
    var sql = `UPDATE product SET name = '${name}', price='${price}' WHERE id = '${id}'`;
    console.log(sql);
    con.query(sql, function (err, result) {
    if (err) throw res.status(400).send('Error cannot update a book');
        con.query("SELECT * FROM product", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    });
});

const port = process.env.port || 3001;
app.listen(port,function(){
    console.log('Listening on port',port);
})
