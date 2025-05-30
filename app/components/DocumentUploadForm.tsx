"use client";

import React, { useCallback, useState, useContext } from "react";
import { Button } from "@/app/components/ui/button";
import { contextApp } from "@/context";
import toast, { Toaster } from "react-hot-toast";
import { FileUp, File, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface DocumentUploadFormProps {
  onSubmit: (file: File | null) => void;
  onBack: () => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  onSubmit,
  onBack,
}) => {
  // const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };
  const {
    name,
    email,
    score,
    currentTitle,
    setIsLoading,
    company,
    ConfigRequirement,
    setisSuccess,
  } = useContext(contextApp);

  const validateAndSetFile = (selectedFile: File | null) => {
    toast.loading("Validating file...");
    if (!selectedFile) return;

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.dismiss();
      toast.error("Invalid file type. Please upload a PDF or Word document.");
      // toast({
      //   title: "Invalid file type",
      //   description: "Please upload a PDF or Word document",
      //   variant: "destructive",
      // });
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      toast.dismiss();
      toast.error("File too large. Maximum file size is 5MB.");
      // toast({
      //   title: "File too large",
      //   description: "Maximum file size is 5MB",
      //   variant: "destructive",
      // });
      return;
    }

    setFile(selectedFile);
    toast.dismiss();
    toast.success(
      `Selected file: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`
    );
    // toast({
    //   title: "File uploaded",
    //   description: `${selectedFile.name} has been added to your application`,
    // });
  };

  const GetFileUrl = async (filename: string) => {
    const res = await fetch("/api/GetFileUrl", {
      method: "POST",
      body: JSON.stringify({ filename }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, error } = await res.json();
    if (error) {
      toast.error(error);
      // toast({
      //   title: "Error",
      //   description: error.message,
      //   variant: "destructive",
      // });
    }
    FilterCV(data.publicUrl);
  };

  const FilterCV = async (link: string) => {
    try {
      const formdata = new FormData();
      formdata.append("link", link);
      const matched = ConfigRequirement.find(
        (data) => data.job === currentTitle
      );
      formdata.append("job_requirement", matched ? matched.req : "");
      const res = await fetch("/api/FilterCv", {
        method: "POST",
        body: formdata,
      });
      const { data } = await res.json();
      if (res.status === 200) {
        const parsedAnswer = await JSON.parse(data.answer);
        const fitScore = await parsedAnswer.fit_score;
        const breakdown = await parsedAnswer.breakdown;
        await uploadData(fitScore, link, breakdown);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while processing your CV");
      setisSuccess(false);
      setIsLoading(false);
      // toast({
      //   title: "Error",
      //   description: "An error occurred while processing your CV",
      //   variant: "destructive",
      // });
    }
  };

  const UploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    const response = await fetch("/api/UploadDoc", {
      method: "POST",
      body: formData,
    });
    const { error } = await response.json();

    if (response.status === 200) {
      GetFileUrl(file.name);
      toast.dismiss();
      toast.success(
        `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      );
      // toast({
      //   title: "File uploaded",
      //   description: `${file.name} has been added to your application`,
      // });
    } else
      // toast({
      //   title: "Upload failed",
      //   description: error.message,
      //   variant: "destructive",
      // });
      console.error("Upload failed:", error);
    //   toast.dismiss();
    // toast.error(`Upload failed: ${error}`);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!file) {
        toast.dismiss();
        toast.error("Please upload your CV/resume");
        // toast({
        //   title: "Missing document",
        //   description: "Please upload your CV/resume",
        //   variant: "destructive",
        // });
        return;
      }
      onSubmit(file);
      UploadFile(file);
    },
    [file, onSubmit]
  );

  const uploadData = useCallback(
    async (score: number, link: string, breakdown: Array<string>[]) => {
      try {
        setIsLoading(true);
        // const formdata = new FormData();
        // formdata.append("name", name);
        // formdata.append("email", email);
        // formdata.append("score", score.toString());
        // formdata.append("filepath", link);
        // formdata.append("job", currentTitle);
        // formdata.append("company", company);
        // formdata.append("breakdown", breakdown);

        const res = await fetch("/api/CreateData", {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            score: score.toString(),
            filepath: link,
            job: currentTitle,
            company,
            breakdown,
          }),
        });
        const { error } = await res.json();
        if (error) {
          toast.dismiss();
          toast.error(error.message);
          // toast({
          //   title: "Error",
          //   description: error.message,
          //   variant: "destructive",
          // });
        } else {
          toast.dismiss();
          toast.success("Your data has been submitted successfully");
          // toast({
          //   title: "Data uploaded",
          //   description: "Your data has been uploaded successfully",
          // });
        }
      } catch (error) {
        toast.dismiss();

        toast.error("An error occurred while uploading data");
        // toast({
        //   title: "Error",
        //   description: "An error occurred while uploading data",
        //   variant: "destructive",
        // });
      } finally {
        setIsLoading(false);
      }
    },
    [name, email, score]
  );

  const removeFile = () => {
    setFile(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in-50">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium">Upload your CV/Resume</h3>
            <p className="text-sm text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX (Max: 5MB)
            </p>
          </div>

          {!file ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50",
                "flex flex-col items-center justify-center gap-4"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <FileUp className="h-12 w-12 text-muted-foreground/70" />
              <div>
                <p className="font-medium mb-1">
                  Drag and drop your file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Your CV/resume helps us understand your experience better
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Important:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Make sure your CV is up-to-date</li>
              <li>Include relevant experience and skills for this position</li>
              <li>
                Check that contact information on your resume matches your
                application
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Submit Application</Button>
        </div>
      </form>
    </>
  );
};

export default DocumentUploadForm;
