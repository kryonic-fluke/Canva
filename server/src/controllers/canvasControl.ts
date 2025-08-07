import { Request, Response } from "express";
import { User } from "../models/userModal";
import { Canvas } from "../models/canvaModel";
import { firestoreDb } from "..";
import crypto from "crypto";

export const createCanvas = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const firebaseUid = req.user!.uid;

    const user = await User.findOne({ firebaseUid }); //this is for auth check

    if (!user) {
      return res
        .status(404)
        .json({ message: "Authenticated user not found in database." });
    }

    const canvasName = name || "Untitled Canvas";

    const inviteToken = crypto.randomBytes(16).toString("hex");

    const newCanvas = await Canvas.create({
      name: canvasName || "Untitled Canvas",
      owner: user._id,
      collaborators: [user._id], 
      inviteToken: inviteToken, 
    });
    const canvasDocRef = firestoreDb
      .collection("canvases")
      .doc(newCanvas._id.toString());
    await canvasDocRef.set({
      name: canvasName,
      ownerId: user._id.toString(),
      activeUsers: {},
      createdAt: new Date(),
    });

    await canvasDocRef
      .collection("nodes")
      .doc("_init")
      .set({ initialized: true });
    await canvasDocRef
      .collection("edges")
      .doc("_init")
      .set({ initialized: true });
    await canvasDocRef
      .collection("pendingRequests")
      .doc("_init")
      .set({ initialized: true });
    console.log("Firestore document created successfully.");

    res.status(201).json(newCanvas);
  } catch (error) {
    console.error("Error creating canvas:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getInviteLink = async (req: Request, res: Response) => {
  const { _id } = req.params;

  const canvas = await Canvas.findById(_id).select("inviteToken");

  if (!canvas) {
    return res.status(404).json({ message: "Canvas not found" });
  }
  const inviteLink = `http://localhost:3000/join/${canvasId}/${canvas.inviteToken}`;
  res.status(200).json({ inviteLink });
};


export const getCanvases = async (req: Request, res: Response) => {
  try {
    console.log("request hit for get canvas");

    const firebaseUid = req.user!.uid;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRelatedCanvases = await Canvas.find({ owner: user }).sort({
      createdAt: -1,
    });
    res.status(201).json(userRelatedCanvases);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCanvas = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const firebaseUid = req.user?.uid;

  console.log("id:", _id);
  console.log("firebaseUid:", firebaseUid);

  try {
    const canvas = await Canvas.findById(_id);

    if (!canvas) {
      console.log(`Canvas with ID: ${_id} not found in MongoDB.`);
      return res.status(404).json({ message: "Canvas not found." });
    }
    console.log("Found canvas to delete:", canvas);

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      console.log(
        `User with Firebase UID: ${firebaseUid} not found in our User collection.`
      );
      return res.status(403).json({ message: "User not found." });
    }
    console.log("Found requesting user in DB:", user);

    if (canvas.owner.toString() !== user._id.toString()) {
      console.log(
        "Authorization failed. Canvas owner:",
        canvas.owner.toString(),
        "User ID:",
        user._id.toString()
      );
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this canvas." });
    }

    await Canvas.findByIdAndDelete(_id);
    console.log(`Deleted canvas ${_id} from MongoDB.`);

    const canvasDocRef = firestoreDb.collection("canvases").doc("_id");
    await canvasDocRef.delete();
    console.log(`Deleted canvas ${_id} from Firestore.`);

    res.status(200).json({ message: "Canvas deleted successfully" });
  } catch (error) {
    console.error("Server error during canvas deletion:", error);
    res.status(500).json({ message: "Server error during canvas deletion." });
  }
};
