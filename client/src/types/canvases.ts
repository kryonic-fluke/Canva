import { Timestamp } from "firebase/firestore";

export interface UserDocument {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
}

export interface CanvasDocument {
  _id: string;
  name: string;
  owner: string;
  collaborators: string[];
  inviteToken: string;
}

export interface CanvasOwner {
  _id: string;
  firebaseUid: string;
  name?: string;
  email?: string;
}

export interface CanvasType {
  _id: string;
  name: string;
  owner: CanvasOwner;
  collaborators: string[];
  inviteToken: string;
  ownerId: string;
  createdAt: Timestamp;
  activeUsers: Record<string, null>;
}