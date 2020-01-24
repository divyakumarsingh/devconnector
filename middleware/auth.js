const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=((req,res,next)=>{
    const token=req.header("Authorization-Token");

    if(!token){
        return res.status(400).json({ errors:{ errors:[{msg:"Token not send"}]}});
    }

    try {
        const decoded_payload=jwt.verify(token,config.get('SECRET_KEY'));
        req.user=decoded_payload.user;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg:"Token is not valid" });
    }
})