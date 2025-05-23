import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/client";

export const POST = async (req: NextRequest) => {
  const { acceptedEmails, rejectedEmails } = await req.json();

  // Gabungkan semua email dari kedua array
  const allEmails = [
    ...acceptedEmails.map((d: any) => d.email),
    ...rejectedEmails.map((d: any) => d.email),
  ];

  // Hapus duplikat email jika ada
  const uniqueEmails = Array.from(new Set(allEmails));

  const supabase = createClient();

  // Hapus data berdasarkan email
  const { error } = await supabase
    .from("data") // Ganti dengan nama tabel Anda
    .delete()
    .in("email", uniqueEmails);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ response: "deleted", emails: uniqueEmails }, { status: 200 });
};