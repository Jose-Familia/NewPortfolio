import { NextRequest, NextResponse } from "next/server";
import { listDatabaseProperties } from "@/lib/notion";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dbId = searchParams.get("dbId");
    
    if (!dbId) {
      return NextResponse.json({ error: "Database ID required" }, { status: 400 });
    }
    
    const properties = await listDatabaseProperties(dbId);
    
    return NextResponse.json({ properties });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching properties" }, { status: 500 });
  }
}