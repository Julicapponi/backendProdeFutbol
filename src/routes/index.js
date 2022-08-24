const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const Competition = require('../models/Competition');
const Result = require('../models/Results');
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
router.get('/', (req, res) => {
    res.send('API HERE')
});


router.post('/signup', async (req, res) => {
    const { name, userName, email, password, admin } = req.body;
    const newUser = new User({name, userName, email, password, admin});
    await newUser.save();
		const token = await jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token});
});

//Login de usuarios
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if (!user || user.password !== password) return res.status(401).send('Usuario o contraseña incorrecta');

		const token = jwt.sign({_id: user._id}, 'secretkey');  

    return res.status(200).json({token, user});
});

//Lista de todos los usuarios
router.get('/listUsers', async (req, res) => {
    await User.find((err, users) => {
        err && res.send(500).send(err.message);

        res.status(200).json(users)
    })
});

router.get('/getUser/:id', async (req, res) => {
     try {
        const id = req.params.id;
        console.log('Usuario con id: ' +id);
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(404).json({ msg: `No User with id :${id}` 
        });
        const user = await User.findOne({ _id: id });
        res.status(200).json(user);
       } catch (error) {
        console.log(error);
       }
});

//Login de usuarios
router.put('/changePass', async (req, res) => {
    const { email, userName, passNewChange } = req.body;
    const nameUser = await User.findOne({userName});
    const user = await User.findOne({email});
    if (!user && !nameUser) return res.status(401).send('Usuario o contraseña incorrecto!');

		const newPassword = User.updateOne({password:user.password},{$set: {passNewChange}})
        .then((data) => res.json(newPassword))
        .catch((error)=> res.json({message:error}));
});

router.post('/editUser/:id', async (req, res) => {
    //Capto el id de la url
    const {id} = req.params;
    console.log('este es el id a editar:' +{id});
    //Datos json que llegan desde el front
    const {name, userName, email, password, admin} = req.body;
    console.log(name);
    console.log(userName);
    if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(404).json({ msg: `No User with id :${id}` 
        });
    //actualizar si el id del parametro y el id de la BD (_id) son iguales, setear cambios y devuelve el dato
    User.updateOne({_id: id},{$set: {name, userName, email, password, admin}})
    .then((data) => res.json(data))
    .catch((error)=> res.json({message:error}));
});

//Editar un usuario
/*
router.put('/editUser/:id', async (req, res, next) => {
    console.log(req.params.id);
    const { name, email, password, admin} = req.body;
    let user = await User.findById(req.params.id);

    if(!user){
        res.status(404).json({message: 'no existe el usuario'});
    }
    user.name =  name;
    user.email =  email;
    user.password =  password;
    user.admin =  admin;
    
    user = await User.findOneAndUpdate({_id: req.params.id},user, {new: true})
    res.json(user);
});
*/

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id: id } = req.params;
        console.log(id);
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(404).json({ msg: `No User with id :${id}` 
        });
        const user = await User.findOneAndDelete({ _id: id });
        res.status(200).json(user);
       } catch (error) {
        console.log(error);
       }
});

router.get('/football', async (req, res) => {
    fetch("https://api-football-beta.p.rapidapi.com/timezone", {
            headers: {
                method: 'GET',
                'X-RapidAPI-Host': 'api-football-beta.p.rapidapi.com',
                'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
            },
        }).then(data => res.status(200).json(data))
        .then(data => console.log(data))
        .catch(err => console.error(err));
    });

    router.post('/football/leagues', async (req, res) => {
        fetch("https://api-football-beta.p.rapidapi.com/leagues", {
                
                headers: {
                    method: 'POST',
                    params: {id: '1'},
                    'X-RapidAPI-Host': 'api-football-beta.p.rapidapi.com',
                    'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
                },
            }).then(data => res.json(data))
            .then(data => console.log(data))
            .catch(err => console.error(err));
        });

        router.get('/football/league/england', async (req, res) => {
            fetch("https://api-football-v1.p.rapidapi.com/v3/leagues?country=Argentina", {
                    headers: {
                        method: 'GET',
                        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                        'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
                    },
                }).then(response => response.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));
            });
        
