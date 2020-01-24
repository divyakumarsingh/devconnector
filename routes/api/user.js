const express=require('express');
const route=express.Router();
const { check,validationResult } =require('express-validator');
const bcrypt=require('bcryptjs');
const gravatar=require('gravatar');
const jwt=require('jsonwebtoken');
const config=require('config');
const User=require('../../model/User');

route.post('/register',[
    check('name',"Name is required").not().isEmpty(),
    check('email',"Please provide a valid mail ID").isEmail(),
    check('password',"Password should be minimum 6 character long").isLength({ min:6 })
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors });
    }
    const  {name,email,password}=req.body;
    try {
        let user=await User.findOne({ email:email });
        if(user){
            res.status(400).json({ errors:{ errors:[{msg:"User already exists"}]} });
        }

        const avatar =gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });

        user=new User({
            name,
            email,
            avatar,
            password
        });

        const salt= await bcrypt.genSalt(10);
        user.password =await bcrypt.hash(password,salt);
        await user.save();

        const payload={
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,
            config.get('SECRET_KEY'),
            {expiresIn:3600},(err,token)=>{
                if(err) throw err;
                res.json({token:token});
            });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

module.exports=route;