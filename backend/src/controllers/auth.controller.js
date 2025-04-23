import generateToken from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { fullname, email, password, profilePic } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullname, email, password: hashedPassword });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
    } catch (error) {
        console.log("error in signup", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        generateToken(user._id, res);
        return res.status(200).json({
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profile
        });
    }
    catch (error) {
        console.log("error in login", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullname } = req.body;
        const userId = req.user._id;
        if (!profilePic && !fullname) {
            return res.status(400).json({ message: 'Please select an image' });
        }

        let updateData = { fullname };
        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updateData.profilePic = uploadResponse.secure_url;
        }
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          updateData,
          { new: true }
        );
    
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in updateProfile", error.message);
        return res.status(500).json({ message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        return res.status(200).json(user);
    } catch (error) {
        console.log("error in checkAuth", error.message);
        return res.status(500).json({ message: error.message });
    }
}

