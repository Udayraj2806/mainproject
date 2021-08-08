const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const branchSchema=new Schema({
  branch:{
      type: String,
      required :true,
      enum : ['CSE','IT','MECH','CIVIL','ELEC.']
  },
  allstudents : [{
        type:Schema.Types.ObjectId, ref : 'Student'
  }]
});
module.exports=mongoose.model('Branch',branchSchema)