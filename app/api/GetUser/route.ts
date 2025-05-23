import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export const GET = async () => {
    const supabase = createClient();

    const {data, error} = await supabase.from('data').select()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
}