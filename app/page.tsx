"use client";
import JobApplicationForm from "@/app/components/JobApplicationForm";
import { Users, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { contextApp } from "@/context";
import BotImage from "@/assets/robot.jpeg";

const Index = () => {
  const { currentTitle, ConfigRequirement, Logo } = useContext(contextApp);
  const [showMobileReq, setShowMobileReq] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full bg-primary text-white bg-blue-500 py-6 shadow-md relative">
        <div className="container mx-auto px-4 flex justify-evenly">
          {Logo && (
            <Image
              src={Logo}
              alt="Logo"
              width={200}
              height={200}
              className="hidden xl:block w-max h-20 object-contain"
              sizes="100vw"
              quality={100}
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-center">Career Portal</h1>
            <p className="text-center text-primary-foreground/80">
              Join our growing team
            </p>
          </div>

          <div>
            <Link
              href={"/admin"}
              className="flex items-center gap-1 bg-white text-primary rounded-md px-4 py-2 shadow-md hover:bg-gray-100 transition duration-200 text-black"
            >
              <Users size={16} />
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container justify-center gap-5 mx-auto px-4 py-12 flex flex-col xl:flex-row relative">
        {/* Floating toggle button for mobile */}
        {currentTitle && (
          <>
            <button
              type="button"
              className="fixed bottom-6 right-6 z-50 xl:hidden flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all animate-pulse-btn"
              onClick={() => setShowMobileReq((v) => !v)}
              aria-label="Show Job Requirement"
            >
              <Info size={28} />
            </button>
            {/* Mobile: show requirement as floating panel */}
            {showMobileReq && (
              <div
                className="fixed inset-0 z-50 flex items-end xl:hidden"
                style={{ background: "rgba(0,0,0,0.3)" }}
                onClick={() => setShowMobileReq(false)}
              >
                <div
                  className="w-full bg-white rounded-t-2xl shadow-xl p-5 max-h-[60vh] overflow-y-auto animate-slideup-fadein"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={BotImage}
                      alt="AI Assistant"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-blue-400 shadow-md"
                    />
                    <div>
                      <h2 className="font-semibold text-blue-600 text-lg">
                        Job Requirement
                      </h2>
                      <span className="text-xs text-gray-500">
                        AI Assistant
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {ConfigRequirement.filter(
                      (job) => job.job === currentTitle
                    ).map((job, idx) => (
                      <div
                        className="text-sm leading-relaxed border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0 prose prose-sm"
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: job.req.replace(/\n/g, "<br />"),
                        }}
                      />
                    ))}
                  </div>
                  <button
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold"
                    onClick={() => setShowMobileReq(false)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Desktop: show requirement as usual */}
        {currentTitle && (
          <div className="w-full max-w-md flex flex-col items-start gap-4 hidden xl:flex animate-fadein">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={BotImage}
                  alt="AI Assistant"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-blue-400 shadow-md"
                />
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-400 text-white px-5 py-4 rounded-2xl rounded-bl-md shadow-lg max-w-xs relative">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="inline-block bg-white/20 px-2 py-1 rounded text-xs font-medium">
                    AI Assistant
                  </span>
                  <span className="text-base">Job Requirement</span>
                </h2>
                <div className="flex flex-col gap-2">
                  {ConfigRequirement.filter(
                    (job) => job.job === currentTitle
                  ).map((job, idx) => (
                    <div
                      className="text-sm leading-relaxed prose prose-sm"
                      key={idx}
                      dangerouslySetInnerHTML={{
                        __html: job.req.replace(/\n/g, "<br />"),
                      }}
                    />
                  ))}
                </div>
                <span className="absolute left-3 -bottom-3 w-5 h-5 bg-blue-400 rounded-br-2xl rotate-45"></span>
              </div>
            </div>
          </div>
        )}
        <JobApplicationForm />
      </main>
      {/* Animasi CSS */}
      <style jsx global>{`
        @keyframes slideup-fadein {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideup-fadein {
          animation: slideup-fadein 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadein {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadein {
          animation: fadein 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes pulse-btn {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.15);
          }
        }
        .animate-pulse-btn {
          animation: pulse-btn 1.5s infinite;
        }
      `}</style>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 Career Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
