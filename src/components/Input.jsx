import React from 'react'
import { useId } from 'react';

const Input = ({ label, type = "text", className = "", ...props }, ref) => {
    
    const id = useId();
    
    return (
        <div className='w-full'>
            {label && <label
                className='inline-block mb-1 pl-1 text-sm'
                htmlFor={id}>
                {label}
            </label>
            }
            <input
                type={type}
                className={`px-3 py-3 text-sm bg-gray-900 outline-none duration-200  w-full ${className} focus:outline-none focus:ring-1 focus:ring-blue-900 focus:shadow-lg rounded-lg`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    )
}

export default React.forwardRef(Input);