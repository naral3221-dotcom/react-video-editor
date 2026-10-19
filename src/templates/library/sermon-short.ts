import type { PoemoraTemplate } from "../types";
import { clipsRecord, shapeClip, textClip, track, videoClip } from "../builders";

const W = 1080;
const H = 1920;
const END = 30;

const bg = videoClip("sermon_video", {
  slot: "sermonClip",
  src: "{{sermonClip}}",
  from: 0,
  to: END,
  box: { x: 0, y: 0, width: W, height: H, zIndex: 1 },
});

const titleBar = shapeClip("title_bar", {
  from: 0,
  to: END - 3,
  box: { x: 60, y: 120, width: W - 120, height: 170 },
  fill: "#000000",
  fillOpacity: 0.55,
  radius: 24,
});

const title = textClip("title_text", {
  slot: "sermonTitle",
  text: "{{sermonTitle}}",
  from: 0,
  to: END - 3,
  box: { x: 90, y: 150, width: W - 180, height: 110 },
  font: "extraBold",
  fontSize: 64,
});

const scriptureCard = shapeClip("scripture_card", {
  from: 1.5,
  to: 12,
  box: { x: 80, y: 1180, width: W - 160, height: 400 },
  fill: "#FFFFFF",
  fillOpacity: 0.9,
  radius: 28,
});

const scripture = textClip("scripture_text", {
  slot: "scripture",
  text: "{{scripture}}",
  from: 1.5,
  to: 12,
  box: { x: 120, y: 1220, width: W - 240, height: 260 },
  font: "bold",
  fontSize: 46,
  color: "#1A1A1A",
  lineHeight: 1.45,
  fadeIn: 0.4,
  fadeOut: 0.4,
});

const reference = textClip("scripture_ref", {
  slot: "reference",
  text: "{{reference}}",
  from: 1.5,
  to: 12,
  box: { x: 120, y: 1500, width: W - 240, height: 56 },
  font: "regular",
  fontSize: 34,
  color: "#555555",
  align: "right",
  fadeIn: 0.4,
  fadeOut: 0.4,
});

const footer = textClip("footer_text", {
  slot: "churchName",
  text: "{{churchName}} · {{preacher}}",
  from: 0,
  to: END - 3,
  box: { x: 60, y: 1760, width: W - 120, height: 60 },
  font: "bold",
  fontSize: 36,
  shadow: true,
});

const endCard = shapeClip("end_card", {
  from: END - 3,
  to: END,
  box: { x: 0, y: 0, width: W, height: H, zIndex: 40 },
  fill: "#0E0E10",
});

const endText = textClip("end_text", {
  slot: "endMessage",
  text: "{{endMessage}}",
  from: END - 3,
  to: END,
  box: { x: 90, y: 860, width: W - 180, height: 200, zIndex: 50 },
  font: "extraBold",
  fontSize: 60,
  lineHeight: 1.4,
  fadeIn: 0.5,
});

export const sermonShort: PoemoraTemplate = {
  id: "sermon-short-30s",
  name: "설교 쇼츠 (30초)",
  category: "sermon",
  description:
    "설교 영상에서 30초 하이라이트를 뽑아 세로 쇼츠로 만들 때. 상단 설교 제목, 초반 10초 성경구절 카드, 하단 교회명·설교자, 마지막 3초 엔딩 문구.",
  aspectRatio: "9:16",
  slots: [
    {
      key: "sermonClip",
      kind: "media",
      label: "설교 영상 클립",
      description: "30초 분량 설교 하이라이트 영상",
      required: true,
      userOnly: true,
    },
    {
      key: "sermonTitle",
      kind: "text",
      label: "설교 제목",
      description: "설교 핵심을 담은 제목. 한 줄, 14자 이내.",
      required: true,
      maxLength: 14,
    },
    {
      key: "scripture",
      kind: "longtext",
      label: "성경구절 본문",
      description: "본문 말씀 1~2절. 자연스럽게 2~4줄로 줄바꿈(\\n). 80자 이내.",
      required: true,
      maxLength: 80,
    },
    {
      key: "reference",
      kind: "text",
      label: "성경 장절",
      description: "예: 요한복음 3:16",
      required: true,
      maxLength: 20,
    },
    {
      key: "churchName",
      kind: "text",
      label: "교회명",
      description: "교회 이름",
      required: true,
      maxLength: 14,
      default: "OO교회",
    },
    {
      key: "preacher",
      kind: "text",
      label: "설교자",
      description: "예: 홍길동 목사",
      maxLength: 12,
      default: "담임목사",
    },
    {
      key: "endMessage",
      kind: "longtext",
      label: "엔딩 문구",
      description: "설교를 한 문장으로 적용하는 마무리 문구. 2줄, 30자 이내.",
      maxLength: 30,
      default: "오늘도 말씀으로\n승리하세요",
    },
  ],
  project: {
    settings: { width: W, height: H, fps: 30, duration: END * 1_000_000, backgroundColor: "#000000" },
    tracks: [
      track("t_overlay_end", "엔딩", "text", [endText]),
      track("t_shape_end", "엔딩 배경", "shape", [endCard]),
      track("t_text", "텍스트", "text", [title, scripture, reference, footer]),
      track("t_shape", "도형", "shape", [titleBar, scriptureCard]),
      track("t_video", "영상", "video", [bg]),
    ],
    clips: clipsRecord(bg, titleBar, title, scriptureCard, scripture, reference, footer, endCard, endText),
  },
};
