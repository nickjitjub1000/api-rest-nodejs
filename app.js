
const Joi = require('@hapi/joi');
const { id } = require('@hapi/joi/lib/base');
const express = require ('express');
const app = express();
const logguer = require('./logger')
//const joi = require('@hapi/joi');
const morgan = require('morgan');
const config = require("config");
const inicioDebug = require('debug')('app:inicio')


const usuarios = [
    {id:1,usuario: 'Pedro'},
    {id:2,usuario: 'Paco'},
    {id:3,usuario: 'Pipo'},
]

const auto = [
    {id:1, marca:'ford', modelo:'mustang'},
    {id:2, marca:'chevrolet', modelo:'camaro'},
    {id:3, marca:'Peugeot', modelo:'308'},
    {id:4, marca:'Renault', modelo:'Clio'},
]

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


//app.use(logguer);

//app.use( function(req,res,next){
//    console.log('Autenticando...');
//   next();
//});

console.log("Aplicacion:" + config.get('nombre'));
console.log("BD server:" + config.get('ConfigDB.host'));


if(app.get('env')  === 'development')
{
    app.use(morgan('tiny'));
    inicioDebug('Morgan habilitado...');
}


app.get('/', (req,res) => {
    res.send('Hola mundo desde Express');
});

app.get('/rominita', (req,res) => {
    res.send('Hola Rominita');
});

app.get('/api/clientes', (req,res) => {
    res.send(['Roberto','Luis','Jorge']);
});

app.get('/api/clientes/:id', (req,res) => {
    res.send(req.params.id);
});

app.get('/api/clientesporquery/:id', (req,res) => {
    res.send(req.query);
});

app.get('/api/clientes2/:id', (req,res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario)
        res.status(404).send(`No se encuentra usuario con el id ${req.params.id}`);
    else res.send(usuario);

});

app.get('/api/usuarios/:id', (req,res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario)
        res.status(404).send(`No se encuentra usuario con el id ${req.params.id}`);
    if(usuario) res.send(usuario)
    //if(usuario.id = 'all') res.send(usuarios)


});

app.get('/api/usuarios/all', (req,res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario)
        res.status(404).send(`No se encuentra usuario con el id ${req.params.id}`);
    else res.send(usuario);
});

app.post('/api/usuarios', (req,res)=>{

    if(!req.body.nombre) res.status(400).send("Debe ingresar un nombre.");

    if(req.body.nombre === "all") res.send(usuarios);

    const usuario = {
        id: usuarios.length + 1,
        usuario: req.body.nombre
    }

    usuarios.push(usuario);
    res.send(usuario);
});
 

app.get('/api/autos/all', (req,res)=>{
    res.send(auto);
});

app.get('/api/autos/:id', (req,res) => {
    const automovil =   auto.find( a => a.id === parseInt(req.params.id));
    if(!automovil) res.status(400).send('No se encuentra auto con ese id.');
    else res.send(automovil);
});

app.post('/api/autos', (req,res) => {

    const schema = Joi.object({ marca: Joi.string().min(3).required()});

    const {error, value} = schema.validate( {marca: req.body.marca });
    if(!error){
        const autito = {
            id: auto.length + 1,
            marca: value.marca,
            modelo: req.body.modelo
        }
    
        auto.push(autito);
        res.send(auto); 
    }else{
        const mensaje = error.details[0].message;
        res.status(404).send(mensaje);
    }



    
}); 


app.put('/api/autos/:id', (req,res) => {

    let autito = auto.find(a => a.id === parseInt(req.params.id));
    if(!autito) {
        const error = res.status(400).send('Id de automovil no encontrado.');
        return;
    }

    autito.marca = req.body.marca;
    autito.modelo = req.body.modelo;
    res.send(autito);

});

app.delete('/api/autos/:id', (req,res) => {
    let autito = auto.find(a => a.id === parseInt(req.params.id));
    if(!autito){
        const error = res.status(400).send('El automovil no se ha encontrado.')
        return;
    }

    const Index = auto.indexOf(autito);
    //console.log(Index);
    auto.splice(Index,1);

    res.send(auto);
});


const port = 3000;

app.listen(port, ()=>{
    console.log(`Escuachando el puerto 3000 desde Localhost...`);
});


