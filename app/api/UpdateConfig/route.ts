import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export const POST = async (req: NextRequest) => {
    const {companies, jobs, requirements, image} = await req.json();
    const supabase = createClient()

    const data = await supabase.from('config').update({
logo: image, 
company: companies,
job: jobs,
requirement: requirements
    }).eq('id', 7)
    return NextResponse.json({data}, {status: 200})
}