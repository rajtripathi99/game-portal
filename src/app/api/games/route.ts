import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  let apiUrl = `https://gamemonetize.com/feed.php?format=0&page=${page}`;
  if (search) {
    apiUrl += `&q=${encodeURIComponent(search)}`;
  }
  if (category) {
    apiUrl += `&category=${encodeURIComponent(category)}`;
  }

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 300 } });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
