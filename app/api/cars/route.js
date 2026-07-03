import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeCar, deserializeCar } from "@/lib/carSerializer";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const where = {};
    if (searchParams.get("brand")) where.brand = searchParams.get("brand");
    if (searchParams.get("fuel")) where.fuel = searchParams.get("fuel");
    if (searchParams.get("transmission")) where.transmission = searchParams.get("transmission");
    if (searchParams.get("ownership")) where.ownership = searchParams.get("ownership");
    if (searchParams.get("category")) where.category = searchParams.get("category");
    if (searchParams.get("trending") === "true") where.trending = true;
    if (searchParams.get("featured") === "true") where.featured = true;
    if (searchParams.get("newArrival") === "true") where.newArrival = true;

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = Number(minYear);
      if (maxYear) where.year.lte = Number(maxYear);
    }

    const maxMileage = searchParams.get("maxMileage");
    if (maxMileage) where.mileage = { lte: Number(maxMileage) };

    const q = searchParams.get("q");
    if (q) {
      where.OR = [
        { brand: { contains: q } },
        { model: { contains: q } },
        { location: { contains: q } },
        { category: { contains: q } },
      ];
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cars.map(serializeCar));
  } catch (error) {
    console.error("GET /api/cars error:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = deserializeCar(body);

    // Generate a slug ID from brand+model+year if not provided
    if (!data.id) {
      data.id = `${data.brand}-${data.model}-${data.year}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const car = await prisma.car.create({ data });
    return NextResponse.json(serializeCar(car), { status: 201 });
  } catch (error) {
    console.error("POST /api/cars error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A car with this ID already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
