const express = require('express');
const { mongo } = require('mongoose');
const { Category } = require('../models/category');
const router = express.Router();
const {Product} = require('../models/product');
const mongoose = require('mongoose');

//obtenemos una lista de los productos
router.get(`/`,async (req,res)=>{
    const productlist = await Product.find();//asi obtenemos en forma de lista
   // const productlist = await Product.find().select('name image -id'); asi obtenemos solo el nombrey la imagen pero sin el id 
    if(!productlist){
         res.status(500).json({success:false});
     }
    res.send(productlist);
})

//filtramos por categoria
router.get(`/`,async (req,res)=>{
    let filter={};
    if(req.query.categorys){
                filter={category:req.query.categorys.split(',')}
    }
    const productlist = await Product.find(filter).populate('category');
    if(!productlist){
         res.status(500).json({success:false});
     }
    res.send(productlist);
})
//obtenemos los productos por id
router.get(`/:id`,async (req,res)=>{
    const product = await Product.findById(req.params.id);

     if(!product){
         res.status(500).json({success:false});
     }
    res.send(product);
})

router.post(`/`,async(req,res)=>{
    const category =await Category.findById(req.body.category);//validamos si existe la categoria
    if(!category) return res.status(400).send('Categoria Invalida');

    const product = new Product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,
    })//guardamos en la bd
    product= await product.save();
    if(!product)
    return res.status(500).send('El producto no ha podido ser creado')
    res.send(product);
})

//actualizamos productos

router.put(`/:id`,async(req,res)=>{
    if(mongoose.isValidObjectId(req.params.id)){//se valida el id por bd
        res.status(400).send('Inbvalid Product Id')
    }
    const category =await Category.findById(req.body,category);//validamos si existe la categoria
    if(!category) return res.status(400).send('Categoria Invalida');

    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            name:req.body.name,
            description:req.body.description,
            richDescription:req.body.richDescription,
            image:req.body.image,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured,
        }
         );
         if(!product)
         return res.status(500).send('El producto no pudo ser actualizado')
     
         res.send(product);
})
//eliminar productos
router.delete('/:id', (req,res)=>{
    Products.findByIdAndRemove(req.params.id).then(products =>{
        if(products){
            return res.status(200).json({success:true, message:'El producto a sido eliminado'})
        }else{//sino se consigue el producto
            return res.status(404).json({success:false, message:'El producto no fue encontrado'})
        }
    }).catch(err=>{//si aparece otro error inesperdao
        return res.status(400).json({success:false,error:err})
    })
})

//cpntar los productos
router.get(`/get/count`,async (req,res)=>{
    const productCount = await Product.countDocuments((count)=> count);

     if(!productCount){
         res.status(500).json({success:false});
     }
    res.send({productCount:productCount});
})

//los productos destacados
router.get(`/get/featured`,async (req,res)=>{
    const products = await Product.find({isFeatured:true
    });

     if(!products){
         res.status(500).json({success:false});
     }
    res.send(products);
})


module.exports = router;