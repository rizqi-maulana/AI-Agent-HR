"use client";

import React, { createContext, useEffect, useState } from "react";
import Loading from "./app/components/template/loading";
export const contextApp = createContext<{
  name: string;
  email: string;
  phone: string;
  fileName: string;
  score: number;
  isLogin: boolean;
  currentTitle: string;
  company: string;
  experienceYears: string;
  DetailsUser: Details;
  skills: string;
  coverLetter: string;
  ConfigCompany: string[];
  ConfigJob: string[];
  ConfigRequirement: RequirementProps[];
  Logo: string;
  isSuccess: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setDetailsUser: React.Dispatch<React.SetStateAction<Details>>;
  setisLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setisSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
  setExperienceYears: React.Dispatch<React.SetStateAction<string>>;
  setSkills: React.Dispatch<React.SetStateAction<string>>;
  setCoverLetter: React.Dispatch<React.SetStateAction<string>>;
}>({
  ConfigCompany: [],
  DetailsUser: {
    email: "",
    show: false,
  },
  ConfigJob: [],
  ConfigRequirement: [],
  Logo: "",
  isLogin: false,
  name: "",
  email: "",
  phone: "",
  fileName: "",
  score: 0,
  currentTitle: "",
  company: "",
  experienceYears: "",
  skills: "",
  coverLetter: "",
  isLoading: true,
  isSuccess: true,
  setisLogin: () => {},
  setisSuccess: () => {},
  setName: () => {},
  setDetailsUser: () => {},
  setEmail: () => {},
  setPhone: () => {},
  setFileName: () => {},
  setScore: () => {},
  setCurrentTitle: () => {},
  setCompany: () => {},
  setExperienceYears: () => {},
  setSkills: () => {},
  setCoverLetter: () => {},
  setIsLoading: () => {},
});

// interface UserDetails {

// }

interface RequirementProps {
  job: string;
  req: string;
}

interface Details {
  email: string;
  show: boolean;
}

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLogin, setisLogin] = useState(false);
  const [fileName, setFileName] = useState("");
  const [score, setScore] = useState(0);
  const [currentTitle, setCurrentTitle] = useState("");
  const [company, setCompany] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [skills, setSkills] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [LoadingStats, setLoadingStats] = useState<boolean>(true);
  const [isSuccess, setisSuccess] = useState<boolean>(true);
  const [ConfigCompany, setConfigCompany] = useState<string[]>([]);
  const [DetailsUser, setDetailsUser] = useState<Details>({
    email: "",
    show: false,
  });
  const [ConfigJob, setConfigJob] = useState<string[]>([]);
  const [Logo, setLogo] = useState<string>("");
  const [ConfigRequirement, setConfigRequirement] = useState<
    RequirementProps[]
  >([]);

  useEffect(() => {
    const FetchConfig = async () => {
      const res = await fetch("/api/Config", {
        method: "GET",
      });
      const data = await res.json();
      setConfigRequirement(data.data[0].requirement.data);
      setConfigCompany(data.data[0].company.data);
      setConfigJob(data.data[0].job.data);
      setLogo(data.data[0].logo);
    };
    const CheckLogin = async () => {
      try {
        if (typeof window !== "undefined") {
          if (localStorage.getItem("login") === "true") {
            setisLogin(true);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoadingStats(false);
        }, 2000);
      }
    };
    CheckLogin();
    FetchConfig();
  }, []);

  return (
    <contextApp.Provider
      value={{
        ConfigCompany,
        isSuccess,
        ConfigJob,
        DetailsUser,
        ConfigRequirement,
        Logo,
        name,
        isLogin,
        email,
        phone,
        fileName,
        score,
        currentTitle,
        company,
        experienceYears,
        skills,
        coverLetter,
        setisLogin,
        setName,
        setEmail,
        setPhone,
        setisSuccess,
        setFileName,
        setDetailsUser,
        setScore,
        setCurrentTitle,
        setCompany,
        setExperienceYears,
        setSkills,
        setCoverLetter,
        isLoading,
        setIsLoading,
      }}
    >
      {LoadingStats && <Loading />}
      {children}
    </contextApp.Provider>
  );
};

export default ContextProvider;
