export const getPlanBadgeColor = (plan: string) => {
  switch (plan) {
    case "premium":
      return "bg-orange-600 text-white";
    case "basic":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-indigo-500 text-white";
    case "user":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export const capitalizeFirstLetter = (str?: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
