import { getPublicDiscounts } from "@/api-client/discountApi";
import { getUser, refreshUser } from "@/utils/auth";

export type AppDiscount = {
  id?: number | string;
  targetType?: string;
  targetId?: string | null;
  discountValue?: number;
  discountType?: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  userId?: number | null;
};

const isDateValid = (d: AppDiscount, now = new Date()) =>
  (!d.startDate || new Date(d.startDate) <= now) &&
  (!d.endDate || new Date(d.endDate) >= now);

const isActive = (d: AppDiscount) =>
  (d.status || "active") === "active" && isDateValid(d);

/** Merge global + user discounts by id (user-specific kept). */
export const mergeDiscounts = (
  globalList: AppDiscount[] = [],
  userList: AppDiscount[] = []
): AppDiscount[] => {
  const map = new Map<string, AppDiscount>();
  globalList.filter(isActive).forEach((d) => {
    map.set(String(d.id ?? `${d.targetType}-${d.targetId}-${d.discountValue}`), d);
  });
  userList.filter(isActive).forEach((d) => {
    map.set(String(d.id ?? `${d.targetType}-${d.targetId}-${d.discountValue}`), d);
  });
  return Array.from(map.values());
};

/**
 * Global ("All Users") discounts are always included — no login required.
 * Specific-user discounts are added only when that user is logged in.
 */
export const fetchApplicableDiscounts = async (): Promise<AppDiscount[]> => {
  let globalList: AppDiscount[] = [];
  try {
    const res: any = await getPublicDiscounts();
    globalList = res.data?.discounts || res.data || [];
    if (!Array.isArray(globalList)) globalList = [];
  } catch {
    globalList = [];
  }

  let userList: AppDiscount[] = [];
  try {
    const refreshed = await refreshUser();
    const user = refreshed || getUser();
    userList = Array.isArray(user?.discounts) ? user.discounts : [];
  } catch {
    const user = getUser();
    userList = Array.isArray(user?.discounts) ? user.discounts : [];
  }

  return mergeDiscounts(globalList, userList);
};

export const matchesDiscountTarget = (
  d: AppDiscount,
  targetType: string,
  ids: Array<string | number | null | undefined>
) => {
  const typeOk =
    d.targetType === targetType || d.targetType === "all";
  if (!typeOk) return false;

  if (!d.targetId || d.targetId === "all") return true;

  const idSet = new Set(
    ids.filter((id) => id !== null && id !== undefined && String(id) !== "").map(String)
  );
  return idSet.has(String(d.targetId));
};

export const getBestDiscountedPrice = (
  basePrice: number,
  discounts: AppDiscount[],
  targetType: string,
  ids: Array<string | number | null | undefined>
) => {
  const applicable = discounts.filter(
    (d) => isActive(d) && matchesDiscountTarget(d, targetType, ids)
  );

  if (applicable.length === 0) {
    return { finalPrice: basePrice, discount: 0, hasDiscount: false, applied: null as AppDiscount | null };
  }

  let bestPrice = basePrice;
  let appliedDiscount = 0;
  let applied: AppDiscount | null = null;

  applicable.forEach((d) => {
    let currentDiscount = 0;
    if (d.discountType === "percentage") {
      currentDiscount = basePrice * (Number(d.discountValue) / 100);
    } else {
      currentDiscount = Number(d.discountValue) || 0;
    }
    const currentPrice = basePrice - currentDiscount;
    if (currentPrice < bestPrice) {
      bestPrice = currentPrice;
      appliedDiscount = currentDiscount;
      applied = d;
    }
  });

  return {
    finalPrice: bestPrice > 0 ? bestPrice : 0,
    discount: appliedDiscount,
    hasDiscount: appliedDiscount > 0,
    applied,
  };
};
