"use client";
import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { contextApp } from "@/context";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import Config from "../components/template/config/config";
import FormLogin from "../components/Organisms/admin/login";
import Details from "../components/Organisms/details/details";
import toast, { Toaster } from "react-hot-toast";

interface Applicant {
  id: number;
  email: string;
  name: string;
  score: number;
  job: string;
  company: string;
  created_at: string;
  filepath: string;
}

const AdminPage = () => {
  const { isLogin, setDetailsUser, DetailsUser, ConfigRequirement } =
    useContext(contextApp);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
    new Set()
  );
  const [Data, setData] = useState<Applicant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  // const { toast } = useToast();

  const FetchData = async () => {
    toast.loading("Fetching applicants data...");
    const res = await fetch(`/api/GetUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, error } = await res.json();
    if (error) {
      toast.dismiss();
      toast.error("Error fetching data: " + error.message);
      // toast({
      //   title: "Error fetching data",
      //   description: "There was an error fetching the applicants data.",
      //   variant: "destructive",
      // });
    }
    if (data) {
      toast.dismiss();
      const formattedData = data.map((applicant: any) => ({
        id: applicant.id,
        email: applicant.email,
        created_at: applicant.created_at,
        name: applicant.name,
        job: applicant.job,
        company: applicant.company,
        score: applicant.score,
        filepath: applicant.filepath,
      }));
      setData(formattedData);
    }
  };

  useEffect(() => {
    console.log(selectedApplicants);
  }, [selectedApplicants]);

  useEffect(() => {
    FetchData();
  }, []);
  const toggleSelectApplicant = (id: string) => {
    const newSelected = new Set(selectedApplicants);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplicants(newSelected);
  };

  const selectAll = () => {
    if (selectedApplicants.size === Data.length) {
      // Deselect all
      setSelectedApplicants(new Set());
    } else {
      // Select all
      setSelectedApplicants(new Set(Data.map((app) => String(app.id))));
    }
  };

  const handleAcceptSelected = async () => {
    toast.loading("Processing selected applicants...");
    if (selectedApplicants.size === 0) {
      // toast({
      //   title: "No applicants selected",
      //   description: "Please select at least one applicant to process.",
      //   variant: "destructive",
      // });
      toast.dismiss();
      toast.error("Please select at least one applicant to process.");
      return;
    }

    setIsProcessing(true);

    try {
      toast.dismiss();
      toast.loading("Sending emails to applicants...");
      // Menyiapkan data yang dipilih (terima dan tolak)
      const acceptedEmails = Data.filter((app) =>
        selectedApplicants.has(String(app.id))
      ).map((app) => ({
        email: app.email,
        name: app.name,
        job: app.job,
        company: app.company,
        link: app.filepath, // Misalnya, file path adalah link yang diambil dari Data
        jobrequirement: app.job, // Misalnya, job requirement diambil dari Data
        decision: "accept", // Keputusan diterima
      }));

      const rejectedEmails = Data.filter(
        (app) => !selectedApplicants.has(String(app.id))
      ).map((app) => ({
        email: app.email,
        name: app.name,
        job: app.job,
        company: app.company,
        link: app.filepath,
        jobrequirement: app.job,
        decision: "reject", // Keputusan ditolak
      }));
      // Kirim request ke /api/feedback untuk mendapatkan data draft email
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptedEmails: acceptedEmails.map((app) => ({
            job: app.job, // Mengirimkan job yang dilamar
            requirement: ConfigRequirement.find((data) => data.job === app.job)
              ?.req,
            link: app.link, // Mengirimkan link terkait
            decision: app.decision, // Mengirimkan keputusan (accept/reject)
          })),
          rejectedEmails: rejectedEmails.map((app) => ({
            job: app.job,
            requirement: ConfigRequirement.find((data) => data.job === app.job)
              ?.req,
            link: app.link,
            decision: app.decision,
          })),
        }),
      });

      const result = await res.json();

      if (res.status !== 200 || !result.results) {
        throw new Error("Failed to get feedback data.");
      }

      // Parsing feedback dari hasil /api/feedback
      const feedbackMap = result.results.reduce((map: any, feedback: any) => {
        const answer = feedback.answer;
        const emailMatch = answer.match(/email=([^\n]+)/);
        const feedbackMatch = answer.match(/feedback=([\s\S]+)/);

        if (emailMatch && feedbackMatch) {
          const email = emailMatch[1].trim();
          const feedbackText = feedbackMatch[1].trim();
          map[email] = feedbackText;
        }

        return map;
      }, {});

      // Tambahkan feedback ke acceptedEmails dan rejectedEmails
      const enrichedAcceptedEmails = acceptedEmails.map((app) => ({
        ...app,
        feedback:
          feedbackMap[app.email] ||
          "Thank you for applying. We appreciate your effort.", // Tambahkan feedback jika ada, atau gunakan default
      }));

      const enrichedRejectedEmails = rejectedEmails.map((app) => ({
        ...app,
        feedback:
          feedbackMap[app.email] ||
          "We regret to inform you that your application was not successful. Thank you for your interest.", // Tambahkan feedback jika ada, atau gunakan default
      }));

      // Kirim email setelah menerima data feedback
      const emailRes = await fetch("/api/sendEmails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptedEmails: enrichedAcceptedEmails,
          rejectedEmails: enrichedRejectedEmails,
        }),
      });

      const emailResult = await emailRes.json();

      if (!emailResult.success) {
        throw new Error("Email sending failed.");
      }
      toast.dismiss();
      toast.success("Emails sent successfully!");
      // toast({
      //   title: "Applicants processed successfully",
      //   description: `${acceptedEmails.length} accepted, ${rejectedEmails.length} rejected. Emails sent.`,
      // });
      // Use original Applicant objects for deletion
      const acceptedApplicants = Data.filter((app) =>
        selectedApplicants.has(String(app.id))
      );
      const rejectedApplicants = Data.filter(
        (app) => !selectedApplicants.has(String(app.id))
      );
      deleteData(acceptedApplicants, rejectedApplicants);
      setSelectedApplicants(new Set());
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Failed to send emails. Please try again.");
      // toast({
      //   title: "Error processing applicants",
      //   description: "Failed to send emails. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteData = async (
    acceptedEmails: Applicant[],
    rejectedEmails: Applicant[]
  ) => {
    const res = await fetch("/api/DeleteData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acceptedEmails,
        rejectedEmails,
      }),
    });
    const data = await res.json();
    console.log(data);
    // Refresh data after deletion
    FetchData();
  };

  return (
    <>
      <Toaster position="top-right" />
      {DetailsUser.show && <Details />}
      {isLogin ? (
        <section>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="w-full bg-primary bg-blue-500 text-white py-6 shadow-md">
              <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-center">
                  Admin Dashboard
                </h1>
                <p className="text-center text-primary-foreground/80">
                  Manage Job Applications
                </p>
              </div>
            </header>

            <Config />

            <main className="flex-1 container mx-auto px-4 py-12">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Applicants</h2>
                  <Button
                    onClick={handleAcceptSelected}
                    disabled={selectedApplicants.size === 0 || isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : "Process Selected Applicants"}
                  </Button>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedApplicants.size === Data.length &&
                              Data.length > 0
                            }
                            onCheckedChange={selectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Completion</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead className="w-20">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Data.map((applicant, index) => (
                        <TableRow key={applicant.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedApplicants.has(
                                String(applicant.id)
                              )}
                              onCheckedChange={() =>
                                toggleSelectApplicant(String(applicant.id))
                              }
                              aria-label={`Select ${applicant.name}`}
                            />
                          </TableCell>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {applicant.name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {applicant.job}
                          </TableCell>
                          <TableCell className="font-medium">
                            {applicant.company}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(applicant.created_at)} ago
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-500 h-2.5 rounded-full"
                                  style={{ width: `${applicant.score}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {applicant.score}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {applicant.filepath.split("/").pop()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  toggleSelectApplicant(String(applicant.id))
                                }
                              >
                                {selectedApplicants.has(String(applicant.id))
                                  ? "Unselect"
                                  : "Select"}
                              </Button>
                              <Button
                                onClick={() =>
                                  setDetailsUser({
                                    email: applicant.email,
                                    show: true,
                                  })
                                }
                              >
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </main>

            <footer className="bg-gray-100 py-6">
              <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                <p>© 2025 Career Portal. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </section>
      ) : (
        <section className="flex justify-center items-center w-full h-dvh">
          <FormLogin />
        </section>
      )}
    </>
  );
};

export default AdminPage;
