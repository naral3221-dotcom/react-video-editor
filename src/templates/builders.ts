/**
 * 템플릿 작성을 쉽게 해주는 clip 빌더.
 * 엔진 clip JSON 의 반복되는 필드(timing/transform/chromaKey 등)를 채워준다.
 */
import type { AnyClip, ITrack } from "@openvideo/core";
import { KO_FONTS, type KoFontKey } from "./fonts";

export const SEC = 1_000_000;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  opacity?: number;
}

function timing(fromSec: number, toSec: number) {
  const from = Math.round(fromSec * SEC);
  const to = Math.round(toSec * SEC);
  return {
    display: { from, to },
    trim: { from: 0, to: to - from },
    duration: to - from,
    playbackRate: 1,
  };
}

function transform(b: Box) {
  return {
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
    angle: 0,
    opacity: b.opacity ?? 1,
    zIndex: b.zIndex ?? 10,
    flip: { x: false, y: false },
  };
}

const COMMON = {
  chromaKey: { enabled: false, color: "#00FF00", similarity: 0.1, spill: 0 },
  colorAdjustment: { enabled: false, type: "basic", basic: {}, hsl: {}, curves: {} },
  locked: false,
  effects: [],
};

export function videoClip(
  id: string,
  opts: { src: string; from: number; to: number; box: Box; slot?: string; volume?: number },
): AnyClip {
  return {
    ...COMMON,
    type: "Video",
    id,
    name: opts.slot ?? id,
    src: opts.src,
    timing: timing(opts.from, opts.to),
    transform: transform(opts.box),
    style: {},
    audio: true,
    volume: opts.volume ?? 1,
    metadata: { slot: opts.slot },
  } as unknown as AnyClip;
}

export function imageClip(
  id: string,
  opts: { src: string; from: number; to: number; box: Box; slot?: string },
): AnyClip {
  return {
    ...COMMON,
    type: "Image",
    id,
    name: opts.slot ?? id,
    src: opts.src,
    timing: timing(opts.from, opts.to),
    transform: transform(opts.box),
    style: {},
    metadata: { slot: opts.slot },
  } as unknown as AnyClip;
}

export function textClip(
  id: string,
  opts: {
    text: string;
    from: number;
    to: number;
    box: Box;
    font?: KoFontKey;
    fontSize: number;
    color?: string;
    align?: "left" | "center" | "right";
    lineHeight?: number;
    stroke?: { color: string; width: number };
    shadow?: boolean;
    fadeIn?: number;
    fadeOut?: number;
    slot?: string;
  },
): AnyClip {
  const t = timing(opts.from, opts.to) as any;
  if (opts.fadeIn) t.fadeIn = { duration: opts.fadeIn * SEC, curve: "ease-out" };
  if (opts.fadeOut) t.fadeOut = { duration: opts.fadeOut * SEC, curve: "ease-in" };
  return {
    ...COMMON,
    type: "Text",
    id,
    name: opts.slot ?? id,
    text: opts.text,
    timing: t,
    transform: transform({ zIndex: 30, ...opts.box }),
    style: {
      ...KO_FONTS[opts.font ?? "bold"],
      fontSize: opts.fontSize,
      fontWeight: "normal",
      fontStyle: "normal",
      color: opts.color ?? "#ffffff",
      align: opts.align ?? "center",
      wordWrap: true,
      wordWrapWidth: opts.box.width,
      lineHeight: opts.lineHeight,
      ...(opts.stroke ? { stroke: opts.stroke } : {}),
      ...(opts.shadow
        ? { shadow: { color: "#000000", alpha: 0.6, blur: 8, offsetX: 0, offsetY: 3 } }
        : {}),
    },
    metadata: { slot: opts.slot },
  } as unknown as AnyClip;
}

export function shapeClip(
  id: string,
  opts: { from: number; to: number; box: Box; fill: string; fillOpacity?: number; radius?: number },
): AnyClip {
  return {
    ...COMMON,
    type: "Shape",
    id,
    name: id,
    shapeType: "rectangle",
    timing: timing(opts.from, opts.to),
    transform: transform({ zIndex: 20, ...opts.box }),
    style: {
      fill: opts.fill,
      fillOpacity: opts.fillOpacity ?? 1,
      stroke: { color: "#000000", width: 0 },
      borderRadius: opts.radius ?? 0,
    },
    metadata: {},
  } as unknown as AnyClip;
}

export function track(id: string, name: string, type: string, clips: AnyClip[]): ITrack {
  return { id, name, type, clipIds: clips.map((c) => c.id) };
}

export function clipsRecord(...clips: AnyClip[]): Record<string, AnyClip> {
  return Object.fromEntries(clips.map((c) => [c.id, c]));
}
