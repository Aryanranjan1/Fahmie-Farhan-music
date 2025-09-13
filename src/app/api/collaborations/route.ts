import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const collaborations = await db.collaboration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    return NextResponse.json({ error: "Failed to fetch collaborations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const collaboration = await db.collaboration.create({ data });
    return NextResponse.json(collaboration, { status: 201 });
  } catch (error) {
    console.error("Error creating collaboration:", error);
    return NextResponse.json({ error: "Failed to create collaboration" }, { status: 500 });
  }
}
