//#region dependency
const {format}=require('date-fns');
const {v4: uuid}=require('uuid');

const fs=require('fs');
const fsPromises=require('fs').promises;
const path=require('path');
//#endregion

//#region services
const fcreateLogDir=async(a)=>{
    if(!fs.existsSync(path.join(__dirname,'..',`${a}`))){
      await  fsPromises.mkdir(path.join(__dirname,'..',`${a}`));
    }
}

const audEvents=async(message,dir,uuid)=>{
   await fcreateLogDir(dir)
    const file = `${format(new Date(), "yyyyMMdd")}.txt`;
    let logItem = "*".repeat(140) + "\r\n";
     logItem +=`${format(new Date(),'yyyyMMdd:HH:mm:ss:sss')}`+ "\r\n";
    logItem += `correlationId:${uuid}` + "\r\n";
    logItem += `${message}` + "\r\n";
    logItem += "*".repeat(140) + "\r\n";
    try{
//appendFile function will go-ahead to create the file if not exist and continually write to it
      await fsPromises.appendFile(
        path.join(__dirname, "..", dir, file),
        logItem
      );
    }catch(err){
        
        await fsPromises.appendFile(
          path.join(__dirname, "..", dir, file),
          `${err.message}\t${logItem}`
        );
    }
}
//#endregion

module.exports=audEvents;

