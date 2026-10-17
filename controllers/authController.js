const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async(req, res, next)=>{
    try{
        const{name, email, password} = req.body;

        if (!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password",

            });            
    }
   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
      if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

     if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
     const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

     res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
     } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
     const user = await User.findOne({
      email: email.trim().toLowerCase(),

    });
     if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

     const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

      res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
     } catch (error) {
    next(error);
  }
};
module.exports = {register, login};


