/**
 * First Aid — logic thuần (change deterministic-first-aid).
 * Duyệt cây hỏi theo câu trả lời; nhánh luôn kết thúc ở DiagnosisNode (không loop).
 * Chạy client-side, không login, không API.
 */

import { FIRST_AID_SYMPTOMS, type FirstAidDiagnosis, type FirstAidNode, type FirstAidQuestion, type FirstAidSymptom } from "./data/first-aid";

/** Toàn bộ triệu chứng (đã có dữ liệu luật cứng). */
export function getFirstAidSymptoms(): FirstAidSymptom[] {
  return FIRST_AID_SYMPTOMS;
}

/** Tìm triệu chứng theo id (vd "yellow_leaves"). */
export function getSymptomById(id: string): FirstAidSymptom | undefined {
  return FIRST_AID_SYMPTOMS.find((s) => s.id === id);
}

/** Lấy node hiện tại (question hoặc diagnosis). */
export function getNode(symptom: FirstAidSymptom, nodeId: string): FirstAidNode | undefined {
  return symptom.nodes[nodeId];
}

/** Câu trả lời → node tiếp theo. Trả undefined nếu id không hợp lệ hoặc node là diagnosis. */
export function getNextNode(
  symptom: FirstAidSymptom,
  nodeId: string,
  answerId: string,
): FirstAidNode | undefined {
  const node = symptom.nodes[nodeId];
  if (!node || isDiagnosis(node)) return undefined;
  const answer = node.answers.find((a) => a.id === answerId);
  if (!answer) return undefined;
  return symptom.nodes[answer.next];
}

/** Kiểm tra node có phải diagnosis (nhánh kết thúc) không. */
export function isDiagnosis(node: FirstAidNode): node is FirstAidDiagnosis {
  return "diagnosis" in node;
}

export function isQuestion(node: FirstAidNode): node is FirstAidQuestion {
  return "question" in node;
}
