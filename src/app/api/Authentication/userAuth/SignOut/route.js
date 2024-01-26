// 'use server'
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'


export async function DELETE() {
    try {
        cookies().delete('authToken')
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ status: 500, error: "Email or Password is invalid" });
    }
}
