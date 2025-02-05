import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const otpStore = {}; // Temporary storage for OTPs

// Send OTP Controller
export const sendOtpController = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is Required'
            });
        }

        // Check if user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).send({
                success: false,
                message: 'User already registered. Please login.'
            });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        otpStore[email] = otp; // Store OTP temporarily

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.PASSWORD // Your email password
            }
        });

        // Send OTP Email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP for Registration',
            text: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send({
                    success: false,
                    message: 'Failed to send OTP. Please try again.'
                });
            }
            res.status(200).send({
                success: true,
                message: 'OTP sent successfully to your email.'
            });

            // Expire OTP after 5 minutes
            setTimeout(() => delete otpStore[email], 300000);
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in sending OTP'
        });
    }
};

// Register Controller
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer, otp } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered. Please Login.',
            });
        }

        // Validations
        if (!name) {
            return res.send({ message: 'Name is Required' });
        }
        if (!email) {
            return res.send({ message: 'Email is Required' });
        }
        if (!password) {
            return res.send({ message: 'Password is Required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone is Required' });
        }
        if (!address) {
            return res.send({ message: 'Address is Required' });
        }
        if (!answer) {
            return res.send({ message: 'Answer is Required' });
        }
        if (!otp) {
            return res.send({ message: 'OTP is Required' });
        }

        // Verify OTP
        if (otpStore[email] !== parseInt(otp)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        // Register user
        const hashedPassword = await hashPassword(password);

        // Save user
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
        }).save();

        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user,
        });

        // Clear OTP after successful registration
        delete otpStore[email];

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error,
        });
    }
};


//POST Login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation 
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not Registered'
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Email or Password'
            });
        }

        // Token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).send({
            success: true,
            message: 'Login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
    }
};

// Forgot Password Controller


export const forgotPasswordController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate email input
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required',
            });
        }

        // Step 1: Verify user email and send OTP
        if (!otp && !newPassword) {
            // Check if user exists
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'User with this email does not exist',
                });
            }

            // Generate OTP
            const generatedOtp = crypto.randomInt(100000, 999999);
            otpStore[email] = generatedOtp; // Store OTP temporarily

            // Configure Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL, // Your email
                    pass: process.env.PASSWORD, // Your email password
                },
            });

            // Send OTP Email
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is ${generatedOtp}. It will expire in 5 minutes.`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send({
                        success: false,
                        message: 'Failed to send OTP. Please try again.',
                    });
                }
                res.status(200).send({
                    success: true,
                    message: 'OTP sent successfully to your email.',
                });

                // Expire OTP after 5 minutes
                setTimeout(() => delete otpStore[email], 300000);
            });
            return;
        }

        // Step 2: Verify OTP and reset password
        if (!otp) {
            return res.status(400).send({
                success: false,
                message: 'OTP is required',
            });
        }
        if (!newPassword) {
            return res.status(400).send({
                success: false,
                message: 'New Password is required',
            });
        }

        // Verify OTP
        if (otpStore[email] !== parseInt(otp)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid or expired OTP',
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User with this email does not exist',
            });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Clear OTP after successful password reset
        delete otpStore[email];

        res.status(200).send({
            success: true,
            message: 'Password successfully changed',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error,
        });
    }
};



// Test Controller
export const testController = (req, res) => {
    res.send("Protected Routes");
};


//update prfole
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };