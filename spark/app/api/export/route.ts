import { NextRequest, NextResponse } from "next/server";
import { generateUnityZip } from "@/lib/export/zip-generator";

export async function POST(request: NextRequest) {
  try {
    const { code, scriptName } = await request.json();

    if (!code || !scriptName) {
      return NextResponse.json(
        { error: "Missing code or scriptName" },
        { status: 400 }
      );
    }

    const zipBlob = await generateUnityZip({ code, scriptName });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${scriptName}.zip"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
