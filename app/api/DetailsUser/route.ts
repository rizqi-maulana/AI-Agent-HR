import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export const POST = async (req: NextRequest) => {
const supabase = createClient()
const formdata = await req.formData()
const email = formdata.get('email') as string

const {data, error} = await supabase.from('data').select().eq('email', email)
if (error ) {
    return NextResponse.json({error}, {status: 404})
}
return NextResponse.json({data}, {status: 200})
}