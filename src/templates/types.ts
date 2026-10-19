/**
 * 포에모라 템플릿 시스템 — 타입 정의
 *
 * 템플릿 = "엔진이 그대로 import 할 수 있는 프로젝트 JSON" + "AI/사람이 채울 슬롯 목록".
 * - project 안의 문자열 값에 `{{slotKey}}` 를 넣어두면 fillTemplate()이 치환한다.
 * - 시간 단위는 엔진과 동일하게 마이크로초(µs). 1초 = 1_000_000.
 */
import type { IProject } from "@openvideo/core";

export type SlotKind =
  /** 짧은 한 줄 텍스트 (제목, CTA 등) */
  | "text"
  /** 여러 줄 텍스트 (성경구절 본문 등). 줄바꿈은 \n */
  | "longtext"
  /** 영상/이미지 파일 또는 URL — src 로 들어간다 */
  | "media"
  /** 색상 (#RRGGBB) */
  | "color";

export interface TemplateSlot {
  key: string;
  kind: SlotKind;
  /** 화면에 보이는 이름 */
  label: string;
  /** AI에게 주는 설명 — 무엇을, 어떤 톤으로, 몇 자 이내로 채울지 */
  description: string;
  required?: boolean;
  /** text/longtext 최대 글자 수 (자막 넘침 방지) */
  maxLength?: number;
  default?: string;
  /** AI가 채우면 안 되는 슬롯 (예: 사용자가 직접 고를 영상 파일) */
  userOnly?: boolean;
}

export type TemplateCategory = "sermon" | "ad" | "general";

export interface PoemoraTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  /** AI가 템플릿을 고를 때 읽는 설명 — 언제 쓰는 템플릿인지 */
  description: string;
  aspectRatio: "9:16" | "16:9" | "1:1" | "4:5";
  slots: TemplateSlot[];
  /** `{{slotKey}}` 플레이스홀더가 들어간 엔진 프로젝트 JSON */
  project: IProject;
}

export type SlotValues = Record<string, string>;

export interface FillResult {
  project: IProject;
  /** 비어 있는 필수 슬롯, 글자 수 초과 등 */
  warnings: string[];
}
