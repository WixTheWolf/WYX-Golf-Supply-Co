const FATHERS_DAY = new Date('2026-06-21T00:00:00');

export function fathersDayDaysLeft(now = new Date()) {
  return Math.ceil((FATHERS_DAY.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isFathersDayWindow(now = new Date()) {
  const days = fathersDayDaysLeft(now);
  return days > 0 && days <= 21;
}

export function isFathersDayUrgent(now = new Date()) {
  const days = fathersDayDaysLeft(now);
  return days > 0 && days <= 7;
}