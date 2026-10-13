import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true}, password:{type:String,required:true,select:false}, role:{type:String,enum:['customer','provider','admin'],default:'customer'}, phone:String, address:String, skills:[String], bio:String, approved:{type:Boolean,default:false} },{timestamps:true});
export default mongoose.model('User',userSchema);
