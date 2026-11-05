import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function saveUpload(file: File) {
  const ext = ALLOWED.get(file.type);
  if (!ext) throw new Error("Use a JPG, PNG, WEBP, or GIF.");
  if (file.size > 4 * 1024 * 1024) throw new Error("Cover image must be under 4MB.");
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function fileToDataUrl(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Logo must be an image.");
  if (file.size > 1.5 * 1024 * 1024) throw new Error("Logo image must be under 1.5MB.");
  const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  return `data:${file.type};base64,${b64}`;
}
