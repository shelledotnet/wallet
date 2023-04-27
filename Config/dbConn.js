const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js

const connectDB=async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_URL, {
          useUnifiedTopology: true, //for resolving issue errors from mongoose
          useNewUrlParser: true, //for resolving issue errors from mongoose
        });
    }catch(err){
        console.error(err);
    }
}

module.exports=connectDB