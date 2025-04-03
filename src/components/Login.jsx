import React, { useCallback, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from './Input'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/auth'
import { useMemo } from 'react'
import { toast } from 'react-toastify';
import { Loader, X } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import conf from '../conf/conf'



const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const rootUrl = window.location.origin;
  const resetUrl = useMemo(() => `${rootUrl}/reset-password`, []);
  const { adminData, setAdminData } = useContext(AppContext);

  const { register, handleSubmit, watch, formState: { isSubmitting }, reset } = useForm();
  const navigate = useNavigate();


  //login user handler
  const login = useCallback(async (data) => {
    if (data.email !== conf.appwriteAdminEmail) {
      return toast.warn("You can't access this website, please use admin credentials")
    }
    setLoading(true);
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        authService.getCurrentUser().then((userData) => {
          setAdminData(userData)
          toast.success("You're logged in successfully")
          navigate("/");
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      reset();
    }
  }, [navigate]);


  //forget password logic
  const forgetPassword = useCallback(() => {
    console.log("rootUrl -", rootUrl, "resetUrl -", resetUrl);
    const email = watch("email");
    if (!email) {
      toast.warn("Please enter your email to reset password");
      return;
    }
    setLoading(true);
    authService.sendPasswordRecoveryEmail(email, resetUrl)
      .then(() => toast.success("Password reset link has been sent to your email"))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [watch, resetUrl]);


  return (
    <div
      className='flex justify-center h-screen z-10'
    >
      <div className={`mx-auto w-72 bg-white rounded-lg px-6 animate-[fadeIn_1s] overflow-y-auto my-12 shadow-lg shadow-slate-500 h-2/3`}>

        <h2 className="text-center text-3xl mb-2 text-slate-700">Login</h2>
        <p className="mb-4 text-center text-xs">
          Can't login?&nbsp;
          <a
            href={`tel:+919635473546`}
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Contact Developer
          </a>
        </p>
        {error && <p className="text-red-600 text-center text-xs">{error}</p>}
        <form onSubmit={handleSubmit(login)} className='mt-8'>
          <div className='space-y-6'>
            <Input
              placeholder="Enter your email"
              type="email"
              className="bg-slate-200"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                }
              })}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              className="bg-slate-200"
              {...register("password", {
                required: true,
              })}
            />
            <div className="flex justify-between">
              <button
                className='px-6 py-2 bg-gray-950 text-white 
          rounded-full transition-all duration-300 
          hover:bg-gray-900  flex gap-2 border-2 text-sm cursor-pointer'
                type="submit"
                disabled={isSubmitting}
              >
                {loading ? <Loader className='w-6 animate-spin' /> : "Login"}
              </button>
              <span disabled={loading} className='text-xs hover:underline py-2 cursor-pointer ml-2 sm:ml-0' onClick={() => forgetPassword()}>
                Forget Password?
              </span>
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Login