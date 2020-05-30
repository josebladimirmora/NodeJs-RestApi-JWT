'use strict'
const User = require('../models/user.model');
const userValidation = require('../helper/userValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

var controller = {
    home: (req, res) => {
        res.status(200).send('<h1>RestApi JwT Authentication</h1>');
    },
    register: async (req, res) => {
        // Valido el usuario
        const  validation = userValidation.registerValidation(req.body);
        if (validation.error) return res.status(400).send(validation.error.details[0].message);
        // Valido que no exista el email
        const emailExist = await User.findOne({email: req.body.email});
        if (emailExist) return res.status(400).send('El email se encuentra registrado.');
        // Encrypto la contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Creo el usuario
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        try {
            const savedUser = await user.save();
            res.status(200).send({message: 'El usuario ha sido registrado con exito', user: user._id});
        } catch (err) {
            res.status(400).send(err);
        }    
    },
    login: async (req, res) => {
        // Valido el usuario
        const  validation = userValidation.loginValidation(req.body);
        if (validation.error) return res.status(400).send(validation.error.details[0].message);
        // Valido que existe el email
        const userByEmail = await User.findOne({email: req.body.email});
        if (!userByEmail) return res.status(400).send('El email o la contraseña es incorrecta.');
        // Valido la contraseña
        const validPass = await bcrypt.compare(req.body.password, userByEmail.password);
        if (!validPass) return res.status(400).send('El email o la contraseña es incorrecta.');
        // Creo y asigno el token
        const token = jwt.sign({user: userByEmail}, process.env.TOKEN_SECRET);
        return res.status(200).header('Authorization', token).send(token);
    },
    updateUser: async (req, res) => {
        let id = req.params.id;
        // Valido el usuario
        const  validation = userValidation.registerValidation(req.body);
        if (validation.error) return res.status(400).send(validation.error.details[0].message);
        // Encrypto la contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Creo el usuario
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };
        User.findByIdAndUpdate(id, user, {new:true}, (err, userUpdated) => {
            if(err) return res.status(500).send({message:'No se ha podido actualizar el usuario'});
            if(!userUpdated) return res.status(404).send({message: 'No hay usuarios con este id'});

            return res.status(200).send({message:'El usuario fue actualizado.',user: userUpdated});
        });
    },
    getUserById: (req, res) => {
        let id = req.params.id
        User.findById(id, (err, userById) => {
            if(err) return res.status(500).send({message: 'Error al obtener el usuario'});
            if(!userById) return res.status(404).send({message: 'El usuario no existe'});

            return res.status(200).send(userById);
        });
    },
    getAllUsers: (req, res) => {
        User.find({}).exec((err, users) => {
           if(err) return res.status(500).send({message: 'Error al obtener los datos'});
           if(users.length < 1) return res.status(404).send({message: 'No hay usuarios'});
           
           return res.status(200).send(users);
       });   
    },
    deleteUser: (req, res) => {
        let id = req.params.id;
        User.findByIdAndDelete(id, (err, userDeleted) => {
            if(err) return res.status(500).send({message: 'Usuario no eliminado'});
            if(!userDeleted) return res.status(404).send({message: 'No se pudo eliminar el usuario'});

            return res.status(200).send({message: 'Usuario eliminado', userDeleted});
        })
    }
}

module.exports = controller;