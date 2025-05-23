import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; 

export const POST = async (req: NextRequest) => {
    const formdata = await req.formData()
const supabase = createClient();
const file = formdata.get('file') as File

const { data, error } = await supabase
  .storage
  .from('assets')
  .upload('logo/logo.png', file, {
    cacheControl: '3600',
    upsert: true
  })

  if (error) {
    return NextResponse.json({error}, {status: 500})
  }

  return NextResponse.json({data}, {status: 200})

}