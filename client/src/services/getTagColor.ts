export const getTagColor = (category: string | null | undefined): string => {
  switch (category) {
    case "Bug Report":
      return "bg-red-500 text-white";
    case "Feature Request":
      return "bg-blue-500 text-white";
    case "Question":
      return "bg-purple-500 text-white";
    case "Task":
      return "bg-green-500 text-white";
    case "Key Insight":
      return "bg-yellow-500 text-black";
    case "Decision":
      return "bg-gray-800 text-white";
    case "anticipation":
      return "animate-pulse-cyan text-white";

    case "immediate":
      return "animate-impulse-fuchsia text-white";

    case "moat":
      return "bg-amber-600 text-white";

    case "Prescient":
      return "bg-teal-600 text-white";

    default:
      return "bg-gray-400 text-white";
  }
};
