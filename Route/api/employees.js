const express=require('express');
const router=express.Router();
const {v4:uuid}=require('uuid');
const serialize = require('serialize-javascript');
const logEvents=require('../../middleware/logEvents');
const employeeController=require('../../Controllers/employeesController');
const verifyJWT=require('../../middleware/verifyJWT');
const ROLES_LIST=require('../../Config/roles_list');
const verifyRoles=require('../../middleware/verifyRoles');

//u most have verifyJWT b4 verifyRoles

router.route('/')
      .get(verifyJWT, employeeController.getAllEmployees)
      //.get(employeeController.getAllEmployees)
      .post(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.createNewEmployee)
      .put(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.updateEmployee);
    router.route('/:id')
        .get(verifyJWT,employeeController.getEmployeeById)
        .delete(verifyJWT,verifyRoles(ROLES_LIST.Admin),employeeController.deleteEmployee);

module.exports=router; 