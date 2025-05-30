import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
export const POST = async (req: NextRequest) => {
    // const formData = await req.formData();
    const {name, email, score, filepath, job, company, breakdown} = await req.json();
    const supabase = createClient();
// const name = formData.get("name") as string;
// const email = formData.get("email") as string;
// const score = formData.get("score") ;
// const filepath = formData.get("filepath") as string
// const job = formData.get("job") as string;
// const company = formData.get("company") as string;

const { error } = await supabase
  .from('data')
  .insert({
    name: name,
    email: email,
    score,
    filepath,
    created_at: new Date().toISOString(),
    job, 
    company,
    breakdown
  })
if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Data created successfully" }, { status: 200 });

}