import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search, ExternalLink } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScDjGZD5YxOWK4FA9cOM70R3_tjRNwxPmAyl_V0TV11XYBilA/viewform";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  const openGoogleForm = () => {
    window.open(formUrl, "_blank");
    setIsPopupOpen(false);
  };

  return (
    <div className="text-center font-serif p-20">
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete our Survey</DialogTitle>
            <DialogDescription>
              We value your feedback to improve our services. Please take a
              moment to complete our quick survey.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              onClick={openGoogleForm}
              className="bg-[#282baa] hover:bg-[#1d1f7d] flex items-center gap-2"
            >
              Take Survey <ExternalLink className="h-4 w-4" />
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Maybe Later</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-5 my-10">
        <h1 className="text-5xl font-bold">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-[#282baa]">Dream Jobs</span>
        </h1>
        <p>
          Find and apply for opportunities that match your skills and career
          goals. Thousands of companies are looking for talented professionals
          just like you.
        </p>
        <div className="flex w-full md:w-3/4 lg:w-2/5 shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Find your dream jobs"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full"
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-r-full bg-[#282baa]"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
