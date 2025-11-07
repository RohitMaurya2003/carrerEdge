import Connection from "../models/connection.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const menteeId = req.user._id;

    // Check if a request already exists
    const existingConnection = await Connection.findOne({ mentor: mentorId, mentee: menteeId });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection request already sent." });
    }

    const newConnection = new Connection({
      mentor: mentorId,
      mentee: menteeId,
      status: "pending",
    });

    await newConnection.save();
    res.status(201).json(newConnection);
  } catch (error) {
    console.log("Error in sendConnectionRequest controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found." });
    }

    connection.status = "accepted";
    await connection.save();

    res.status(200).json(connection);
  } catch (error) {
    console.log("Error in acceptConnectionRequest controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const connections = await Connection.find({
      $or: [{ mentor: userId }, { mentee: userId }]
    }).populate("mentor mentee", "fullName email profilePic");

    res.status(200).json(connections);
  } catch (error) {
    console.log("Error in getConnections controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};