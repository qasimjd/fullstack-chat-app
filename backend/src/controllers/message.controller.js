import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUserforsidebar = async (req, res) => {
    try {
        const logdinUser = req.user._id;
        const users = await User.find({ _id: { $ne: logdinUser } }).select("-password");
        return res.status(200).json(users);
    }
    catch (error) {
        console.log("error in getUserforsidebar", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: otherId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: otherId },
                { sender: otherId, receiver: myId },
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
        const { id: receiver } = req.params;
        const sender = req.user._id; // Assuming req.user._id is populated correctly
        const { text, media } = req.body;

        console.log("Received data:", { sender, receiver, text, media });

        let imageUrl;
        if (media) {
            const uploadResponse = await cloudinary.uploader.upload(media);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            sender,
            receiver,
            text,
            media: imageUrl || null, // Assign image URL if available
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiver)
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        return res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this message" });
        }
        await Message.findByIdAndDelete(id); // Deletes the message from MongoDB
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the message' });
    }
}

