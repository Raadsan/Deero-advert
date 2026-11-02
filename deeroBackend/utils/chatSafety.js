import { prisma } from "../lib/prisma.js";

const BLOCKED_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|nigger|faggot|retard|porn|xxx)\b/gi,
];

export function containsBlockedLanguage(text = "") {
  if (!text || typeof text !== "string") return false;
  return BLOCKED_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

export async function areUsersBlocked(userA, userB) {
  const a = parseInt(userA, 10);
  const b = parseInt(userB, 10);
  if (Number.isNaN(a) || Number.isNaN(b)) return false;

  const block = await prisma.userBlock.findFirst({
    where: {
      OR: [
        { blockerId: a, blockedId: b },
        { blockerId: b, blockedId: a },
      ],
    },
    select: { id: true },
  });

  return Boolean(block);
}

export async function getBlockedUserIds(userId) {
  const id = parseInt(userId, 10);
  const rows = await prisma.userBlock.findMany({
    where: {
      OR: [{ blockerId: id }, { blockedId: id }],
    },
  });

  const ids = new Set();
  for (const row of rows) {
    ids.add(row.blockerId === id ? row.blockedId : row.blockerId);
  }
  return ids;
}
