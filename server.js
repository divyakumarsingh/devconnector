const express= require('express');
const app=express();
const dbConnect=require("./config/db");
const cors=require("cors");
const path=require('path');

dbConnect();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.urlencoded({ extended:true }));
app.use(express.json({ extended:true }));

app.use('/api/user',require('./routes/api/user'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/post',require('./routes/api/post'));

// Serve static assets in production
if(process.env.NODE_ENV  ==='production'){
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Listening on Port:${PORT}`));