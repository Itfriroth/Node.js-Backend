const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');

//obtener las categorias por listas
router.get(`/`,async (req,res)=>{
    const categorylist = await Category.find();
     if(!categorylist){
         res.status(500).json({success:false});
     }
    res.status(200).send(categorylist);
})

//actualizar las categorias por id

router.put(`/:id`,async(req,res)=>{
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
        }
         );
         if(!category)
         return res.status(404).send('La categoria no pudo ser creada')
     
         res.send(category);
})

//buscar las categorias por id
router.get(`/:id`,async(req,res)=>{
    const category = await Category.findById(req.params.id);
     if(!category){
         res.status(500).json({message:'La categoria con el ID dado no ha sido encontrada'});
     }
    res.status(200).send(category);
})

//crear las categorias
router.post('/', async (req,res)=>{
    let category=new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
    })
    category = await category.save();

    if(!category)
    return res.status(404).send('La categoria no pudo ser creada')

    res.send(category);
})

//eliminar categorias
router.delete('/:id', (req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category){
            return res.status(200).json({success:true, message:'La categoria a sido eliminada'})
        }else{//sino se consigue la categoria
            return res.status(404).json({success:false, message:'La categoria no fue encontrada'})
        }
    }).catch(err=>{//si aparece otro error inesperdao
        return res.status(400).json({success:false,error:err})
    })
})

module.exports = router;