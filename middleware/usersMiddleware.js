const jwt = require("jsonwebtoken")
const Users = require("../models/Users");
const CONFIG = require("../config")
module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if(token){
        jwt.verify(token, CONFIG.SECRET_KEY, (err,decode) => {
            if(err){
                res.redirect("/not_found");
            }
            else{
                // console.log(req.decoded);
                req.decoded = decode
                console.log(req.decoded);

                
                Users.findOne({Login: req.decoded})
                .then(user => {
                    req.user = user;
                    next()
                })
                .catch(err => {
                    res.json(err);
                })
            }
        })
    }else{
        res.redirect("/Login");
    }
}