import axios from "axios";
import type { Node } from "reactflow";
import type { ChecklistItem } from "../components/CheckListNode";

const getNodeText = (node: Node): string => {
  if (node.type === "sticky") return node.data.text || "";
  if (node.type === "editableNode") return node.data.label || "";
  if (node.type === "checklist") {
    const title = node.data.title || "";
    const itemsText = (node.data.items || [])
      .map((item: ChecklistItem) => item.text)
      .join(", ");
    return `${title}: ${itemsText}`;
  }
  return "";
};

export async function categorizeNodeAPI(nodesToCategorize: Node[]) {
  const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
  const API_URL =
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
  const categories = [
    "Bug Report",
    "Feature Request",
    "Question",
    "Task",
    "Key Insight",
    "Decision",
    "anticipation",
    "Immediate",
    "Moat",
    "Prescient",
  ];
  const validNodes = nodesToCategorize.filter(
    (node) => getNodeText(node).trim() !== ""
  );

  if (validNodes.length === 0) {
    return [];
  }

  const promises = validNodes.map(async (node) => {
    try {
      const textToClassify = getNodeText(node);

      const response = await axios.post(
        API_URL,
        {
          inputs: textToClassify,
          parameters: { candidate_labels: categories },
        },
        { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
      );

      const topCategory = response.data.labels[0];

      return { nodeId: node.id, category: topCategory };
    } catch (error) {
      console.error(`Failed to categorize node ${node.id}:`, error);
      return { nodeId: node.id, category: null };
    }
  });

  const results = await Promise.all(promises);

  return results.filter((result) => result.category !== null);
}
