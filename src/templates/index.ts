import type { PoemoraTemplate } from "./types";
import { sermonShort } from "./library/sermon-short";
import { adHook } from "./library/ad-hook";

/** 새 템플릿은 library/ 에 파일을 만들고 여기에 추가 */
export const TEMPLATES: PoemoraTemplate[] = [sermonShort, adHook];

export function getTemplate(id: string): PoemoraTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * AI 프롬프트용 템플릿 카탈로그 (프로젝트 JSON 은 빼고 슬롯 정보만).
 * 토큰 절약 + AI가 레이아웃 좌표를 건드리지 못하게 하는 경계.
 */
export function templateCatalogForAI(templates: PoemoraTemplate[] = TEMPLATES) {
  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    aspectRatio: t.aspectRatio,
    slots: t.slots
      .filter((s) => !s.userOnly)
      .map((s) => ({
        key: s.key,
        kind: s.kind,
        label: s.label,
        description: s.description,
        required: !!s.required,
        maxLength: s.maxLength,
      })),
  }));
}

export * from "./types";
export { fillTemplate, validateValues, resolveValues } from "./fill";
