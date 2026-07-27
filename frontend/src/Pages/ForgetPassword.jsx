import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import logo from "../assets/youtube.png" // <-- your PlayTube/YouTube logo
import axios from 'axios'
import { serverUrl } from '../App'
import { showCustomAlert } from '../component/CustomAlert'

function ForgetPassword() {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [conPassword, setConPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const sendOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/sendotp" , {email} , {withCredentials:true})
            console.log(result.data)
            setLoading(false)
            setStep(2)
            showCustomAlert(result.data.message)

        } catch (error) {
            console.log(error)
            showCustomAlert(error.response.data.message)
            setLoading(false)
        }
        
     }

     // step 2
     const verifyOTP = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/verifyotp",{email , otp} , {withCredentials:true})
            console.log(result.data)
            setLoading(false)
            setStep(3)
            showCustomAlert(result.data.message) 

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
            setLoading(false)
        }
     }

     // step 3

     const resetPassword = async () => {
        setLoading(true)
        try {
            if(newPassword !== conPassword){
                setLoading(false)
                return showCustomAlert("Password is not matched")
            
            }
            
            const result = await axios.post(serverUrl + "/api/auth/resetpassword" , {email , password:newPassword} ,{withCredentials:true})
             console.log(result.data)
            setLoading(false)
            navigate("/signin")
            showCustomAlert(result.data.message) 

        } catch (error) {
              console.log(error)
            showCustomAlert(error.response.data.message)
            setLoading(false)
        }
     }


    return (
        <div className="min-h-screen flex flex-col bg-[#202124] text-white">
            
            {/* HEADER */}
            <header className="flex items-center gap-2 p-4 border-b border-gray-700">
                <img src={logo} alt="PlayTube" className="w-8 h-8" />
                <span className="text-xl font-bold">PlayTube</span>
            </header>

            {/* CONTENT AREA */}
            <div className="flex flex-1 items-center justify-center px-4">
                {/* Step 1 */}
                {step === 1 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-6">Forgot your password?</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="email" className="block text-sm mb-1 text-gray-300">
                                    Enter your email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="you@example.com"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 px-4 rounded-md font-medium" disabled={loading} onClick={sendOtp}>
                                {loading ? <ClipLoader size={24} color="white" /> : "Send OTP"}
                            </button>
                        </form>
                        <div
                            className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
                            onClick={() => navigate("/signin")}
                        >
                            Back to Signin
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-6">Enter OTP</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="otp" className="block text-sm mb-1 text-gray-300">
                                    Please enter the 4-digit code sent to your email.
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="* * * *"
                                    required
                                    onChange={(e) => setOtp(e.target.value)}
                                    value={otp}
                                />
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 px-4 rounded-md font-medium" disabled={loading} onClick={verifyOTP}>
                                {loading ? <ClipLoader size={24} color="white" /> : "Verify OTP"}
                            </button>
                        </form>
                        <div
                            className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
                            onClick={() => navigate("/signin")}
                        >
                            Back to Signin
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-2">Reset Your Password</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Enter a new password below to regain access to your account.
                        </p>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label htmlFor="password" className="block text-sm mb-1 text-gray-300">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    type="text"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="**********"
                                    required
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                />
                            </div>
                            <div>
                                <label htmlFor="conpassword" className="block text-sm mb-1 text-gray-300">
                                    Confirm Password
                                </label>
                                <input
                                    id="conpassword"
                                    type="text"
                                    className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="**********"
                                    required
                                    onChange={(e) => setConPassword(e.target.value)}
                                    value={conPassword}
                                />
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 px-4 rounded-md font-medium" disabled={loading} onClick={resetPassword}>
                                {loading ? <ClipLoader size={24} color="white" /> : "Reset Password"}
                            </button>
                        </form>
                        <div
                            className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
                            onClick={() => navigate("/signin")}
                        >
                            Back to Signin
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgetPassword