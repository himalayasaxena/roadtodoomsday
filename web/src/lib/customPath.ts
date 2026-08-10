/** Compact custom-path + progress encoding (bitmask → base64url). */

const B64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function bytesToBase64Url(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i] ?? 0;
    const b = bytes[i + 1] ?? 0;
    const c = bytes[i + 2] ?? 0;
    const n = (a << 16) | (b << 8) | c;
    out += B64[(n >> 18) & 63];
    out += B64[(n >> 12) & 63];
    out += i + 1 < bytes.length ? B64[(n >> 6) & 63] : "";
    out += i + 2 < bytes.length ? B64[n & 63] : "";
  }
  return out;
}

function base64UrlToBytes(s: string): Uint8Array {
  const clean = s.replace(/=+$/, "");
  const len = clean.length;
  const byteLen = Math.floor((len * 6) / 8);
  const bytes = new Uint8Array(byteLen);
  let bi = 0;
  for (let i = 0; i < len; i += 4) {
    const n =
      (B64.indexOf(clean[i] || "A") << 18) |
      (B64.indexOf(clean[i + 1] || "A") << 12) |
      (B64.indexOf(clean[i + 2] || "A") << 6) |
      B64.indexOf(clean[i + 3] || "A");
    if (bi < byteLen) bytes[bi++] = (n >> 16) & 255;
    if (bi < byteLen) bytes[bi++] = (n >> 8) & 255;
    if (bi < byteLen) bytes[bi++] = n & 255;
  }
  return bytes;
}

/** Pack membership bits for `selected` against ordered `universe` ids. */
export function encodeIdBitmask(
  selected: string[],
  universe: string[],
): string {
  if (!selected.length || !universe.length) return "";
  const set = new Set(selected);
  const bitCount = universe.length;
  const byteCount = Math.ceil(bitCount / 8);
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < bitCount; i++) {
    if (!set.has(universe[i])) continue;
    bytes[i >> 3] |= 1 << (7 - (i & 7));
  }
  return bytesToBase64Url(bytes);
}

export function decodeIdBitmask(
  code: string,
  universe: string[],
): string[] {
  if (!code || !universe.length) return [];
  try {
    const bytes = base64UrlToBytes(code);
    const out: string[] = [];
    for (let i = 0; i < universe.length; i++) {
      const byte = bytes[i >> 3];
      if (byte === undefined) break;
      if (byte & (1 << (7 - (i & 7)))) out.push(universe[i]);
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * True when value looks like legacy title id(s), not a compact bitmask.
 * Slugs are lowercase-with-hyphens; bitmasks are mixed-case base64url.
 */
export function isLegacyIdList(value: string): boolean {
  if (!value) return false;
  if (value.includes(",") || value.includes("%2C")) return true;
  // Single MCU-style slug: iron-man, what-if-s1, etc.
  if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(value)) return true;
  // Rare bare ids without hyphens (still all-lowercase words)
  if (/^[a-z][a-z0-9]*$/.test(value) && value.length >= 3) return true;
  return false;
}

/**
 * Parse custom path from `p` (compact) or `ids` (legacy comma list).
 * Catalog must be stable sequenceOrder-sorted title ids.
 */
export function parseCustomPathParam(
  p: string | undefined,
  ids: string | undefined,
  catalogIds: string[],
): string[] {
  if (p?.trim()) {
    const value = decodeURIComponent(p.trim());
    // Rare: someone pasted a comma list into p=
    if (value.includes(",")) {
      return value.split(",").map((x) => x.trim()).filter(Boolean);
    }
    return decodeIdBitmask(value, catalogIds);
  }
  if (ids?.trim()) {
    const value = decodeURIComponent(ids.trim());
    if (!isLegacyIdList(value) && value.length > 0 && value.length < 40) {
      const decoded = decodeIdBitmask(value, catalogIds);
      if (decoded.length) return decoded;
    }
    return value.split(",").map((x) => x.trim()).filter(Boolean);
  }
  return [];
}

export function encodeCustomPathParam(
  selectedIds: string[],
  catalogIds: string[],
): string {
  return encodeIdBitmask(selectedIds, catalogIds);
}

/** Catalog ids in stable release order for bitmask encoding. */
export function catalogIdsInOrder(
  titles: { id: string; sequenceOrder: number }[],
): string[] {
  return [...titles]
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
    .map((t) => t.id);
}
