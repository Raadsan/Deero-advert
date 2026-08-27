"use client";

import { useEffect, useState } from "react";
import {
  AppDiscount,
  fetchApplicableDiscounts,
} from "@/utils/discounts";

/** Global + (if logged in) user-specific discounts. Works for guests. */
export function useApplicableDiscounts() {
  const [discounts, setDiscounts] = useState<AppDiscount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchApplicableDiscounts();
        if (!cancelled) setDiscounts(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { discounts, loading };
}
