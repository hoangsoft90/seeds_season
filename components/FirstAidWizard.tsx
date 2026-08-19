"use client";

import { useState } from "react";
import { getFirstAidSymptoms, getNode, getNextNode, isDiagnosis } from "@/lib/first-aid";
import type { FirstAidSymptom } from "@/lib/data/first-aid";

/**
 * First Aid wizard (change deterministic-first-aid) — chạy client-side hoàn toàn:
 * chọn triệu chứng → câu hỏi phân nhánh (luật cứng) → diagnosis + remedy từng bước.
 * Không login, không API. Nút "Bắt đầu lại" / "Chọn triệu chứng khác".
 */
export default function FirstAidWizard() {
  const symptoms = getFirstAidSymptoms();
  const [symptom, setSymptom] = useState<FirstAidSymptom | null>(null);
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const start = (s: FirstAidSymptom) => {
    setSymptom(s);
    setNodeId(s.startNodeId);
    setHistory([]);
  };

  const reset = () => {
    setSymptom(null);
    setNodeId(null);
    setHistory([]);
  };

  const answer = (answerId: string) => {
    if (!symptom || !nodeId) return;
    const next = getNextNode(symptom, nodeId, answerId);
    if (!next) return;
    setHistory((h) => [...h, nodeId]);
    setNodeId(next.id);
  };

  const back = () => {
    setHistory((h) => {
      const prev = h[h.length - 1];
      if (prev !== undefined) setNodeId(prev);
      return h.slice(0, -1);
    });
  };

  // ── Màn hình 1: chọn triệu chứng ──
  if (!symptom || !nodeId) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-zinc-500">Cây của bạn đang gặp vấn đề gì? Chọn để được hướng dẫn từng bước.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {symptoms.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => start(s)}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-3xl" aria-hidden>
                {s.icon}
              </span>
              <span>
                <span className="block font-medium text-zinc-900">{s.label}</span>
                <span className="block text-xs text-zinc-500">{s.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const node = getNode(symptom, nodeId);

  // ── Diagnosis: hiển thị kết quả + remedy ──
  if (node && isDiagnosis(node)) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <h2 className="font-semibold text-emerald-900">🔍 Chẩn đoán</h2>
          <p className="mt-1 text-sm leading-relaxed text-emerald-950">{node.diagnosis}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">🛠️ Cách xử lý từng bước</h2>
          <ol className="mt-2 flex list-none flex-col gap-2">
            {node.remedy.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">🆘 Khi nào cần trợ giúp thêm</h2>
          <p className="mt-1 text-sm leading-relaxed text-amber-950">{node.seekHelp}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            🔁 Bắt đầu lại
          </button>
          <button
            type="button"
            onClick={() => start(symptom)}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Trả lời lại triệu chứng này
          </button>
        </div>
      </div>
    );
  }

  // ── Question: hiển thị câu hỏi + các nhánh ──
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-zinc-400">
        {symptom.icon} {symptom.label}
      </p>
      <h2 className="text-lg font-semibold text-zinc-900">{node?.question ?? "…"}</h2>
      <div className="flex flex-col gap-2">
        {node && "answers" in node
          ? node.answers.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => answer(a.id)}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-800 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                {a.label}
              </button>
            ))
          : null}
      </div>
      <div className="flex gap-2">
        {history.length > 0 && (
          <button
            type="button"
            onClick={back}
            className="self-start rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100"
          >
            ← Quay lại
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="self-start rounded-full border border-transparent px-4 py-1.5 text-sm text-zinc-500 transition hover:text-red-600"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
