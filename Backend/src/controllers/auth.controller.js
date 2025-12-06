import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import "dotenv/config";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body

    try {
        if (!fullName || !email || !password){
            return res.status(400).json({message:"All fields required"})
        }
        
        if(password.length < 6) {
            return res.status(400).json({message:"Password must be at least six characters"})

        }

        // check if email is valid: regular expression (regex) check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne ({email});
    if(user) return res.status(400).json({message:"Email already in use"})

    // Hash pw
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User ({
        fullName,
        email,
        password: hashedPassword,
    });

    if(newUser) {
        generateToken(newUser._id, res);
        await newUser.save();

        // send welcome email to user
        try {
            await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.CLIENT_URL);    
        } catch (error) {
            console.error("Failed to send welcome email:", error);
        }

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        })

    } else {
        return res.status(400).json({message:"Invalid user data"})
    }


    } catch (error) {
        console.log(" SIGNUP ERROR:", error);
        res.status(500).json({message:"Server error"})
    }
};

export const login = async (req, res) => {
    const {email, password} =  req.body;
    // Validate input
    if (!email || !password){
        return  res.status(400).json({message:"All fields required"})
    }
    // Check for user
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"}); // keep ambiguous

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"}); // keep ambiguous

        generateToken(user._id, res);
        // Return user data
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });
    } catch (error) {
        console.log(" LOGIN ERROR:", error);
        res.status(500).json({message:"Server error"})
    }
};
// Logout user
export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
};    