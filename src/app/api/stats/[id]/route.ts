import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const stat = await db.stat.findUnique({ where: { id } });
    if (!stat) {
      return NextResponse.json({ error: "Stat not found" }, { status: 404 });
    }
    return NextResponse.json(stat);
  } catch (error) {
    console.error("Error fetching stat:", error);
    return NextResponse.json({ error: "Failed to fetch stat" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const updatedStat = await db.stat.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedStat);
  } catch (error) {
    console.error("Error updating stat:", error);
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await db.stat.delete({ where: { id } });
    return NextResponse.json({ message: "Stat deleted successfully" });
  } catch (error) {
    console.error("Error deleting stat:", error);
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
