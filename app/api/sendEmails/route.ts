import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";
import YelpRecentLoginEmail from "@/app/components/template/email";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const sendEmail = async (to: string, subject: string, react: any) => {
    await resend.emails.send({
      from: "job@job.growtavern.site",
      to,
      subject,
      react,
    });
  };

  try {
    const { acceptedEmails, rejectedEmails } = await req.json();

    if (!acceptedEmails || !rejectedEmails) {
      return NextResponse.json(
        { error: "Missing accepted or rejected data" },
        { status: 400 }
      );
    }

    for (const applicant of acceptedEmails) {
      const html =YelpRecentLoginEmail({
          email: applicant.email,
          feedback: applicant.feedback,
          job: applicant.jobrequirement,
          name: applicant.name,
          status: applicant.decision,
        })

      await sendEmail(
        applicant.email,
        `You're Accepted for ${applicant.job} at ${applicant.company}`,
        html
      );
    }

    for (const applicant of rejectedEmails) {
      const html =YelpRecentLoginEmail({
          email: applicant.email,
          feedback: applicant.feedback,
          job: applicant.jobrequirement,
          name: applicant.name,
          status: applicant.decision,
        })

      await sendEmail(
        applicant.email,
        `Your ${applicant.job} Application at ${applicant.company}`,
        html
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
