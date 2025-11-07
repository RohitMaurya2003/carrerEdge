import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

// ✅ Send Mentor Request (Mentee → Mentor)
export const requestMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const menteeId = req.user._id;

    if (req.user.role !== "mentee") {
      return res.status(403).json({ message: "Only mentees can send mentor requests" });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Prevent duplicate requests
    const existingConnection = await Connection.findOne({
      mentor: mentorId,
      mentee: menteeId,
    });

    if (existingConnection) {
        if (existingConnection.status === "pending") {
          return res.status(400).json({ message: "You have already sent a request to this mentor" });
        }
        if (existingConnection.status === "accepted") {
          return res.status(400).json({ message: "You are already connected with this mentor" });
        }
      }      

    // Create a new connection request
    const newConnection = new Connection({
      mentor: mentorId,
      mentee: menteeId,
      status: "pending",
    });

    await newConnection.save();
    res.status(200).json({ message: "Request sent to mentor" });
  } catch (error) {
    console.log("Error in requestMentor:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Accept Request (Mentor → Accept Mentee)
export const acceptRequest = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const mentorId = req.user._id;

    if (req.user.role !== "mentor") {
      return res.status(403).json({ message: "Only mentors can accept requests" });
    }

    const connection = await Connection.findOne({
      mentor: mentorId,
      mentee: menteeId,
      status: "pending",
    });

    if (!connection) {
      return res.status(400).json({ message: "No pending request from this mentee" });
    }

    // Update connection status to accepted
    connection.status = "accepted";
    await connection.save();

    res.status(200).json({ message: "Connection established" });
  } catch (error) {
    console.log("Error in acceptRequest:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Reject Request (Mentor → Reject Mentee)
export const rejectRequest = async (req, res) => {
  try {
    const { menteeId } = req.params;
    const mentorId = req.user._id;

    if (req.user.role !== "mentor") {
      return res.status(403).json({ message: "Only mentors can reject requests" });
    }

    const connection = await Connection.findOneAndDelete({
      mentor: mentorId,
      mentee: menteeId,
      status: "pending",
    });

    if (!connection) {
      return res.status(400).json({ message: "No pending request from this mentee" });
    }

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    console.log("Error in rejectRequest:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get All Connected Mentors/Mentees (Accepted Connections)
export const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch only "accepted" connections
    const connections = await Connection.find({
      $or: [{ mentor: userId }, { mentee: userId }],
      status: "accepted",
    })
      .populate("mentor", "fullName email profilePic")
      .populate("mentee", "fullName email profilePic");

    console.log("Fetched Connections:", connections); // Debugging Log ✅

    // Separate mentors and mentees correctly
    const mentors = connections
      .filter((conn) => conn.mentee._id.toString() === userId.toString())
      .map((conn) => conn.mentor);

    const mentees = connections
      .filter((conn) => conn.mentor._id.toString() === userId.toString())
      .map((conn) => conn.mentee);

    console.log("Mentors:", mentors); // Debugging Log ✅
    console.log("Mentees:", mentees); // Debugging Log ✅

    res.status(200).json({ mentors, mentees });
  } catch (error) {
    console.error("Error in getConnections controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// ✅ Remove Connection (Either Party Can Remove)
export const removeConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;

    const connection = await Connection.findOneAndDelete({
      $or: [
        { mentor: loggedInUserId, mentee: userId },
        { mentor: userId, mentee: loggedInUserId },
      ],
      status: "accepted",
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    res.status(200).json({ message: "Connection removed" });
  } catch (error) {
    console.log("Error in removeConnection:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Fetch Pending Requests for a Mentor
export const getPendingRequests = async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
      return res.status(403).json({ message: "Only mentors can view pending requests" });
    }

    const pendingRequests = await Connection.find({
      mentor: req.user._id,
      status: "pending",
    }).populate("mentee", "fullName email profilePic");

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.log("Error in getPendingRequests:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMentors = async (req, res) => {
  try {
    if (req.user.role !== "mentee") {
      return res.status(403).json({ message: "Only mentees can view mentors" });
    }

    const mentors = await User.find({ role: "mentor" }).select("fullName email profilePic");

    const connections = await Connection.find({
      mentee: req.user._id    });

    // Map status to mentors
    const mentorsWithStatus = mentors.map((mentor) => {
      const connection = connections.find((conn) => conn.mentor.toString() === mentor._id.toString());
      return {
        ...mentor.toObject(),
        status: connection ? connection.status : "not_requested",
      };
    });

    res.status(200).json(mentorsWithStatus);
  } catch (error) {
    console.log("Error in getMentors:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};