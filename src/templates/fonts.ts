/**
 * 한글 폰트 — public/fonts 에 셀프 호스팅 (Pretendard, SIL OFL 1.1).
 * 엔진은 style.fontFamily + style.fontUrl 로 폰트를 로드한다.
 */
export const KO_FONTS = {
  regular: { fontFamily: "Pretendard-Regular", fontUrl: "/fonts/Pretendard-Regular.otf" },
  bold: { fontFamily: "Pretendard-Bold", fontUrl: "/fonts/Pretendard-Bold.otf" },
  extraBold: { fontFamily: "Pretendard-ExtraBold", fontUrl: "/fonts/Pretendard-ExtraBold.otf" },
} as const;

export type KoFontKey = keyof typeof KO_FONTS;
