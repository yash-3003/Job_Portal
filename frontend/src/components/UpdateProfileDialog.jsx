/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      phoneNumber: "",
      bio: "",
      skills: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
      });

      // Set filename if resume exists
      if (user?.profile?.resume) {
        const resumeName = user.profile.resume.split("/").pop();
        setFileName(resumeName || "Current resume");
      }
    }
  }, [user, reset]);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("bio", data.bio);
    formData.append("skills", data.skills);

    if (resumeFile) {
      formData.append("file", resumeFile);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Update Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">
                Name <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="fullname"
                  type="text"
                  {...register("fullname", {
                    required: "Full name is required",
                  })}
                  className={errors.fullname ? "border-red-500" : ""}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="phoneNumber"
                  type="text"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <div className="col-span-3">
                <Input id="bio" type="text" {...register("bio")} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <div className="col-span-3">
                <Input
                  id="skills"
                  type="text"
                  placeholder="HTML, CSS, JavaScript, React"
                  {...register("skills")}
                />
                <p className="text-gray-500 text-xs mt-1">
                  Separate skills with commas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resume" className="text-right">
                Resume
              </Label>
              <div className="col-span-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("resumeInput").click()
                    }
                    className="relative flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                    <input
                      id="resumeInput"
                      type="file"
                      accept="application/pdf"
                      onChange={fileChangeHandler}
                      className="hidden"
                    />
                  </Button>
                  <span className="text-sm text-gray-500 mt-1 sm:mt-0 truncate">
                    {fileName}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1">PDF files only</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#282baa] hover:bg-[#212271] text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
