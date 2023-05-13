const express = require('express');
const router = express.Router();
const path = require("path")
const mongoose = require("mongoose")
const Product = require("../models/Product")
const moment = require("moment") 
const multer = require("multer")

// ==== MULTER STORAGE ==== //
const upload = {
  storage: multer.diskStorage({
    destination: function (req, file, next) {
      next(null, './public/images/upload');
    },
    filename: function (req, file, next) {
      next(null, Date.now() + path.extname(file.originalname))
    },

  })

};


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/profile', function(req, res, next) {
  const user = req.user;
  Product.find({AuthorID:user.id})
  .then(data => {
    res.render('Profile', {user,Products:data});
  })
  .catch(err => {
    console.log(err)
  })
});


/* POST users listing. */
router.post('/AddArt', multer(upload).single('File'), function(req, res, next) {
  const {NameProd,DescrProd} = req.body;
  if(req.file == undefined || req.file == null){
    const Products = new Product({
      Image:null,
      Subject:NameProd,
      Description:DescrProd,
      Author:req.user.Name,
      AuthorID:req.user.id,
      DateOfAddition:moment().format('DD.MM.YYYY')
    })
  
    Products.save()
    .then(data => {
      console.log(data)
      res.redirect("/users/profile")
    })
    .catch(err => {
      console.log(err)
      res.json("Пожалуйста, заполните все поля")
    })
  }else{
    let line = "/images/upload/" + req.file.filename;
    const Products = new Product({
      Image:line,
      Subject:NameProd,
      Description:DescrProd,
      Author:req.user.Name,
      AuthorID:req.user.id,
      DateOfAddition:moment().format('DD.MM.YYYY')
    })

    Products.save()
    .then(data => {
      console.log(data)
      res.redirect("/users/profile")
    })
    .catch(err => {
      console.log(err)
    })
  }
  

});


/* PUT users listing. */
router.put('/EditArt/:id/:NameProd/:DescrProd', multer(upload).single('File'), function(req, res, next) {
  const {id,NameProd,DescrProd} = req.params;
  console.log(req.file)
  if(req.file == undefined || req.file == null){
    const FormData = {
      Subject:NameProd,
      Description:DescrProd
    }
    Product.findByIdAndUpdate(id,FormData)
    .then(data => {
      console.log(data)
      res.json(data)
    })
    .catch(err => {
      console.log(err)
    })
  }else{
    let line = "/images/upload/" + req.file.filename;
    const FormData = {
      Image:line,
      Subject:NameProd,
      Description:DescrProd
    }
    Product.findByIdAndUpdate(id,FormData)
    .then(data => {
      console.log(data)
      res.json(data)
    })
    .catch(err => {
      console.log(err)
    })
  }
  

});



/* DELETE users listing. */
router.delete('/DeleteArt/:id', function(req, res, next) {
  const {id} = req.params;
  
  Product.findByIdAndDelete(id)
  .then(data => {
    res.json(data)
  })
  .catch(err => {
    res.json(err)
  })

});

module.exports = router;
