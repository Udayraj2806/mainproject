const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const newSchema=new Schema({
    Prn:{type:Number,required: true},
   Name: {type: String,required: true},
   Year:{type:String },
   Marks:{type:Number},
   branch:{ type:Schema.Types.ObjectId, ref: 'Branch'}
});
module.exports=mongoose.model('Student',newSchema)

