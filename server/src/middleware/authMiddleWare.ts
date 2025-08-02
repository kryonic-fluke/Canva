import { Request, Response, NextFunction } from 'express';
import admin from "firebase-admin"



export interface AuthentucatedRequestCheck extends Request{
    user:admin.auth.DecodedIdToken
}




export const protect = async(req: AuthentucatedRequestCheck,res: Response,next:NextFunction)=>{
     let token ;
     if(req.headers.authorization&& req.headers.authorization?.startsWith('Bearer')){
        try{
            token  = req.headers.authorization.split(' ')[1];

            const decodedToken = await admin.auth().verifyIdToken(token);
              req.user = decodedToken;

              next();
        }
        catch(error){
             console.error('Error while verifying Firebase ID token:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
        }
     }

     else{
        res.status(401).json({message:"No aitharized token, no token"})
     }
}