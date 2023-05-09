//#region 
const bcrypt=require('bcrypt');
const User=require('../models/User')  
const { v4: uuid } = require("uuid");
const {
  HTTP_STATUS_CODE,
  HTTP_STATUS_DESCRIPTION,
  ErrorResponse,
} = require("../Global");
const { StatusCodes } = require("http-status-codes");
//#endregion

//#region  all resources

const getAllUsers=async (req,res)=>{
    try{
      const users = await User.find()
        .select(
          "-_id -__v -createdAt -updatedAt -password -refreshToken -refreshTokenActive -refreshTokenExpired -refreshTokenExpiredDate"
        ) //select all fields excluding fields with prefix negative;;
        .sort("createdAt"); // order by CreatedAt asc
      //.sort('name -price')order by name asc thenby price desc
      if (!users) return res.status(204).json({ message: "No users found." });

      res.json(users);
    }
    catch(err){
       ErrorResponse(err, res);
    }
   
}

const getUserById=async (req,res)=>{
if(!req?.params?.id)return res.status(400).json({"message":`User ID ${req.params.id} required`});
try {
    const user=await User.findOne({_id: req.params.id})
    .select(
          "-_id -__v -createdAt -updatedAt -password -refreshToken -refreshTokenActive -refreshTokenExpired -refreshTokenExpiredDate"
        ) //select all fields excluding fields with prefix negative;;
        .sort("createdAt") // order by CreatedAt asc
      //.sort('name -price')order by name asc thenby price desc
    .exec();
if(!user){  //if employee doesnt exist
    return res.status(404).json({"message":`No user ID matches ${req.params.id}`});
}
res.json(user);
} catch (err) {
     ErrorResponse(err, res);
}

}

//this operation is on registerController
const createNewUser=async (req,res)=>{
   
   if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({'message':'First and last names are required.'});
    }

    try{
        const result=await Employee.create({
            firstname:req.body.firstname,
            lastname:req.body.lastname
        });
        res.status(201).json(result);
    }catch(err){
         ErrorResponse(err, res);
    }

}

const updateUserPwd=async (req,res)=>{

    if(!req?.body?.id)return res.status(400).json({'message':'ID  is required'});
     const user=await User.findOne({_id: req.body.id}).exec();
    if(!user)return res.status(400).json({"message":`No user ID matches ${req.body.id}`});
    try{
    if(req.user !== user.username)return res
      .status(403)
      .json({ "message": "only a user can update is password" });
    if(req?.body?.oldpassword && req?.body?.newpassword){
        const match=await bcrypt.compare(req?.body?.oldpassword,user.password);
        if(!match)return res.status(400).json({"message":`password: ${req.body.id} do not match `})
        else{
            
            const hashedPwd=await bcrypt.hash(req?.body?.newpassword, 10); //encrypt an sort of 10 round
            user.password=hashedPwd;
           const result=await user.save();
           
          return res.status(StatusCodes.OK).json({
            data: {roles:result.roles,username:result.username,email:result.email},
            code: StatusCodes.OK,
            success: true,
            ref: uuid(),
          });

        }
        
    }
    return res.status(400).json({'message':'oldpassword and newpassword are required.'});
    }catch(err){
         ErrorResponse(err, res);
   }

}

const deleteUser=async (req,res)=>{
        if(!req?.params?.id)return res.status(400).json({'message':'Employee ID required'});
        try {
           const user=await User.findOne({_id: req.params.id}).exec();
        if(!user)return res.status(400).json({"message":`No user ID matches ${req.params.id}`});
        const result=await user.deleteOne({_id: req.params.id});

         return res.status(StatusCodes.OK).json({
           data: {
             roles: result.roles,
             username: result.username,
             email: result.email,
           },
           code: StatusCodes.OK,
           success: true,
           ref: uuid(),
         }); 
        } catch (err) {
             ErrorResponse(err, res);
        }
        

   }


module.exports={
    getAllUsers,
    getUserById,
    deleteUser,
    createNewUser,
    updateUserPwd
};