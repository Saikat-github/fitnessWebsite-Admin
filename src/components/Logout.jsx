import React, { useState, useContext } from 'react'
import { LogOut, Loader} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../appwrite/auth'
import { AppContext } from '../context/AppContext'



const Logout = ({className="", setIsOpen}) => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate()
  const {setAdminData, setIsAuthenticated} = useContext(AppContext)

  const onClickHandler = async () => {
    try {
      setLoader(true);
      await authService.logout()
      setAdminData(null)
      setIsAuthenticated(false)
      setIsOpen(false)
      toast.success("You're logged out successfully")
      navigate("/login")
      setLoader(false);
    } catch (error) {
      toast.error("An error occurred while logging out")
    } finally {
      setLoader(false);
    }
  }

  return (
    <button
    onClick={onClickHandler}
    className={` ${className} items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition cursor-pointer`}>
    <LogOut size={20}/> 
    {loader ? <Loader className='animate-spin w-6 h-6' /> : "Logout"}
  </button>
  )
}

export default Logout