import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export const GET = async () => {
    const supabase = createClient()
const {data, error} = await supabase.from('config').select()
 if (error) {
    return NextResponse.json({error}, {status: 500})
 } 
return NextResponse.json({data}, {status: 200})
}