import { Response } from "express";
import { User } from "../models/userModal";
import { Canvas } from "../models/canvaModel";
import {type AuthentucatedRequestCheck} from '../middleware/authMIddleWare'


export const createCanvas = async (
  req: AuthentucatedRequestCheck,
  res: Response
) => {
  try {
    const { name } = req.body;


    const firebaseUid = req.user.uid;

    

    if (!firebaseUid) {
      return res
        .status(401)
        .json({ message: "Not authorized, no user UID found." });
    }
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in our database." });
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
