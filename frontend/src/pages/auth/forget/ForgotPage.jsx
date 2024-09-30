import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';
import toast from 'react-hot-toast'

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";

const ForgotPage = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const { mutate: forgotMutation, isError, isPending, error } = useMutation({
        mutationFn: async (email) => {
            try {
                const res = await axios.post('/api/auth/forgot', { email });
                localStorage.setItem('email', email);
                return res.data;
            } catch (error) {
                console.error(error.response.data.error || error);
                throw new Error(error.response.data.error || "Something went wrong");
            }
        },
        onSuccess: () => {
            toast.success("OTP Sent Successfully");
            navigate('/verify-reset');
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        forgotMutation(email);
    };



    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>Send OTP</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='email'
                            name='email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </label>


                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? "Loading..." : "Generate OTP"}
                    </button>
                    {isError && <p className='text-red-500'>{error.message}</p>}
                </form>
                <div className='flex flex-col gap-2 mt-4'>
                    <Link to='/login'>
                        <button className='hover:text-blue-400 font-bold rounded-full  w-full'>Sign In</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default ForgotPage;