import { Request, Response } from "express";
import { User } from "../models/userModal";
import { Canvas } from "../models/canvaModel";

export const createCanvas = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const firebaseUid = req.user!.uid; 

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "Authenticated user not found in database." });
    }

    const newCanvas = await Canvas.create({
      name: name || "Untitled Canvas",
      owner: user._id,
    });

    res.status(201).json(newCanvas);
  } catch (error) {
    console.error("Error creating canvas:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCanvases = async(req:Request , res:Response)=>{
    try{
      const userId = req.user!.uid;
    const user = await User.findOne({ userId });

      if(!user){
        return res.status(404).json({message:"User not found"});

      }

      const userRelatedCanvases = await Canvas.find({owner:user}).sort({createdAt:-1});
      res.status(201).json(userRelatedCanvases);

    }
    catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }

}