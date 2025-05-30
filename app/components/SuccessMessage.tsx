import React, { useContext } from "react";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { contextApp } from "@/context";

interface SuccessMessageProps {
  onReset: () => void;
  isSuccess?: boolean;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  onReset,
  isSuccess,
}) => {
  const { isLoading } = useContext(contextApp);
  return (
    <div className="text-center py-8 space-y-6 animate-in fade-in-50">
      <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit">
        {isLoading ? (
          <svg
            className="animate-spin h-12 w-12 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : isSuccess === false ? (
          <XCircle className="h-12 w-12 text-red-600" />
        ) : (
          <CheckCircle className="h-12 w-12 text-green-600" />
        )}
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <h2 className="text-2xl font-bold">Processing Your Application...</h2>
        ) : isSuccess === false ? (
          <h2 className="text-2xl font-bold text-red-600">
            Application Failed!
          </h2>
        ) : (
          <h2 className="text-2xl font-bold">Application Submitted!</h2>
        )}
        {isLoading ? (
          <p className="text-muted-foreground">
            Please wait while we process your application. This may take a few
            moments.
          </p>
        ) : isSuccess === false ? (
          <p className="text-muted-foreground">
            Sorry, your application could not be submitted. Please try again or
            contact support.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Thank you for submitting your application. We'll review it shortly
            and get back to you.
          </p>
        )}
      </div>

      {!isLoading && isSuccess !== false && (
        <div>
          <div className="bg-secondary rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="list-decimal list-inside text-sm text-left space-y-2">
              <li>Our team will review your application</li>
              <li>
                We'll email you within 5-7 business days with feedback or next
                steps
              </li>
              <li>
                If selected, you'll be invited for an initial interview with our
                hiring team
              </li>
            </ol>
          </div>
          <Button onClick={onReset}>Submit Another Application</Button>
        </div>
      )}

      {/* Jika gagal, tampilkan tombol retry */}
      {!isLoading && isSuccess === false && (
        <Button onClick={onReset}>Try Again</Button>
      )}
    </div>
  );
};

export default SuccessMessage;
