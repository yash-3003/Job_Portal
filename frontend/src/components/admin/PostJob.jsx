import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useForm, Controller } from "react-hook-form"

const PostJob = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            requirements: "",
            salary: "",
            location: "",
            jobType: "",
            experience: "",
            position: 0,
            companyId: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleCompanyChange = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        if (selectedCompany) {
            setValue("companyId", selectedCompany._id);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={handleSubmit(onSubmit)} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <h1 className='font-bold text-2xl mb-4'>Post a New Job</h1>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className="mb-2">
                            <Label htmlFor="title" className="block text-sm font-medium mb-1">
                                Job Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                {...register("title", { 
                                    required: "Job title is required" 
                                })}
                                placeholder="Software Engineer"
                                className={`w-full p-2 ${errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="description" className="block text-sm font-medium mb-1">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="description"
                                type="text"
                                {...register("description", { 
                                    required: "Description is required" 
                                })}
                                placeholder="Brief job description"
                                className={`w-full p-2 ${errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="requirements" className="block text-sm font-medium mb-1">
                                Requirements <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="requirements"
                                type="text"
                                {...register("requirements", { 
                                    required: "Requirements are required" 
                                })}
                                placeholder="Job requirements"
                                className={`w-full p-2 ${errors.requirements ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.requirements && (
                                <p className="text-red-500 text-xs mt-1">{errors.requirements.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="salary" className="block text-sm font-medium mb-1">
                                Salary <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="salary"
                                type="text"
                                {...register("salary", { 
                                    required: "Salary is required" 
                                })}
                                placeholder="1LPA"
                                className={`w-full p-2 ${errors.salary ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.salary && (
                                <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="location" className="block text-sm font-medium mb-1">
                                Location <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="location"
                                type="text"
                                {...register("location", { 
                                    required: "Location is required" 
                                })}
                                placeholder="Remote / New York, NY"
                                className={`w-full p-2 ${errors.location ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.location && (
                                <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="jobType" className="block text-sm font-medium mb-1">
                                Job Type <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="jobType"
                                type="text"
                                {...register("jobType", { 
                                    required: "Job type is required" 
                                })}
                                placeholder="Full-time / Part-time / Contract"
                                className={`w-full p-2 ${errors.jobType ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.jobType && (
                                <p className="text-red-500 text-xs mt-1">{errors.jobType.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="experience" className="block text-sm font-medium mb-1">
                                Experience Level <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="experience"
                                type="text"
                                {...register("experience", { 
                                    required: "Experience level is required" 
                                })}
                                placeholder="1yr/2yr"
                                className={`w-full p-2 ${errors.experience ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.experience && (
                                <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="position" className="block text-sm font-medium mb-1">
                                Number of Positions <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="position"
                                type="number"
                                {...register("position", { 
                                    required: "Number of positions is required",
                                    min: {
                                        value: 1,
                                        message: "At least 1 position is required"
                                    }
                                })}
                                placeholder="1"
                                className={`w-full p-2 ${errors.position ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            />
                            {errors.position && (
                                <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
                            )}
                        </div>
                        
                        <div className="mb-2">
                            <Label htmlFor="company" className="block text-sm font-medium mb-1">
                                Company <span className="text-red-500">*</span>
                            </Label>
                            {companies.length > 0 ? (
                                <Controller
                                    name="company"
                                    control={control}
                                    rules={{ required: "Please select a company" }}
                                    render={({ field }) => (
                                        <Select onValueChange={(value) => {
                                            field.onChange(value);
                                            handleCompanyChange(value);
                                        }}>
                                            <SelectTrigger className={`w-full ${errors.company ? "border-red-500" : ""}`}>
                                                <SelectValue placeholder="Select a Company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            ) : (
                                <p className="text-sm text-red-500">No companies available</p>
                            )}
                            {errors.company && (
                                <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
                            )}
                        </div>
                    </div>
                    
                    <Button 
                        type="submit"
                        className="w-full py-2 bg-[#282baa] hover:bg-[#212271] text-white font-medium rounded-md transition-colors mt-6"
                        disabled={loading || companies.length === 0}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </>
                        ) : (
                            "Post New Job"
                        )}
                    </Button>
                    
                    {companies.length === 0 && (
                        <p className='text-xs text-red-600 font-bold text-center my-3'>
                            *Please register a company first, before posting a job
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PostJob