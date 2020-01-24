const mongoose=require('mongoose');
const config=require('config');
const MONGO_URL=config.get('MONGO_URL');

const dbConnect=async ()=>{
    try {
        await mongoose.connect(MONGO_URL,{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false}); 
        console.log("Connected to Mongo DB successfully.");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports=dbConnect;