import type { PoemoraTemplate } from "../types";
import { clipsRecord, shapeClip, textClip, track, videoClip } from "../builders";

const W = 1080;
const H = 1920;
const END = 15;

const main = videoClip("ad_video", {
  slot: "mainClip",
  src: "{{mainClip}}",
  from: 0,
  to: END,
  box: { x: 0, y: 0, width: W, height: H, zIndex: 1 },
});

const hook = textClip("hook_text", {
  slot: "hook",
  text: "{{hook}}",
  from: 0,
  to: 3,
  box: { x: 60, y: 300, width: W - 120, height: 260 },
  font: "extraBold",
  fontSize: 84,
  lineHeight: 1.25,
  stroke: { color: "#000000", width: 6 },
  shadow: true,
});

const points = ["point1", "point2", "point3"].map((key, i) =>
  textClip(`${key}_text`, {
    slot: key,
    text: `{{${key}}}`,
    from: 3 + i * 2.7,
    to: 3 + (i + 1) * 2.7,
    box: { x: 80, y: 1260, width: W - 160, height: 180 },
    font: "bold",
    fontSize: 60,
    lineHeight: 1.3,
    stroke: { color: "#000000", width: 4 },
    fadeIn: 0.25,
  }),
);

const ctaBar = shapeClip("cta_bar", {
  from: 11.1,
  to: END,
  box: { x: 80, y: 1480, width: W - 160, height: 170 },
  fill: "{{brandColor}}",
  radius: 85,
});

const cta = textClip("cta_text", {
  slot: "cta",
  text: "{{cta}}",
  from: 11.1,
  to: END,
  box: { x: 100, y: 1520, width: W - 200, height: 90 },
  font: "extraBold",
  fontSize: 58,
  fadeIn: 0.25,
});

const disclaimer = textClip("disclaimer_text", {
  slot: "disclaimer",
  text: "{{disclaimer}}",
  from: 0,
  to: END,
  box: { x: 60, y: 1820, width: W - 120, height: 50 },
  font: "regular",
  fontSize: 24,
  color: "#E6E6E6",
  shadow: true,
});

export const adHook: PoemoraTemplate = {
  id: "ad-hook-15s",
  name: "광고 후킹 쇼츠 (15초)",
  category: "ad",
  description:
    "릴스·쇼츠 광고용 15초 세로 영상. 0~3초 후킹 문구, 3~11초 장점 3개 순차 노출, 11~15초 브랜드 컬러 CTA 버튼. 하단에 상시 고지 문구(의료광고 부작용 고지 등).",
  aspectRatio: "9:16",
  slots: [
    {
      key: "mainClip",
      kind: "media",
      label: "메인 영상",
      description: "15초 이상 분량의 광고 소스 영상",
      required: true,
      userOnly: true,
    },
    {
      key: "hook",
      kind: "longtext",
      label: "후킹 문구",
      description: "첫 3초 안에 스크롤을 멈추게 하는 질문/반전 문구. 2줄, 20자 이내.",
      required: true,
      maxLength: 20,
    },
    { key: "point1", kind: "text", label: "장점 1", description: "핵심 장점. 14자 이내.", required: true, maxLength: 14 },
    { key: "point2", kind: "text", label: "장점 2", description: "두 번째 장점. 14자 이내.", required: true, maxLength: 14 },
    { key: "point3", kind: "text", label: "장점 3", description: "세 번째 장점. 14자 이내.", required: true, maxLength: 14 },
    {
      key: "cta",
      kind: "text",
      label: "CTA",
      description: "행동 유도 문구. 예: 무료 상담 신청하기. 12자 이내.",
      required: true,
      maxLength: 12,
    },
    {
      key: "brandColor",
      kind: "color",
      label: "브랜드 컬러",
      description: "CTA 버튼 색상 (#RRGGBB)",
      default: "#FF5A36",
    },
    {
      key: "disclaimer",
      kind: "text",
      label: "고지 문구",
      description:
        "법적 고지. 의료광고면 '개인에 따라 부작용이 발생할 수 있습니다' 류. 과장·치료효과 보장 표현 금지. 40자 이내.",
      maxLength: 40,
      default: "",
    },
  ],
  project: {
    settings: { width: W, height: H, fps: 30, duration: END * 1_000_000, backgroundColor: "#000000" },
    tracks: [
      track("t_text", "텍스트", "text", [hook, ...points, cta, disclaimer]),
      track("t_shape", "도형", "shape", [ctaBar]),
      track("t_video", "영상", "video", [main]),
    ],
    clips: clipsRecord(main, hook, ...points, ctaBar, cta, disclaimer),
  },
};
