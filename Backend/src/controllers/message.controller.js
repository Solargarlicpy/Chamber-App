import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { sender } from "../lib/resend.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // find all users except self
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getAllContacts:", error);
        res.status(500).json({ message: "Server error" });
    }   
}

// function to get messages between logged in user and another user by their user id
export const getMessagesByUserId = async (req, res) => {
    try {
        // logged in user id
        const myId = req.user._id;
        // user id to chat with
        const {id:userToChatId} = req.params

        // variable to fetch messages between the two users
        const message = await Message.find({
            $or: [
                {senderId:myId, receiverId: userToChatId},
                {senderId:userToChatId, receiverId: myId},
            ],
        });
        
        // send messages back to frontend
        res.status(200).json(message);
        } catch (error) {
            console.log("Error in getMessages controller:", error.message);
            res.status(500).json({ error: "Internal Server error" });
        }

};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required to send a message" });    
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send message to yourself" });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        // using let to allow for reassignment if image is uploaded
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
        });


        await newMessage.save();

        // todo: send message in real time if user is only wiht socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }

};

// fetch only the chats we have had with other users to display in our chat list
// sender is us receiver is us 
export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

    // find all the message where the logged in user is either sender or receiver 
    const messages = await Message.find({
        $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    // if sender is me then receiver is chat partner else sender is chat partner
    // made an array to avoid duplicates
    const chatPartnerIds = [
    ...new Set(messages.map((msg) => 
        msg.senderId.toString() === loggedInUserId.toString() 
        ? msg.receiverId.toString() 
        : msg.senderId.toString()
        )
    ),
];

    const chatPartners = await User.find({_id: {$in:chatPartnerIds}}).select("-password");
    res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in getChatPartners:", error);
        res.status(500).json({ message: "Server error" });
    }
};