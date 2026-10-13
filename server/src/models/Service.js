import mongoose from 'mongoose';
const serviceSchema=new mongoose.Schema({ name:{type:String,required:true,trim:true}, category:{type:String,required:true}, description:{type:String,required:true}, price:{type:Number,required:true,min:0}, durationMinutes:{type:Number,default:60}, image:{type:String,default:''}, active:{type:Boolean,default:true} },{timestamps:true});
export default mongoose.model('Service',serviceSchema);
