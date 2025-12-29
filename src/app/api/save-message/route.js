import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { ensureDirs, readJSON, writeJSON, uploadDir } from "@/lib/fs-utils";

export async function POST(req) {
  try {
    await ensureDirs();

    const formData = await req.formData();
    const sender = formData.get("sender");
    const message = formData.get("message");
    const file = formData.get("document");

    if (!sender || !message || !file) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const messages = await readJSON("messages.json");

    const newEntry = {
      sender,
      message,
      documentPath: `/uploads/${filename}`,
      createdAt: new Date().toISOString(),
    };

    messages.push(newEntry);
    await writeJSON("messages.json", messages);

    return NextResponse.json({ success: true, data: newEntry });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
