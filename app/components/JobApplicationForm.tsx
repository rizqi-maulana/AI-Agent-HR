"use client";

import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { contextApp } from "@/context";
import PersonalInfoForm, { PersonalInfoValues } from "./PersonalInfoForm";
import ExperienceForm, { ExperienceValues } from "./ExperienceForm";
import DocumentUploadForm from "./DocumentUploadForm";
import SuccessMessage from "./SuccessMessage";
import ApplicationSteps from "./ApplicationSteps";
// import { useToast } from "@/app/components/ui/use-toast";
import toast, { Toaster } from "react-hot-toast";
interface FormData {
  personalInfo: PersonalInfoValues;
  experienceInfo: ExperienceValues;
  document: File | null;
}

const JobApplicationForm: React.FC = () => {
  // const { toast } = useToast();
  const { setIsLoading, isSuccess } = useContext(contextApp);
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    experienceInfo: {
      currentTitle: "",
      company: "",
      experienceYears: "",
      skills: "",
      coverLetter: "",
    },
    document: null,
  });

  const steps = ["Personal Info", "Experience", "Documents"];

  const handlePersonalInfoSubmit = (data: PersonalInfoValues) => {
    setFormData({ ...formData, personalInfo: data });
    setStep(1);
  };

  const handleExperienceSubmit = (data: ExperienceValues) => {
    setFormData({ ...formData, experienceInfo: data });
    setStep(2);
  };

  const handleDocumentSubmit = (file: File | null) => {
    if (!file) {
      toast.error("Please upload your CV/resume");
      // toast({
      //   title: "Missing document",
      //   description: "Please upload your CV/resume",
      //   variant: "destructive",
      // });
      return;
    }

    setFormData({ ...formData, document: file });

    // In a real application, you would submit the form data to your backend here
    console.log("Form submitted:", {
      personalInfo: formData.personalInfo,
      experienceInfo: formData.experienceInfo,
      documentName: file.name,
      documentSize: file.size,
    });

    // Show success state
    setStep(3);
  };

  const resetForm = () => {
    setStep(0);
    setIsLoading(true);
    setFormData({
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      experienceInfo: {
        currentTitle: "",
        company: "",
        experienceYears: "",
        skills: "",
        coverLetter: "",
      },
      document: null,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm
            onSubmit={handlePersonalInfoSubmit}
            defaultValues={formData.personalInfo}
          />
        );
      case 1:
        return (
          <ExperienceForm
            onSubmit={handleExperienceSubmit}
            onBack={() => setStep(0)}
            defaultValues={formData.experienceInfo}
          />
        );
      case 2:
        return (
          <DocumentUploadForm
            onSubmit={handleDocumentSubmit}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return <SuccessMessage onReset={resetForm} isSuccess={isSuccess} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full max-w-3xl ">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">
              Job Application Form
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-8">
            {step < 3 && <ApplicationSteps currentStep={step} steps={steps} />}
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default JobApplicationForm;
