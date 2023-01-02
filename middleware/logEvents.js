const {format}=require('date-fns');
const {v4:uuid}=require('uuid');

const fs=require('fs');
const fsPromises=require('fs').promises;
const path=require('path');

const fcreateLogDir=(a)=>{
    if(!fs.existsSync(path.join(__dirname,'..',`${a}`))){
        fsPromises.mkdir(path.join(__dirname,'..',`${a}`));
    }
}


const logEvents=async(message,dir,logFile,uuid)=>{
    fcreateLogDir(dir)
    const dateTime=`${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`;
    const logItem=`${dateTime}\t${uuid}\t${message}\n`;
    try{
        
        await fsPromises.appendFile(
          path.join(__dirname, "..",dir, logFile),
          logItem
        );

    }catch(err){
        
        await fsPromises.appendFile(
          path.join(__dirname, "..", dir, logFile),
          `${err.message}\t${logItem}`
        );
    }
}






module.exports=logEvents;

