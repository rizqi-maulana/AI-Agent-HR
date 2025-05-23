import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export const POST = async (req: NextRequest) => {
    const {companies, jobs, requirements, image} = await req.json()
    const supabase = createClient()

    const data = await supabase.from('config').insert({
logo: image, 
company: companies,
job: jobs,
requirement: requirements
    })
    return NextResponse.json({data}, {status: 200})
}