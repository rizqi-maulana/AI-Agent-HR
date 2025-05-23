import { useContext, useEffect, useState } from "react";
import { contextApp } from "@/context";

const ProgressBar = ({ score }: { score: number }) => (
  <div className="w-full bg-gray-200 rounded h-3 mb-2">
    <div
      className="bg-blue-500 h-3 rounded"
      style={{ width: `${score}%` }}
    ></div>
  </div>
);

const Details = () => {
  const { DetailsUser, setDetailsUser } = useContext(contextApp);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const FetchUser = async () => {
      const formdata = new FormData();
      formdata.append("email", DetailsUser.email);
      const res = await fetch("/api/DetailsUser", {
        method: "POST",
        body: formdata,
      });
      const result = await res.json();
      setData(result.data[0]);
    };
    FetchUser();
  }, []);

  if (!DetailsUser.show || !data) return null;

  const { breakdown } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md sm:max-w-lg mx-2 p-4 sm:p-8 rounded-2xl bg-white relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
          onClick={() => setDetailsUser({ email: "", show: false })}
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Detail Breakdown
        </h2>
        <div className="space-y-5">
          {/* Skills */}
          <div>
            <div className="flex justify-between mb-1 text-sm sm:text-base">
              <span className="font-semibold">Skills</span>
              <span>{breakdown.skills.score}%</span>
            </div>
            <ProgressBar score={breakdown.skills.score} />
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Missing:</span>{" "}
              {breakdown.skills.missing}
            </div>
          </div>
          {/* Experience */}
          <div>
            <div className="flex justify-between mb-1 text-sm sm:text-base">
              <span className="font-semibold">Experience</span>
              <span>{breakdown.experience.score}%</span>
            </div>
            <ProgressBar score={breakdown.experience.score} />
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Detail:</span>{" "}
              {breakdown.experience.detail}
            </div>
          </div>
          {/* Education */}
          <div>
            <div className="flex justify-between mb-1 text-sm sm:text-base">
              <span className="font-semibold">Education</span>
              <span>{breakdown.education.score}%</span>
            </div>
            <ProgressBar score={breakdown.education.score} />
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Detail:</span>{" "}
              {breakdown.education.detail}
            </div>
          </div>
          {/* Certifications */}
          <div>
            <div className="flex justify-between mb-1 text-sm sm:text-base">
              <span className="font-semibold">Certifications</span>
              <span>{breakdown.certifications.score}%</span>
            </div>
            <ProgressBar score={breakdown.certifications.score} />
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Missing:</span>{" "}
              {breakdown.certifications.missing}
            </div>
          </div>
          {/* Soft Skills */}
          <div>
            <div className="flex justify-between mb-1 text-sm sm:text-base">
              <span className="font-semibold">Soft Skills</span>
              <span>{breakdown.soft_skills.score}%</span>
            </div>
            <ProgressBar score={breakdown.soft_skills.score} />
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Missing:</span>{" "}
              {breakdown.soft_skills.missing}
            </div>
          </div>
          {/* Domain Knowledge */}
          <div>
            <div className="flex justify-between mb-1 text-sm sm:text-base">
              <span className="font-semibold">Domain Knowledge</span>
              <span>{breakdown.domain_knowledge.score}%</span>
            </div>
            <ProgressBar score={breakdown.domain_knowledge.score} />
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Missing:</span>{" "}
              {breakdown.domain_knowledge.missing}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
