import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
      joinedCanvases: [{ type: Schema.Types.ObjectId, ref: "Canvas" }], 
    pendingInvites: [{ type: Schema.Types.ObjectId, ref: "Canvas" }]
  },
  { timestamps: true }
);


export const User = model('User', userSchema);
