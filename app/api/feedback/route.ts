import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { acceptedEmails, rejectedEmails } = await req.json();

  const sendToDify = async (applicant: any) => {
    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        query: "Generate email draft",
        inputs: {
          job_requirement: applicant.requirement,
          decision: applicant.decision,
          with_feedback: 1,
          cv: {
            type: "document",
            transfer_method: "remote_url",
            url: applicant.link,
          },
        },
        response_mode: "blocking",
        user: "HR",
        files: [
          {
            type: "document",
            transfer_method: "remote_url",
            url: applicant.link,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown error from Dify");
    }

    return data;
  };

  try {
    const allApplicants = [...acceptedEmails, ...rejectedEmails];
    const results = await Promise.all(allApplicants.map(sendToDify));

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
