const express=require('express');
const router=express.Router();
const {v4:uuid}=require('uuid');
const serialize = require('serialize-javascript');
const logEvents=require('../../middleware/logEvents');
const usersController=require('../../Controllers/usersController');
const verifyJWT=require('../../middleware/verifyJWT');
const ROLES_LIST=require('../../Config/roles_list');
const verifyRoles=require('../../middleware/verifyRoles');

//u most have verifyJWT b4 verifyRoles

router.route('/')
      .get(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.getAllUsers)
      //.get(employeeController.getAllEmployees)
      //.post(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.createNewEmployee)
      .put(verifyJWT,usersController.updateUserPwd);
      

    router.route('/:id')
        .get(verifyJWT,verifyRoles(ROLES_LIST.Admin),usersController.getUserById)
        .delete(verifyJWT,verifyRoles(ROLES_LIST.Admin),usersController.deleteUser);

module.exports=router; 