import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import { useForm } from "react-hook-form";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      website: "",
      location: "",
    },
  });

  useEffect(() => {
    if (singleCompany) {
      reset({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
      });
      // If company had a logo, you could set the file name here
      if (singleCompany.logo) {
        setFileName(singleCompany.logo.split("/").pop() || "Current logo");
      }
    }
  }, [singleCompany, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("website", data.website);
    formData.append("location", data.location);
    if (logoFile) {
      formData.append("file", logoFile);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setFileName(file.name);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-2/3 lg:w-1/2 border border-gray-200 rounded-md p-6 my-10 shadow-sm"
        >
          <div className="flex items-center gap-5 mb-6">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
              type="button"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>

          <div className="mb-4">
            <Label htmlFor="name" className="block text-sm font-medium mb-1">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name", {
                required: "Company name is required",
              })}
              placeholder="Company Name"
              className={`w-full p-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <Label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </Label>
            <Input
              id="description"
              type="text"
              {...register("description")}
              placeholder="Company Description"
              className="w-full p-2 border-gray-300 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="website" className="block text-sm font-medium mb-1">
              Website
            </Label>
            <Input
              id="website"
              type="text"
              {...register("website", {
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid website URL",
                },
              })}
              placeholder="https://example.com"
              className={`w-full p-2 ${
                errors.website
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.website && (
              <p className="text-red-500 text-xs mt-1">
                {errors.website.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <Label
              htmlFor="location"
              className="block text-sm font-medium mb-1"
            >
              Location
            </Label>
            <Input
              id="location"
              type="text"
              {...register("location")}
              placeholder="Company Location"
              className="w-full p-2 border-gray-300 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="logo" className="block text-sm font-medium mb-1">
              Company Logo
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("logoInput").click()}
                className="relative flex items-center px-4 py-2 border-gray-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
                <input
                  id="logoInput"
                  type="file"
                  accept="image/*"
                  onChange={fileChangeHandler}
                  className="hidden"
                />
              </Button>
              <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                {fileName}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-2 bg-[#282baa] hover:bg-[#212271] text-white font-medium rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Update Company"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
