const express=require('express');
const route=express.Router();
const auth=require('../../middleware/auth');
const User=require('../../model/User');
const jwt=require('jsonwebtoken');
const { check,validationResult }=require('express-validator');
const bcryptjs=require('bcryptjs');
const config=require('config');

route.get('/',auth,async (req,res)=>{
    try {
        const user=await User.findById(req.user.id).select('-password');
        console.log(user);
        res.status(200).json({
            user:user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Server error" });        
    }
});

route.post('/',[
    check('email',"Please provide  a valid mail ID").isEmail(),
    check('password',"Passsword is required").not().isEmpty()
],async (req,res)=>{
    const errors=validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        res.status(400).json({ errors }); 
    }

    const { email,password }=req.body;
    try {
        const user= await User.findOne({email:email });
        if(!user){
            return res.status(400).json({ errors:{ errors:[{msg:"Invalid credential"}]}});
        }

        const matchPassword=await bcryptjs.compare(password,user.password);
        console.log(matchPassword);
        if(!matchPassword){
            return res.status(400).json({ errors:{ errors:[{msg:"Invalid credential"}]}});
        }
        const payload={
            user:{
                id:user.id
            }
        }
        const token=jwt.sign(payload,config.get('SECRET_KEY'),{ expiresIn:3600 },(err,token)=>{
            if(err) throw error;
            res.status(200).json({
                token:token
            })
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ errors:{ errors:[{msg:"Invalid credential"}]}});
    }
});

module.exports=route;