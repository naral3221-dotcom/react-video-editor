/**
 * 채워진 템플릿 프로젝트를 에디터에 불러오기 (브라우저 전용)
 *
 * 주의: 엔진의 core.project.import() 는 src 가 없는 클립을 걸러내는데,
 * Shape 클립은 src 가 없어서 import 시 사라진다 (업스트림 동작).
 * 그래서 Shape 는 import 후 core.clip.add() 로 같은 트랙에 다시 넣는다.
 */
import type { IProject } from "@openvideo/core";
import { core } from "@/lib/project";
import { useProjectStore } from "@/stores/project-store";
import { KO_FONTS } from "./fonts";

async function preloadFonts() {
  const { fontManager } = await import("@openvideo/engine-pixi");
  await Promise.all(
    Object.values(KO_FONTS).map((f) =>
      fontManager.addFont({ name: f.fontFamily, url: f.fontUrl }).catch(() => undefined),
    ),
  );
}

export async function applyProjectToEditor(project: IProject, aspectRatio: string) {
  await preloadFonts();

  const shapeEntries: { clip: any; trackId: string }[] = [];
  const tracks = project.tracks.map((t) => {
    const keep: string[] = [];
    for (const id of t.clipIds) {
      const clip = project.clips[id] as any;
      if (clip?.type === "Shape") shapeEntries.push({ clip, trackId: t.id });
      else keep.push(id);
    }
    return { ...t, clipIds: keep };
  });
  const clips = Object.fromEntries(
    Object.entries(project.clips).filter(([, c]) => (c as any).type !== "Shape"),
  );

  useProjectStore
    .getState()
    .setCanvasSize({ width: project.settings.width, height: project.settings.height }, aspectRatio);

  core.project.import({ ...project, tracks, clips });

  for (const { clip, trackId } of shapeEntries) {
    await core.clip.add(clip, { trackId });
  }
}
