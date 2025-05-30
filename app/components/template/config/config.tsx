import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { contextApp } from "@/context";

const Config = () => {
  const { ConfigCompany, ConfigJob, ConfigRequirement, Logo } =
    useContext(contextApp);
  const [companies, setCompanies] = useState<string[]>([""]);
  const [jobs, setJobs] = useState<string[]>([""]);
  const [ImageUrl, setImageUrl] = useState<string>("");
  const [requirements, setRequirements] = useState<
    { job: string; req: string }[]
  >([{ job: "", req: "" }]);
  const [image, setImage] = useState<File | null>(null);

  const [isUpdate, setIsUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ConfigCompany && ConfigCompany.length > 0) {
      setCompanies(ConfigCompany);
      setIsUpdate(true);
    }
    if (ConfigJob && ConfigJob.length > 0) setJobs(ConfigJob);
    if (Logo) setImageUrl(Logo);
    if (ConfigRequirement && ConfigRequirement.length > 0)
      setRequirements(ConfigRequirement);
  }, [ConfigCompany, ConfigJob, ConfigRequirement, Logo]);

  const handleCompanyChange = (idx: number, value: string) => {
    const updated = [...companies];
    updated[idx] = value;
    setCompanies(updated);
  };

  const addCompany = () => setCompanies([...companies, ""]);
  const removeCompany = (idx: number) => {
    if (companies.length === 1) return;
    setCompanies(companies.filter((_, i) => i !== idx));
  };

  const handleJobChange = (idx: number, value: string) => {
    const updated = [...jobs];
    updated[idx] = value;
    setJobs(updated);
  };

  const addJob = () => setJobs([...jobs, ""]);
  const removeJob = (idx: number) => {
    if (jobs.length === 1) return;
    setJobs(jobs.filter((_, i) => i !== idx));
  };

  const handleRequirementChange = (
    idx: number,
    key: "job" | "req",
    value: string
  ) => {
    const updated = [...requirements];
    updated[idx][key] = value;
    setRequirements(updated);
  };

  const addRequirement = () =>
    setRequirements([...requirements, { job: "", req: "" }]);
  const removeRequirement = (idx: number) => {
    if (requirements.length === 1) return;
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const GetFileUrl = async () => {
    const res = await fetch("/api/GetLogoUrl", {
      method: "POST",
      body: JSON.stringify({ filename: "logo.png" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data, error } = await res.json();
    if (error) {
      console.log(error);
    }
    data && setImageUrl(data.publicUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Kirim gambar jika ada
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const res = await fetch("/api/UploadLogo", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error("Upload logo failed");
        }
        const result = await res.json();
        await GetFileUrl();
        console.log("Logo uploaded:", result);
      } catch (err) {
        console.error("Error uploading logo:", err);
      }
    }

    const companyJson = {
      data: companies.filter((c) => c.trim() !== ""),
    };

    const jobJson = {
      data: jobs.filter((j) => j.trim() !== ""),
    };

    const requirementJson = {
      data: requirements
        .filter((r) => r.job.trim() !== "" && r.req.trim() !== "")
        .map((r) => ({
          job: r.job,
          req: r.req,
        })),
    };

    const endpoint = isUpdate ? "/api/UpdateConfig" : "/api/setConfig";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: ImageUrl && ImageUrl,
        companies: companyJson,
        jobs: jobJson,
        requirements: requirementJson,
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (data) setShowModal(false);
  };

  return (
    <>
      {/* Floating Setup Form Button */}
      <button
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg font-semibold hover:bg-blue-700 transition-all"
        onClick={() => setShowModal(true)}
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
      >
        <span className="text-xl">⚙️</span>
        <span>Setup Form</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[100vw] mx-2 bg-white shadow-xl border rounded-2xl p-2 sm:p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              &times;
            </button>
            <form
              className="w-full overflow-scroll h-96 md:h-max"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                {/* Logo Upload */}
                <div>
                  <label className="block font-semibold mb-2">
                    Upload Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {(image || ImageUrl) && (
                    <div className="mt-4 flex justify-center">
                      <Image
                        src={image ? URL.createObjectURL(image) : ImageUrl}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="object-contain rounded border"
                      />
                    </div>
                  )}
                </div>

                {/* Companies */}
                <div className="h-40 overflow-y-scroll">
                  <span className="text-lg font-bold text-blue-700 mb-2 block">
                    🏢 Companies
                  </span>
                  {companies.map((company, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) =>
                          handleCompanyChange(idx, e.target.value)
                        }
                        placeholder={`Company #${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                      />
                      <div className="flex gap-1">
                        {companies.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCompany(idx)}
                            className="w-9 h-9 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition"
                            disabled={loading}
                            title="Remove"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M6 12h12"
                              />
                            </svg>
                          </button>
                        )}
                        {idx === companies.length - 1 && (
                          <button
                            type="button"
                            onClick={addCompany}
                            className="w-9 h-9 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition"
                            disabled={loading}
                            title="Add"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M12 6v12M6 12h12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Jobs */}
                <div className="h-40 overflow-y-scroll">
                  <span className="text-lg font-bold text-green-700 mb-2 block">
                    💼 Jobs
                  </span>
                  {jobs.map((job, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <input
                        type="text"
                        value={job}
                        onChange={(e) => handleJobChange(idx, e.target.value)}
                        placeholder={`Job #${idx + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 transition"
                      />
                      <div className="flex gap-1">
                        {jobs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeJob(idx)}
                            className="w-9 h-9 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition"
                            disabled={loading}
                            title="Remove"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M6 12h12"
                              />
                            </svg>
                          </button>
                        )}
                        {idx === jobs.length - 1 && (
                          <button
                            type="button"
                            onClick={addJob}
                            className="w-9 h-9 flex items-center justify-center bg-green-100 hover:bg-green-200 rounded-full text-green-600 transition"
                            disabled={loading}
                            title="Add"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M12 6v12M6 12h12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Job Requirements - Full width on desktop */}
                <div className="md:col-span-4 flex flex-col gap-2 max-h-[320px] overflow-y-auto">
                  <span className="text-lg font-bold text-purple-700 mb-2">
                    📋 Job Requirements
                  </span>
                  {requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-2 border-b pb-2 last:border-b-0"
                    >
                      <select
                        value={req.job}
                        onChange={(e) =>
                          handleRequirementChange(idx, "job", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg w-full md:w-56 bg-white focus:ring-2 focus:ring-purple-200 transition"
                      >
                        <option value="">Pilih Job</option>
                        {jobs.map((job, jidx) => (
                          <option key={jidx} value={job}>
                            {job}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={req.req}
                        onChange={(e) =>
                          handleRequirementChange(idx, "req", e.target.value)
                        }
                        placeholder="Requirement"
                        className="px-3 py-2 border border-gray-300 rounded-lg w-full resize-y min-h-[120px] md:min-h-[160px] focus:ring-2 focus:ring-purple-200 transition"
                        rows={5}
                      />
                      <div className="flex gap-2 mt-2 md:mt-0 md:flex-col">
                        {requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(idx)}
                            className="w-9 h-9 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition"
                            disabled={loading}
                            title="Remove"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M6 12h12"
                              />
                            </svg>
                          </button>
                        )}
                        {idx === requirements.length - 1 && (
                          <button
                            type="button"
                            onClick={addRequirement}
                            className="w-9 h-9 flex items-center justify-center bg-purple-100 hover:bg-purple-200 rounded-full text-purple-600 transition"
                            disabled={loading}
                            title="Add"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M12 6v12M6 12h12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tombol Submit di kanan bawah */}
                <div className="md:col-span-4 flex justify-end pt-6">
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-xl font-semibold text-lg shadow transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : isUpdate ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Config;
