import { Request, Response } from 'express';
import { User } from '../models/userModal';

export const createOrUpdateUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid, email, displayName } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).send({ message: "Missing required fields: firebaseUid and email." });
    }


    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUid },    
      { $set: { email, displayName } },
      { new: true, upsert: true }       
    );

    console.log(`User ${user.email} synced successfully.`);
    res.status(200).json(user);

  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};