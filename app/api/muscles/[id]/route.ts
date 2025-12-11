// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { muscleData } from "@/lib/muscle-data";

export async function GET(req: NextRequest, { params }) {
  const { id } = params;
  const muscle = muscleData[id];

  if (!muscle) {
    return NextResponse.json(
      { error: "Muscle not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(muscle);
}
