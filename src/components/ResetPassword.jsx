import React, { useState } from 'react'
import authService from '../appwrite/auth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const query = new URLSearchParams(useLocation().search);
  const userId = query.get('userId');
  const secret = query.get('secret');
  const { register, handleSubmit, formState: {isSubmitting} } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);



  const submitHandler = async (data) => {
    try {
      await authService.resetPassword(userId, secret, data.newPassword)
      toast.success("Password Reset Successful");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div
      className='flex justify-center items-center h-screen z-10 bg-[#00000090]'
    >
      <div className={`mx-auto mb-32 w-full max-w-lg h-1/2 bg-gray-200 rounded-sm px-10 border border-black/10 animate-[fadeIn_1s] overflow-y-auto `}>
        <h2 className="text-center font-semibold text-3xl leading-tight my-6 text-slate-800">Reset Password</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-10'>
          <input className={`px-4 py-2 text-sm bg-white text-black outline-none focus:bg-gray-50 duration-200 border-2 border-gray-300 w-full focus:outline-none focus:ring-1 focus:ring-blue-700 focus:shadow-lg `} type="password" placeholder='New Password'  {...register("newPassword", { required: true })} />

          <button className={`cursor-pointer py-2 px-6 bg-slate-600 text-white hover:bg-slate-700 transition duration-300 $`} type='submit' disabled={isSubmitting}>{isSubmitting ? <Loader className='w-6 animate-spin mx-auto'/> : "Reset Password"}</button>
        </form>

      </div>
    </div>

  )
}

export default ResetPassword