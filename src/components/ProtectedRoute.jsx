import { useContext } from 'react';
import { useState, useEffect } from 'react';
import {AppContext} from '../context/AppContext'
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ProtectedDocRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const {checkAuthStatus, isAuthenticated, adminData, setIsAuthenticated} = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuthStatus();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    
    verifyAuth();
  }, [adminData]);

  if (loading) {
    return <Loader size={30} className='text-slate-700 animate-spin mx-auto my-20'/>
  }



  return (
    isAuthenticated 
    ? 
    children 
    : 
    <div className='text-slate-700 text-center my-20 p-2 bg-slate-200 mx-4 text-sm font-medium'>You can't access this website, if you're already logged in, please logout and 
    <span className='text-blue-700 cursor-pointer' onClick={() => navigate("/login")}> Re-login </span>
     with Admin Credentials</div>
  )
};


export default ProtectedDocRoute;