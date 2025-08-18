export const getStockStatus = (amount: number) => {
  if (amount <= 5) return "critical";
  if (amount <= 15) return "low";
  if (amount <= 20) return "medium";
  return "supplied";
};

export const getStockColor = (status: string) => {
  switch (status) {
    case "critical":
      return "bg-amount-critical";
    case "low":
      return "bg-amount-low";
    case "medium":
      return "bg-amount-medium";
    case "supplied":
      return "bg-amount-supplied";
    default:
      return "bg-gray-500";
  }
};
