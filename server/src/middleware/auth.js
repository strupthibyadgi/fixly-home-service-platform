import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function protect(req,res,next){ try { const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null; if(!token)return res.status(401).json({message:'Sign in to continue.'}); const decoded=jwt.verify(token,process.env.JWT_SECRET); req.user=await User.findById(decoded.id); if(!req.user)return res.status(401).json({message:'Account not found.'}); next(); } catch { return res.status(401).json({message:'Session expired. Please sign in again.'}); } }
export const allowRoles=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'You do not have access to this action.'});
