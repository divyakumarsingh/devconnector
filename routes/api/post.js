const express=require('express');
const route=express.Router();
const { check,validationResult }=require('express-validator');
const auth=require('../../middleware/auth');
const User=require('../../model/User');
const Post=require('../../model/Post');
const Profile=require('../../model/Profile');

route.post('/',[auth,[
    check('text',"Text is required").not().isEmpty()
]],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors });
    }

    try {
        const user=await User.findById(req.user.id).select('-password');
        const newPost=new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        })
        
        const post=await newPost.save();
        res.status(200).json({ msg:"Post added successfully",post:post });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
});

route.get('/',auth,async(req,res)=>{
    try {
        const posts=await Post.find().sort({ date:-1 });
        res.json(posts);
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

route.get('/:id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg:"Post not found" });
        }
        res.json(post);
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({ msg:"Post not found" });
        }
        console.log(error);
        res.status(500).send("Server Error");
    }
});

route.delete('/:id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg:"Post not found" });
        }

        if(post.user.toString()!==req.user.id){
            return res.status(401).json({ msg:"You are not authorized" });
        }
        await post.remove();
        res.json({ msg:"Post removed successfully"  });
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({ msg:"Post not found" });
        }
        console.log(error);
        res.status(500).send("Server Error");
    }
});

route.put('/like/:id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg:"Post not found" });
        }
        console.log(post.likes);
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
            return res.status(400).json({ msg:"Post already liked" });
        }
        post.likes.unshift({ user:req.user.id });
        await post.save();
        res.json({ msg:"Post liked successfully",likes:post.likes });
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({ msg:"Post not found" });
        }
        console.log(error);
        res.status(500).send("Server Error");
    }
});

route.put('/unlike/:id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg:"Post not found" });
        }
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
            return res.status(400).json({ msg:"Post has not been liked yet" });
        }

        const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        await post.save();
        res.json({ msg:"Post unliked successfully",likes:post.likes });
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({ msg:"Post not found" });
        }
        console.log(error);
        res.status(500).send("Server Error");
    }
});


route.post('/comment/:id',[auth,[
    check('text',"Text is required").not().isEmpty()
]],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors });
    }

    try {
        const user=await User.findById(req.user.id).select('-password');
        const post=await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ msg:"Post not found" });
        }
         
        const newComment=new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        })
        
        post.comments.unshift(newComment);
        await post.save();
        res.status(200).json({ msg:"Comment added successfully",comments:post.comments });
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({ msg:"Post not found" });
        }
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
});

route.delete('/comment/:id/:comment_id',auth,async (req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg:"Post not found" });
        }

        const comment=post.comments.find(comment=>comment._id==req.params.comment_id);
        if(!comment){
            return res.status(404).json({ msg:"Comment not found" });
        }

        //Check if user is authorized
        if(comment.user.toString()!==req.user.id){
            return res.status(401).json({ msg:"You are an unauthorised user" });
        }

        const removeIndex=post.comments.map(comment=>comment._id.toString())
                                .indexOf(req.params.comment_id);
        
        post.comments.splice(removeIndex,1);
        await post.save();
        res.status(200).json({ msg:"Comment deleted successfully" });
    } catch (error) {
        if(error.kind==='ObjectId'){
            return res.status(404).json({ msg:"Post not found" });
        }
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
});

module.exports=route;