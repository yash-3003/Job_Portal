import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        // Clear error for this field when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    }

    const validateForm = () => {
        const newErrors = {};
        
        if (!input.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(input.email)) {
            newErrors.email = "Email is invalid";
        }
        
        if (!input.password) {
            newErrors.password = "Password is required";
        }
        
        if (!input.role) {
            newErrors.role = "Please select a role";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form 
                    onSubmit={submitHandler} 
                    className='w-full md:w-2/3 lg:w-1/2 border border-gray-200 rounded-md p-6 my-10 shadow-sm'
                >
                    <h1 className='font-bold text-2xl mb-4'>Login</h1>
                    <div className='mb-4'>
                        <Label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="abc@gmail.com"
                            className={`w-full p-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className='mb-4'>
                        <Label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Password"
                            className={`w-full p-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>
                    
                    <div className='mb-6'>
                        <Label className="block text-sm font-medium mb-2">
                            Role <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="student"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                />
                                <Label htmlFor="student" className="ml-2 text-sm">Student</Label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="recruiter"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                />
                                <Label htmlFor="recruiter" className="ml-2 text-sm">Recruiter</Label>
                            </div>
                        </div>
                        {errors.role && (
                            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                        )}
                    </div>
                    
                    <Button 
                        type="submit"
                        className="w-full py-2 bg-[#282baa] hover:bg-[#212271] text-white font-medium rounded-md transition-colors"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>
                    
                    <div className="text-center mt-4">
                        <span className='text-sm'>
                            Don't have an account? {" "}
                            <Link to="/signup" className='text-blue-600 hover:text-blue-800 font-medium'>
                                Signup
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;