const Employee=require('../models/Employee')  
const { v4: uuid } = require("uuid");
const {
  HTTP_STATUS_CODE,
  HTTP_STATUS_DESCRIPTION,
  ErrorResponse,
} = require("../Global");
const { StatusCodes } = require("http-status-codes");
//#region  all resources

const getAllEmployees=async (req,res)=>{
    try{
       const employees = await Employee.find()
    .select("-_id -__v -createdAt -updatedAt") //select all fields excluding fields with prefix negative;;
    .sort("createdAt"); // order by CreatedAt asc
  //.sort('name -price')order by name asc thenby price desc
  if (!employees)
    return res.status(204).json({ message: "No employees found." });
  

  return res.status(StatusCodes.OK).json({
    data: employees,
    code: StatusCodes.OK,
    success: true,
    ref: uuid(),
  });  
    }catch(err){
      ErrorResponse(err, res);
    }
 
}

const getEmployeeById=async (req,res)=>{
  if (!req?.params?.id)
    return res
      .status(400)
      .json({ message: `Employee id ${req.params.id} required` });
try{
  const employee = await Employee.findOne({ _id: req.params.id })
    //.exec()
    .select("-_id -__v -createdAt -updatedAt") //select all fields excluding fields with prefix negative;;
    .sort("createdAt") // order by CreatedAt asc
    .exec();
  //.sort('name -price')order by name asc thenby price desc
  if (!employee) {
    //if employee doesnt exist
    return res
      .status(404)
      .json({ message: `No emloyee id matches ${req.params.id}` });
  }
  res.json(employee);
}catch (err) {
   ErrorResponse(err,res);
  }
}

const createNewEmployee=async (req,res)=>{

   if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({'message':'First and last names are required.'});
    }

    try{
        const result = await Employee.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        })
        const emp = {
          id: result._id,
          firstname: result.firstname,
          lastname: result.lastname,
        };
        return res.status(StatusCodes.OK).json({
          data: emp,
          code: StatusCodes.CREATED,
          success: true,
          ref: uuid(),
        });
    }catch(err){
       ErrorResponse(err, res);
    }

}

const updateEmployee=async (req,res)=>{
  if (!req?.body?.id) {
    return res.status(400).json({ message: "id Parameter is required" });
  } 
  try {
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
      //if employee doesnt exist
      return res
        .status(404)
        .json({ message: `No emloyee id matches ${req.params.id}` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    const emp = {
      id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
    };
    return res.status(StatusCodes.OK).json({
      data: emp,
      code: StatusCodes.OK,
      success: true,
      ref: uuid(),
    });
  } catch (err) {
      ErrorResponse(err, res);
  }
}

const deleteEmployee=async (req,res)=>{
    try {
      if (!req?.params?.id)
        return res.status(400).json({ message: "Employee ID required" });
      const employee = await Employee.findOne({ _id: req.params.id }).exec();
      if (!employee) {
        //if employee doesnt exist
        return res
          .status(404)
          .json({ message: `No emloyee id matches ${req.params.id}` });
      }

      const result = await employee.deleteOne({ _id: req.params.id });

      res.json(result);
    } catch (err) {
      ErrorResponse(err, res);
    }
   }
//#endregion

module.exports={
    getAllEmployees,
    getEmployeeById,
    deleteEmployee,
    createNewEmployee,
    updateEmployee
};