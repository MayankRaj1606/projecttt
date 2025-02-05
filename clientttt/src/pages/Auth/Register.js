import React, { useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const navigate = useNavigate();

    // Send OTP function
    const sendOtp = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/send-otp`, { email });
            if (res.data.success) {
                toast.success('OTP sent to your email.');
                setIsOtpSent(true);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error); // Log the full error object for debugging
            
            // Extract the message from the response if it exists, otherwise use a fallback
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
            
            toast.error(errorMessage); // Display the extracted message in the toast
        }
        
    };

    // Form submission with OTP verification
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOtpSent) {
            sendOtp();
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name, email, password, phone, address, answer, otp
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout title={'Register'}>
            <div className='form-container'>
                <h1> Register </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder='Enter Your Name'
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder='Enter Your Email'
                            required
                            disabled={isOtpSent}
                        />
                    </div>
                    {!isOtpSent && (
                        <button type="button" className="btn btn-secondary" onClick={sendOtp}>Send OTP</button>
                    )}

                    {isOtpSent && (
                        <>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="form-control"
                                    placeholder='Enter OTP'
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    placeholder='Enter Password'
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="form-control"
                                    placeholder='Enter Your Number'
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="form-control"
                                    placeholder='Enter Your Address'
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="form-control"
                                    placeholder='Your Favourite Sport Name'
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </>
                    )}
                </form>
            </div>
        </Layout>
    );
};

export default Register;
