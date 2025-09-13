import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const collaboration = await db.collaboration.findUnique({ where: { id } });
    if (!collaboration) {
      return NextResponse.json({ error: "Collaboration not found" }, { status: 404 });
    }
    return NextResponse.json(collaboration);
  } catch (error) {
    console.error("Error fetching collaboration:", error);
    return NextResponse.json({ error: "Failed to fetch collaboration" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await request.json();
    const updatedCollaboration = await db.collaboration.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedCollaboration);
  } catch (error) {
    console.error("Error updating collaboration:", error);
    return NextResponse.json({ error: "Failed to update collaboration" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await db.collaboration.delete({ where: { id } });
    return NextResponse.json({ message: "Collaboration deleted successfully" });
  } catch (error) {
    console.error("Error deleting collaboration:", error);
    return NextResponse.json({ error: "Failed to delete collaboration" }, { status: 500 });
  }
}
