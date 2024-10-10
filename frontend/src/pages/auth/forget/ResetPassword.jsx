import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';
import toast from 'react-hot-toast'

import XSvg from "../../../components/svgs/X";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdKey, MdPassword } from "react-icons/md";

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        OTP: "",
        newPassword: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);


    const { mutate: resetMutation, isError, isPending, error } = useMutation({
        mutationFn: async ({ OTP, newPassword }) => {
            try {
                const email = localStorage.getItem('email');
                const res = await axios.post('/api/auth/verify-reset', { email, OTP, newPassword });
                localStorage.removeItem('email');
                return res.data;
            } catch (error) {
                console.error(error.response.data.error || error);
                throw new Error(error.response.data.error || "Something went wrong");
            }
        },
        onSuccess: () => {
            toast.success("Password changed successfully")
            navigate('/login')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        resetMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState)
    }

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>Reset Password </h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdKey />
                        <input
                            type='text'
                            className='grow'
                            placeholder='OTP'
                            name='OTP'
                            onChange={handleInputChange}
                            value={formData.OTP}
                            required
                        />
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='grow'
                            placeholder='New Password'
                            name='newPassword'
                            onChange={handleInputChange}
                            value={formData.newPassword}
                            required
                            minLength='6'
                        />
                        {
                            showPassword
                                ? <IoMdEyeOff onClick={toggleShowPassword} />
                                : <IoMdEye onClick={toggleShowPassword} />
                        }
                    </label>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='grow'
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            onChange={handleInputChange}
                            value={formData.confirmPassword}
                            required
                            minLength='6'
                        />
                        {
                            showPassword
                                ? <IoMdEyeOff onClick={toggleShowPassword} />
                                : <IoMdEye onClick={toggleShowPassword} />
                        }
                    </label>
                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? "Loading..." : "Verify & Change Password"}
                    </button>
                    {isError && <p className='text-red-500 text-center'>{error.message}</p>}
                </form>
                <div className='flex flex-col gap-2 mt-4'>
                    <Link to='/login'>
                        <button className='hover:text-blue-400 font-bold rounded-full w-full'>Sign In</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default ResetPassword;