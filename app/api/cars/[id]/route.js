import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeCar, deserializeCar } from "@/lib/carSerializer";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });
    return NextResponse.json(serializeCar(car));
  } catch (error) {
    console.error(`GET /api/cars/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data = deserializeCar(body);
    // Remove id from update data
    delete data.id;
    delete data.createdAt;

    const car = await prisma.car.update({ where: { id }, data });
    return NextResponse.json(serializeCar(car));
  } catch (error) {
    console.error(`PUT /api/cars/${id} error:`, error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  try {
    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/cars/${id} error:`, error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
