/**
 * 템플릿 + 슬롯 값 → 엔진이 import 할 수 있는 프로젝트 JSON
 * 순수 함수 (브라우저/서버 어디서나 실행 가능, 엔진 의존 없음)
 */
import type { IProject } from "@openvideo/core";
import type { FillResult, PoemoraTemplate, SlotValues } from "./types";

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

export function resolveValues(template: PoemoraTemplate, values: SlotValues): SlotValues {
  const out: SlotValues = {};
  for (const slot of template.slots) {
    const v = values[slot.key];
    out[slot.key] = v !== undefined && v !== "" ? v : (slot.default ?? "");
  }
  return out;
}

export function validateValues(template: PoemoraTemplate, values: SlotValues): string[] {
  const warnings: string[] = [];
  const resolved = resolveValues(template, values);
  for (const slot of template.slots) {
    const v = resolved[slot.key];
    if (slot.required && !v.trim()) warnings.push(`'${slot.label}' 값이 비어 있습니다.`);
    if (slot.maxLength && (slot.kind === "text" || slot.kind === "longtext")) {
      const len = v.replace(/\n/g, "").length;
      if (len > slot.maxLength) {
        warnings.push(`'${slot.label}'이(가) ${len}자로 권장 ${slot.maxLength}자를 넘습니다.`);
      }
    }
    if (slot.kind === "color" && v && !/^#[0-9a-fA-F]{6}$/.test(v)) {
      warnings.push(`'${slot.label}' 색상 형식이 #RRGGBB 가 아닙니다.`);
    }
  }
  return warnings;
}

function replaceDeep(node: unknown, values: SlotValues): unknown {
  if (typeof node === "string") {
    return node.replace(PLACEHOLDER, (_, key: string) => values[key] ?? "");
  }
  if (Array.isArray(node)) return node.map((n) => replaceDeep(n, values));
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = replaceDeep(v, values);
    return out;
  }
  return node;
}

export function fillTemplate(template: PoemoraTemplate, values: SlotValues): FillResult {
  const resolved = resolveValues(template, values);
  const warnings = validateValues(template, values);
  const project = replaceDeep(structuredClone(template.project), resolved) as IProject;

  // 내용이 비게 된 클립 제거: 미디어 src 없음 / 텍스트가 공백만 남음 (예: " · " 같은 구분자만)
  const removed = new Set<string>();
  for (const [id, clip] of Object.entries(project.clips)) {
    const c = clip as any;
    const isMedia = c.type === "Video" || c.type === "Image" || c.type === "Audio";
    if (isMedia && !String(c.src ?? "").trim()) removed.add(id);
    if (c.type === "Text" && !String(c.text ?? "").replace(/[\s·|\-]/g, "")) removed.add(id);
  }
  // 텍스트 앞뒤에 남은 구분자 정리 ("교회명 · " → "교회명")
  for (const clip of Object.values(project.clips)) {
    const c = clip as any;
    if (c.type === "Text" && typeof c.text === "string") {
      c.text = c.text.replace(/^\s*[·|]\s*|\s*[·|]\s*$/g, "");
    }
  }
  for (const id of removed) delete project.clips[id];
  project.tracks = project.tracks
    .map((t) => ({ ...t, clipIds: t.clipIds.filter((id) => !removed.has(id)) }))
    .filter((t) => t.clipIds.length > 0);

  return { project, warnings };
}
