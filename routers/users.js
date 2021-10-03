const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const bcrypt =require('bcryptjs');//la libreria que encripta
const jwt = require('jsonwebtoken');//la que da el token


router.get(`/`,async (req,res)=>{
    const userlist = await User.find().select('-passwordHash');
     if(!userlist){
         res.status(500).json({success:false});
     }
    res.send(userlist);
})

router.get(`/:id`,async (req,res)=>{
    const product = await Product.findById(req.params.id).select('-passwordHash');

     if(!product){
         res.status(500).json({success:false});
     }
    res.send(product);
})
router.post(`/`,async(req,res)=>{
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
    })//guardamos en la bd
    user= await user.save();
    if(!user)
    return res.status(500).send('El usuario no pudo ser creado')
    res.send(user);
});

router.post('/login', async(req,res)=>{
    const user = await User.findOne({email: req.body.email})
    const secret =process.env.secret;
    if(!user){
        return res.status(400).send('El usuario no pudo ser encontrado');
    }
    //comparacion de las claves ya encriptadas
    if(user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)){
        const token =jwt.sign({
            userId: user.id,
            isAdmin:user.isAdmin
        },secret,//clave secreta para el token
            {expiresIn:'1d'} //duracion del token
        )
        res.status(200).send({use:user.email,token:token});
    }else{
        res.status(400).send('Password Equivocado');
    }
})

module.exports = router;