router.get('/football/leagues/seasonss', async (req, res) => {
        fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures?league=1&season=2022", {
                headers: {
                    method: 'GET',
                    'X-RapidAPI-Host': 'api-football-beta.p.rapidapi.com',
                    'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
                },
            }).then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));
        });

router.get('/footballWorldCup', async (req, res) => {
    const url = "https://api-football-v1.p.rapidapi.com/v3/fixtures?league=1&season=2022";
    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'football-pro.p.rapidapi.com',
        'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
    }
    };
    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
});

router.get('/football/fecha', async (req, res) => {
    const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2021-04-07';
    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
    }
    };

    fetch(url, options)
	.then(res => res.json())
	.then(json => console.log(json))
	.catch(err => console.error('error:' + err));
});

router.get('/obtener/league/england', async (req, res) => {
    const url = 'https://api-football-v1.p.rapidapi.com/v3/leagues?country=England';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
            'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
        },
      };
      fetch(url, options).then((respuesta) => {
          return respuesta.json()}).then((data) => res.json(data))
          .catch((error)=> res.json({message:error}));
    });

    router.get('/obtener/league/england', async (req, res) => {
        const url = 'https://api-football-v1.p.rapidapi.com/v3/leagues?country=England';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
            },
          };
          fetch(url, options).then((respuesta) => {
              return respuesta.json()}).then((data) => res.json(data))
              .catch((error)=> res.json({message:error}));
        });

        router.get('/obtener/partidos/libertadores', async (req, res) => {
            const idCompetition = '13';
            const anioCompetition = '2022';
            const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league='+idCompetition+'&season='+anioCompetition;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                    'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
                },
              };
              fetch(url, options).then((respuesta) => {
                  return respuesta.json()}).then((data) => res.json(data))
                  .catch((error)=> res.json({message:error}));
            });   
    
            router.get('/obtener/enfrentamientos/:id/:anio', async (req, res) => {
                const { id: id } = req.params;
                const { anio: anio } = req.params;
                console.log('Competencia seleccionada: ' +id + 'y el anio' + anio);
                const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league='+id+'&season='+anio;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                        'X-RapidAPI-Key': '71aabd654amsh246d1bc92892422p1dcdedjsnb909789c53e7'
                    },
                  };
                  fetch(url, options).then((respuesta) => {
                      return respuesta.json()}).then((data) => res.json(data))
                      .catch((error)=> res.json({message:error}));
                });   

                router.post('/crearCompeticion', async (req, res) => {
                    const id = "2";
                    const name = "prueba";
                    const flag = "prueba"
                    const activa = false;
                    const date = new Date();
                    let anio = String(date.getFullYear());
                    console.log(id,name,flag,activa);
                    const newCompetition = new Competition({ id, name, flag, anio, activa});
                    await newCompetition.save();
                    res.status(200).json(newCompetition)
                });

                router.get('/listCompetitions', async (req, res) => {
                    await Competition.find((err, competitions) => {
                        err && res.send(500).send(err.message);
                        res.status(200).json(competitions)
                    })
                });
                
                router.get('/listCompetitionsActivates', async (req, res) => {
                    
                    await Competition.find((err, competitions) => {
                        err && res.send(500).send(err.message);
                        res.status(200).json(competitions)
                    })
                });

                router.post('/editStateCompetition/:id', async (req, res) => {
                    //Capto el id de la url
                    const {id} = req.params;
                    console.log('este es el id a editar:' +{id});
                    //Datos json que llegan desde el front
                    const {activa} = req.body;
                    console.log('Competicion activada?: ', activa);
                    if (!mongoose.Types.ObjectId.isValid(id)) 
                            return res.status(404).json({ msg: `No Competition with id :${id}` 
                        });
                        console.log('este es el id:' +{id});
                    //actualizar si el id del parametro y el id de la BD (_id) son iguales, setear cambios y devuelve el dato
                    Competition.updateOne({_id: id},{$set: {activa}})
                    .then((data) => res.json(data))
                    .catch((error)=> res.json({message:error}));
                });

router.post('/altaResultado', async (req, res) => {
    const {userId, userName, email, idPartido, ganaLocal, ganaVisitante, golLocal, golVisitante} = req.body;
    const newResult = new Result({userId, userName, email, idPartido, ganaLocal, ganaVisitante, golLocal, golVisitante});
    await newResult.save();
    res.status(200).json({token});
});
               
module.exports = router;
