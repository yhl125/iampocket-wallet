export type SizeType = keyof typeof fontSize;
export type ColorType = keyof typeof color;
export type SpaceType = keyof typeof space;
export type LineHeightType = keyof typeof lineHeight;

const fontSize = {
  display: "2.5rem", // 40px
  title1: "2rem", // 32px
  title2: "1.5rem", // 24px
  title3: "1.3125rem", // 21px
  body1: "1.125rem", // 18px
  body2: "1rem", // 16px
  body3: "0.875rem", // 14px
  body4: "0.75rem", // 12px
  body5: "0.625rem" // 10px
}
const lineHeight = {
  display: "2.5rem", 
  title1: "2rem", 
  title2: "1.5rem",
  title3: "1.3125rem",
  body1: "1.125rem",
  body2: "1rem",
  body3: "0.875rem",
  body4: "0.75rem",
  body5: "0.625rem"
}

const color = {
  bg100: "#000000",
  bg90: "#0E1113",
  bg80: "#1C2226",
  bg70: "#2B323A",
  bg60: "#39434D",
  bg50: "#475460",
  bg40: "#6C7680",
  bg30: "#9198A0",
  bg20: "#B5BBBF",
  bg10: "#DADDDF",
  bg0: "#FFFFFF",
  systemRed: "#FF0D38",
  systemRedAlpha30: "rgba(255, 13, 56, 0.30)",
  systemOrange: "#FE9B07",
  systemOrangeAlpha30: "rgba(254, 155, 7, 0.30)",
  systemGreen: "#06C755",
  systemGreenAlpha30: "rgba(6, 199, 85, 0.30)",
  systemBlue: "#2580E5",
  brandBlue90: "#041130",
  brandBlue80: "#082260",
  brandBlue70: "#0D3290",
  brandBlue60: "#1143C0",
  brandBlue50: "#1554F0",
  brandBlue40: "#4476F3",
  brandBlue30: "#7398F6",
  brandBlue20: "#A1BBF9",
  brandBlue10: "#A1BBF9",
  transparent: "transparent",

  // TODO: legacy color -> remove it
  backgroundPaper: "#1c1c1c",
  backgroundLight: "#1b2a22",
  backgroundMain: "#121312",
}

const space = {
  xTiny: "4px",
  tiny: "8px",
  xSmall: "12px",
  small: "16px",
  sMedium: "20px",
  base: "24px",
  medium: "32px",
  mLarge: "40px",
  large: "48px",
  xLarge: "64px",
}

export type Color = keyof typeof color;

const theme = {
  fontSize,
  lineHeight,
  space,
  color,
}

export default theme;