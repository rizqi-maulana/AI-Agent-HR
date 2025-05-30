import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/client";

export const POST = async (req: NextRequest) => {
    const supabase = createClient();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 400 });
    }
    
  
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("assets")
      .upload(`document/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });
    
    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
    
    return NextResponse.json({ message: "File uploaded successfully", data });
}