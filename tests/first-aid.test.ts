/**
 * Unit test cho Deterministic First Aid (change deterministic-first-aid).
 *
 * Bảo vệ 2 bất biến của cây hỏi luật cứng:
 * 1. MỌI nhánh từ startNodeId đều kết thúc ở diagnosis — không loop, không ngõ cụt.
 * 2. Các scenario đúng theo spec (lá vàng + tưới nhiều → úng rễ; lá vàng + đất khô → thiếu nước).
 */

import { describe, it, expect } from "vitest";
import {
  getFirstAidSymptoms,
  getNextNode,
  getNode,
  getSymptomById,
  isDiagnosis,
  isQuestion,
} from "../lib/first-aid";

describe("first-aid — cấu trúc dữ liệu", () => {
  it("có ít nhất 6 triệu chứng (theo spec)", () => {
    const symptoms = getFirstAidSymptoms();
    expect(symptoms.length).toBeGreaterThanOrEqual(6);
  });

  it("mỗi triệu chứng có id, label, icon, startNodeId hợp lệ", () => {
    for (const s of getFirstAidSymptoms()) {
      expect(s.startNodeId).toBeTruthy();
      expect(s.nodes[s.startNodeId]).toBeDefined();
      expect(s.label.length).toBeGreaterThan(0);
    }
  });

  it("mọi nhánh từ startNodeId đều kết thúc ở diagnosis — không loop, không ngõ cụt", () => {
    for (const s of getFirstAidSymptoms()) {
      // DFS với in-stack set: phát hiện cycle THẬT (A→B→A) nhưng cho phép node hội tụ
      // (d_root_rot reachable từ nhiều nhánh — DAG, không phải cycle).
      const inStack = new Set<string>();
      const done = new Set<string>();
      let diagnosisCount = 0;
      const dfs = (nodeId: string) => {
        if (inStack.has(nodeId)) {
          throw new Error(`Symptom '${s.id}': cycle tại node '${nodeId}'`);
        }
        if (done.has(nodeId)) return; // đã duyệt xong từ nhánh khác (hội tụ) — OK
        inStack.add(nodeId);
        done.add(nodeId);
        const node = s.nodes[nodeId];
        expect(node).toBeDefined();
        if (isDiagnosis(node!)) {
          expect(node!.diagnosis.length).toBeGreaterThan(0);
          expect(node!.remedy.length).toBeGreaterThan(0);
          expect(node!.seekHelp.length).toBeGreaterThan(0);
          diagnosisCount++;
        } else {
          expect(node!.answers.length).toBeGreaterThanOrEqual(2);
          for (const a of node!.answers) {
            expect(s.nodes[a.next]).toBeDefined();
            dfs(a.next);
          }
        }
        inStack.delete(nodeId);
      };
      dfs(s.startNodeId);
      expect(diagnosisCount).toBeGreaterThan(0);
    }
  });
});

describe("first-aid — scenario theo spec", () => {
  const yellow = getSymptomById("yellow_leaves");
  if (!yellow) throw new Error("Thiếu symptom yellow_leaves");

  it("lá vàng + tưới >2 lần/ngày → chẩn đoán úng rễ", () => {
    // q_water → chọn "Tưới nhiều" → d_root_rot
    const node = getNextNode(yellow, "q_water", "a_much");
    expect(node).toBeDefined();
    expect(isDiagnosis(node!)).toBe(true);
    if (isDiagnosis(node!)) {
      expect(node.diagnosis.toLowerCase()).toContain("úng rễ");
      expect(node.remedy.some((r) => r.includes("Ngưng tưới"))).toBe(true);
    }
  });

  it("lá vàng + đất khô → chẩn đoán thiếu nước", () => {
    // q_water → "Tưới vừa phải" → q_soil → "Khô, nứt nẻ" → d_underwater
    const q2 = getNextNode(yellow, "q_water", "a_mid");
    expect(q2 && isQuestion(q2)).toBe(true);
    const d = getNextNode(yellow, (q2 as { id: string }).id, "a_dry");
    expect(d && isDiagnosis(d)).toBe(true);
    if (d && isDiagnosis(d)) {
      expect(d.diagnosis.toLowerCase()).toContain("thiếu nước");
    }
  });

  it("lá vàng + tưới vừa + đất bình thường + vàng từ gốc → thiếu dinh dưỡng", () => {
    const q2 = getNextNode(yellow, "q_water", "a_mid");
    const q3 = getNextNode(yellow, (q2 as { id: string }).id, "a_ok");
    const d = getNextNode(yellow, (q3 as { id: string }).id, "a_bottom");
    expect(d && isDiagnosis(d)).toBe(true);
    if (d && isDiagnosis(d)) {
      expect(d.diagnosis.toLowerCase()).toContain("thiếu dinh dưỡng");
    }
  });
});

describe("first-aid — edge cases", () => {
  it("getNextNode trả undefined khi node không tồn tại", () => {
    const yellow = getSymptomById("yellow_leaves")!;
    expect(getNextNode(yellow, "khong-ton-tai", "a_much")).toBeUndefined();
  });

  it("getNextNode trả undefined khi answerId không hợp lệ", () => {
    const yellow = getSymptomById("yellow_leaves")!;
    expect(getNextNode(yellow, "q_water", "khong-ton-tai")).toBeUndefined();
  });

  it("getNextNode trên node diagnosis → undefined (nhánh đã kết thúc)", () => {
    const yellow = getSymptomById("yellow_leaves")!;
    expect(getNextNode(yellow, "d_root_rot", "a_much")).toBeUndefined();
  });

  it("getSymptomById trả undefined cho id lạ", () => {
    expect(getSymptomById("khong-ton-tai")).toBeUndefined();
  });

  it("getNode trả node đúng id", () => {
    const yellow = getSymptomById("yellow_leaves")!;
    expect(getNode(yellow, "q_water")).toBeDefined();
    expect(getNode(yellow, "d_root_rot")).toBeDefined();
  });
});
