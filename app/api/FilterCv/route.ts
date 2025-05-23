import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const formData = await req.formData();
    const link = formData.get("link") as string;
    const jobrequirement = formData.get("job_requirement") as string;
    const res = await fetch("https://api.dify.ai/v1/chat-messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.DIFY_API_KEY}`,
        },
        body: JSON.stringify({
            query: "Start analyze these CV",
            inputs: {
              job_requirement: jobrequirement,
              decision: "pending",
              cv: {
                type: "document",
                transfer_method: "remote_url",
                url: link,
              }
            },
            response_mode: "blocking",
            user: "HR",
            files: [
              {
                type: "document",
                transfer_method: "remote_url",
                url: link,
              }
            ]
          }),
    })
    const data = await res.json();
    if (res.status !== 200) {
        return new Response(JSON.stringify({ error: data.error }), { status: 500 });
    }
    return new Response(JSON.stringify({ data: data }), { status: 200 });
}