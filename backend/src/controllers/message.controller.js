import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Connection from "../models/connection.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch users connected with the logged-in user
    const connections = await Connection.find({
      $or: [{ mentor: loggedInUserId }, { mentee: loggedInUserId }],
      status: "accepted"
    }).populate("mentor mentee", "-password");

    // Extract the user details of connected mentors/mentees
    const filteredUsers = connections.map(conn =>
      conn.mentor._id.toString() === loggedInUserId.toString() ? conn.mentee : conn.mentor
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    console.log(req.params);
    const { receiverId } = req.params;
    
    const myId = req.user._id;

    console.log("Authenticated User ID:", myId);
    console.log("Requested Receiver ID:", receiverId);

    // Check if sender and receiver are connected
    const connection = await Connection.findOne({
      $or: [
        { mentor: myId, mentee: receiverId, status: "accepted" },
        { mentor: receiverId, mentee: myId, status: "accepted" }
      ]
    });

    if (!connection) {
      return res.status(403).json({ message: "You can only view messages of connected mentors/mentees." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Check if a valid mentor-mentee connection exists
    const connection = await Connection.findOne({
      $or: [
        { mentor: senderId, mentee: receiverId },
        { mentor: receiverId, mentee: senderId },
      ],
      status: "accepted", // Ensure the connection is accepted
    });

    if (!connection) {
      return res.status(403).json({ error: "You are not connected with this user" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      connectionId: connection._id, // Link the message to the connection
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};