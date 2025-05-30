import { NextResponse, NextRequest } from "next/server";
import CryptoJS from "crypto-js";
import { createClient } from "@/utils/supabase/client";

export const POST = async (req: NextRequest) => {
    const formdata = await req.formData();
    const username = await formdata.get('username')
    const password = await formdata.get('password')
    const database = createClient()

    const {data, error} = await database.from('admin').select();
    if (data) {
        if (!process.env.TOKEN_KEY) {
                  throw new Error(
            "Encryption key is not defined in environment variables."
          );
        }
        const bytes  = CryptoJS.AES.decrypt(data[0].password, process.env.TOKEN_KEY)
        const result  = bytes.toString(CryptoJS.enc.Utf8)
        if (username !== 'admin') {
            return NextResponse.json({login: false, message: 'Invalid Username'}, {status: 404})
        }
        if (password === result) {
            return NextResponse.json({login: true}, {status: 200})
        }
    } 

    return NextResponse.json({login: false, message: 'Invalid Username or Password'}, {status: 404})

}