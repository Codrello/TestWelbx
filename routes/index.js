const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/Users")
const Product = require("../models/Product")
const moment = require("moment")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const CONFIG = require("../config")

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({})
  .sort({
    Author:1
  })
  .then(Products => {
    console.log(Products.length)
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, CONFIG.SECRET_KEY, (err,decode) => {
            if(err){
                res.json(err);
            }
            else{
                // console.log(req.decoded);
                req.decoded = decode
                console.log(req.decoded);

                
                User.findOne({Login: req.decoded})
                .then(user => {
                  req.user = user;
                  const users = req.user
                  res.render('index', { title: 'Express',users,Products});
                })
                .catch(err => {
                  res.json(err);
                })
            }
        })
    }else{
      res.render('index', { title: 'Express',Products});
    }
  })
  .catch(err => {
    res.json(err)
  })
  
});
router.get('/Skip/:num', function(req, res, next) {
  console.log(req.params.num)
  Product.find({})
  .sort({
    Author:1
  })
  .skip(req.params.num)
  .then(Products => {
    console.log(Products.length)
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, CONFIG.SECRET_KEY, (err,decode) => {
            if(err){
                res.json(err);
            }
            else{
                // console.log(req.decoded);
                req.decoded = decode
                console.log(req.decoded);

                
                User.findOne({Login: req.decoded})
                .then(user => {
                  req.user = user;
                  const users = req.user
                  res.render('index', { title: 'Express',users,Products});
                })
                .catch(err => {
                  res.json(err);
                })
            }
        })
    }else{
      res.render('index', { title: 'Express',Products});
    }
  })
  .catch(err => {
    res.json(err)
  })
  
});

router.get('/Reg', function(req, res, next) {
  res.render('Register');
});
router.get('/Log', function(req, res, next) {
  res.render('Login');
});
router.get('/logout', function(req, res, next) {
  
  res.clearCookie("token")
  res.redirect("/")

});

/* POST home page. */
router.post('/Reg', function(req, res, next) {
  console.log(req.body)
  const Password = req.body.password;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(Password, salt, function(err, hash) {
      if(err){
        res.render("Register",{err:{message:err, code:500}})
      }else{

        const Avatars = [
          "/images/avatars/bear.png",
          "/images/avatars/cat.png",
          "/images/avatars/dog.png",
          "/images/avatars/lion.png",
          "/images/avatars/monkey.png",
          "/images/avatars/penguin.png",
          "/images/avatars/tiger.png",
          "/images/avatars/wolf.png"
        ]
        const rand = Math.floor(Math.random() * Avatars.length);
        console.log(rand)
        const Users = new User({
          Name:req.body.username,
          Email:req.body.Email,
          Login:req.body.Login,
          Password:hash,
          Gander:req.body.gander,
          Avatar:Avatars[rand],
          DateReg:moment().format("DD.MM.YYYY")
        })

        Users.save()
        .then(data => {
          console.log(data)
          res.redirect("/Log")
        })
        .catch(err => {
          console.log(err)
          // console.log(err.errors)
          res.render("Register",{err})
        })

      }
      
    });
  });

});

router.post('/Log', function(req, res, next) {
  console.log(req.body.Login)
  const Password = req.body.password;
  User.findOne({Login:req.body.Login})
  .then(user => {
    console.log(user)
    if(user == null){
      res.render("Login", {message:"Неверный Логин"})
    }else{
      bcrypt.compare(Password, user.Password, function(err, result) {
        if(err){
          console.log(err)
        }else{
          console.log(result)
          if(result){
            
            const token = jwt.sign(user.Login, CONFIG.SECRET_KEY, {
              expiresIn: "24h"
            });
            console.log(token)
            // console.log(hdr)
            // console.log(req.cookies)
            res.cookie("token", token, {
              path: "/",
              maxAge: 86400000
            })
            res.redirect("/users/profile")

          }else{
            res.render("Login", {message:"Неверный Пароль"})
          }
        }
      });
    }
  })
  .catch(err => {
    console.log(err)
  })

});






module.exports = router;
