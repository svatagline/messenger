import fs from "fs/promises";
import path from "path";

export const dataDir = path.join(process.cwd(), "data");
export const uploadDir = path.join(process.cwd(), "uploads");

export async function readJSON(file) {
  const filePath = path.join(dataDir, file);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

export async function writeJSON(file, data) {
  const filePath = path.join(dataDir, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function ensureDirs() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadDir, { recursive: true });
}
