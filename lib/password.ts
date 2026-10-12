// Server-only: hashing password dengan node:crypto scrypt.
// JANGAN import file ini dari client component.
// Format hash: scrypt$N$r$p$saltHex$hashHex
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN).toString("hex");
  return `scrypt$${N}$${R}$${P}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const salt = parts[4];
    const expected = Buffer.from(parts[5], "hex");
    const actual = scryptSync(password, salt, expected.length);
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export { N as SCRYPT_N, R as SCRYPT_R, P as SCRYPT_P };
