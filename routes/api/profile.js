const express=require('express');
const route=express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../model/Profile');
const Post=require('../../model/Post');
const { check,validationResult } = require('express-validator');
const request=require('request');
const config=require('config');


//Current user profile
route.get('/me',auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({ user:req.user.id }).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({
                msg:"There is no profile for this user"
            });
        }

        res.json(profile);
    }catch(error){
        console.log(error);
        res.status(500).json({ msg:"Server Error" });
    }
});


//Create or update profile
route.post('/update',
    [auth,[
        check('status',"Status is required").not().isEmpty(),
        check('skills',"Skills are required").not().isEmpty()
    ]],
    async(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({ errors });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        }=req.body;

        //Build profile object
        const profileFields={};
        console.log(req.user);
        profileFields.user=req.user.id;
        if (company) profileFields.company=company;
        if (website) profileFields.website=website;
        if (location) profileFields.location=location;
        if (bio) profileFields.bio=bio;
        if (status) profileFields.status=status;
        if (githubusername) profileFields.githubusername=githubusername;
        if(skills) profileFields.skills=skills.split(',').map((skill)=>skill.trim());

        profileFields.social={};
        if(youtube) profileFields.social.youtube=youtube;
        if(twitter) profileFields.social.twitter=twitter;
        if(facebook) profileFields.social.facebook=facebook;
        if(linkedin) profileFields.social.linkedin=linkedin;
        if(instagram) profileFields.social.instagram=instagram;
        
        try {
            let profile= await Profile.findOne({ user:req.user.id });
            if(profile){
                profile= await Profile.findOneAndUpdate(
                    { user:req.user.id },
                    { $set:profileFields },
                    { new:true }
                );
                return res.status(200).json(profile);
            }

            profile=new Profile(profileFields);
            profile=await profile.save();
            res.status(200).json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                errors:{ errors:[{msg:"Server error"}]}
            });
        }   
    }
);

// Get all profile
route.get('/',async (req,res)=>{
    try {
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.status(200).json(profiles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Server Error" });
    }
})

// Get profile by Id
route.get('/user/:user_id',async (req,res)=>{
    try {
        const profile=await Profile.findOne({ user:req.params.user_id }).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({ msg:"No profile found." });
        }
        res.status(200).json(profile);
    } catch (error) {
        // console.log(error);
        if(error.kind=='ObjectId'){
           return res.status(400).json({ msg:"No profile found." });
        }
        res.status(500).json({ msg:"Server error" });
    }
})


//Delete user and its profile
route.delete('/',auth,async(req,res)=>{
    try {
        await Post.deleteMany({ user:req.user.id });
        await Profile.findOneAndRemove({ user:req.user.id });
        await User.findOneAndRemove({ _id:req.user.id });
        res.status(200).json({ msg:"User and profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg:'Server Error' });
    }
});

//Add experience
route.put('/experience',[auth,[
    check('title',"Title is required").not().isEmpty(),
    check('company',"Company is required").not().isEmpty(),
    check('from',"From is required").not().isEmpty(),
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() });
    }
    
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body;

    const newExperience= {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

     try{   
         console.log(req.user.id);
        let profile=await Profile.findOne({ user:req.user.id });
        if(!profile){
            return res.status(400).json({ errors:{ errors:[{msg:"Server Error"}]}}); 
        }
        profile.experience.unshift(newExperience);
        await profile.save();
        res.status(200).json({ msg:"Experience added successfully.",profile:profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors:{ errors:[{msg:"Server Error"}]}});
    }
});


//Delete experience
route.delete('/experience/:experience_id',auth,async(req,res)=>{
    try{   
        let profile=await Profile.findOne({ user:req.user.id });
        if(!profile){
            return res.status(400).json({msg:"Profile was not found"});  
        }
        const removeIndex=profile.experience
            .map(item=>item.id)
            .indexOf(req.params.experience_id);
        
        if(removeIndex<0){
            return res.status(400).json({ msg:"Experience was not found" });
        }

        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.status(200).json({ msg:"Experience deleted successfully.",profile:profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:'Server Error' });
    }
});

//Add education
route.put('/education',[auth,[
    check('school',"School is required").not().isEmpty(),
    check('degree',"Degree is required").not().isEmpty(),
    check('fieldofstudy',"Field of study is required").not().isEmpty(),
    check('from',"From is required").not().isEmpty(),
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() });
    }
    
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description        
    }=req.body;

    const newEducation= {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

     try{   
        console.log(req.user.id);
        let profile=await Profile.findOne({ user:req.user.id });
        if(!profile){
            return res.status(400).json({msg:"Profile was not found"});  
        }
        profile.education.unshift(newEducation);
        await profile.save();
        res.status(200).json({ msg:"Education added successfully.",profile:profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors:{ errors:[{msg:"Server Error"}]}});
    }
});


//Delete experience
route.delete('/education/:education_id',auth,async(req,res)=>{
    try{   
        let profile=await Profile.findOne({ user:req.user.id });
        if(!profile){
            return res.status(400).json({msg:"Profile was not found"});  
        }
        const removeIndex=profile.education
            .map(item=>item.id)
            .indexOf(req.params.education_id);
        
        if(removeIndex<0){
            return res.status(400).json({ msg:"Education was not found" });
        }

        profile.education.splice(removeIndex,1);
        await profile.save();
        res.status(200).json({ msg:"Education deleted successfully.",profile:profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:'Server Error' });
    }
});


route.get('/github/:username',(req,res)=>{
    try {
        const options={
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('GITHUB_KEY')}&client_secret=${config.get('GITHUB_SECRET')}`,
            method:"GET",
            headers:{ 'User-Agent':"node.js" }
        }
        request(options,(error,response,body)=>{{
            if(error) console.log(error);

            if(response.statusCode!==200){
                return res.status(404).json({ msg:"No github profile found" });
            }
            res.json(JSON.parse(body));
        }});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:'Server Error' });
    }
});

module.exports=route;