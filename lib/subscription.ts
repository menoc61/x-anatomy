// code only if needed 
import type { User } from "@/types";
const trialEndsAt=null;
export function  getSafeSubscription(user: User) {
  if (!user.subscription) {
    return {
      plan: "Trial",
      status: "active",
      autoRenew: false,
      startDate: user.createdAt,
      expiresAt: trialEndsAt ?? "",
    };
  }

  const s = user.subscription;

  return {
    plan: s.plan.charAt(0).toUpperCase() + s.plan.slice(1),
    status: s.status,
    autoRenew: s.autoRenew,
    startDate: s.startDate,
    expiresAt: s.expiresAt,
  };
}