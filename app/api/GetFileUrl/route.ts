import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/client";


export const POST = async (req: NextRequest) => {
    const formdata = await req.json();
    const supabase = createClient();
    const fileName = formdata.filename as string;

    const { data } = await supabase.storage
        .from("assets")
        .getPublicUrl(`document/${fileName}`);
    if (!data || !data.publicUrl) {
        return NextResponse.json({ error: "Failed to retrieve public URL" }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
};