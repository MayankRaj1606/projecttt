import React, { useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();

    // Form submission handler for password reset
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email,
                otp,
                newPassword,
            });

            if (res && res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    // Handler for sending OTP
    const handleSendOtp = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, { email });

            if (res && res.data.success) {
                toast.success("OTP sent to your email.");
                setOtpSent(true); // Enable OTP input after sending OTP
            } else {
                toast.error(res.data.message);
            }
        }catch (error) {
            console.log(error); // Log the full error object for debugging
            
            // Extract the message from the response if it exists, otherwise use a fallback
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
            
            toast.error(errorMessage); // Display the extracted message in the toast
        }
        
    };

    return (
        <Layout title={"Forgot Password"}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>

                    {/* Email Input */}
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>

                    {/* Send OTP Button */}
                    {!otpSent && (
                        <button
                            type="button"
                            className="btn btn-secondary mb-3"
                            onClick={handleSendOtp}
                        >
                            SEND OTP
                        </button>
                    )}

                    {/* OTP Input */}
                    {otpSent && (
                        <>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="form-control"
                                    placeholder="Enter OTP"
                                    required
                                />
                            </div>

                            {/* New Password Input */}
                            <div className="mb-3">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-control"
                                    placeholder="Enter Your New Password"
                                    required
                                />
                            </div>

                            {/* Reset Button */}
                            <button type="submit" className="btn btn-primary">
                                RESET
                            </button>
                        </>
                    )}
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
