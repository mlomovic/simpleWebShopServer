const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


let storage = multer.diskStorage({
    destination: 'public/img/',
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

let upload = multer({
    storage: storage
});


const app = express();


// const proizvodi = [];

const proizvodi = [{
        id: 0,
        name: 'Boots',
        price: 120,
        img: '/img/boots.jpg',
        desc: 'Neki opis cizama',
        category: 'boots, man',
        qty: 3
    },
    {
        id: 1,
        name: 'Gloves',
        price: 30,
        img: '/img/gloves.jpg',
        desc: 'Neki opis rukavica',
        category: 'rukavice, man',
        qty: 8
    },
    {
        id: 2,
        name: 'Jackets',
        price: 200,
        img: '/img/jackets.jpg',
        desc: 'Neki opis JAkne',
        category: 'jacket, man',
        qty: 4
    }
];


app.use(cors());

// Parsing and decoding middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());



app.get('/', (req, res) => {
    // res.send('proba 123');
    res.json(proizvodi);
});


app.get('/:id', (req, res) => {
    let id = req.params.id;
    // console.log(`Serviraj proizvod sa id = ${id}`);

    let proizvod = proizvodi.filter((p) => {
        if (p.id === Number(id)) {
            console.log(p);
            return p;
        } else {
            return null;
        };
    });

    res.json(proizvod);

});


app.post('/add', upload.single('img'), (req, res) => {
    // console.log(req.body);
    // console.log(req.file);

    newId = proizvodi.length != 0 ? proizvodi[proizvodi.length - 1].id + 1 : 0;

    // let proizvod = req.file;
    let proizvod = {
        id: newId,
        name: req.body.name,
        price: Number(req.body.price),
        img: `/img/${req.file.originalname}`,
        desc: req.body.desc,
        category: req.body.category,
        qty: Number(req.body.qty)
    };

    // console.log(proizvod);

    proizvodi.push(proizvod);

    // res.json(proizvod);
    res.redirect('http://localhost:5500/client/manage.html');

});


app.put('/edit/:id', (req, res) => {
    let id = req.params.id;
console.log('****************');
    console.log(req.body);
    console.log('****************');
    
    let proizvod = {};

    proizvodi.forEach((p, idx) => {
        if (p.id === Number(id)) {
            proizvod.name = req.body.name;
            proizvod.price = Number(req.price);
            proizvod.desc = req.body.desc;
            proizvod.category = req.body.category;
            proizvod.qty = Number(req.body.qty);

            proizvodi[idx].name = req.body.name;
            proizvodi[idx].price = Number(req.body.price);
            proizvodi[idx].desc = req.body.desc;
            proizvodi[idx].category = req.body.category;
            proizvodi[idx].qty = Number(req.body.qty);


        }
    });

    res.json({
        id,
        name: req.body.name,
        price: Number(req.body.price),
        desc: req.body.desc,
        category: req.body.category,
        qty: Number(req.body.qty),
    });
})


app.delete('/delete/:id', (req, res) => {

    // let pro = proizvodi.find(element => {
    //     element.id == req.params.id;
    // });
    try{
    fs.unlink(`public/${proizvodi[req.params.id].img}`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        // console.log('File deleted!');
        res.json(proizvodi.splice(req.params.id, 1));
    });
    }catch(err){
        console.log(err);
    }
})





app.listen(3000, () => {
    console.log('Sever is listening on port 3000...');
});