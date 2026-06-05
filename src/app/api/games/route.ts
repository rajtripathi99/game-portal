import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("q") || "";

  let apiUrl = `https://gamemonetize.com/feed.php?format=0&page=${page}`;
  if (search) {
    apiUrl += `&q=${encodeURIComponent(search)}`;
  }

  try {
    const response = await fetch(apiUrl, { cache: "no-store" });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
