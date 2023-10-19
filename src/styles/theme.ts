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
  display: "3.375rem",
  title1: "2.75rem",
  title2: "2.125rem",
  title3: "1.875rem",
  body1: "1.75rem",
  body2: "1.5rem",
  body3: "1.125rem",
  body4: "1rem",
  body5: "0.875rem"
}

const color = {
  bg800: "#030D14",
  bg500: "#082032",
  bg400: "#394D5B",
  bg300: "#6B7984",
  bg200: "#9CA6AD",
  bg100: "#CED2D6",
  bg0: "#FFFFFF",
  systemRed: "#FF3B53",
  systemOrange: "#FE9B07",
  systemGreen: "#06C755",
  systemBlue: "#2580E5",
  brandBlue700: "#004777",
  brandBlue600: "#005F9F",
  brandBlue500: "#0077C7",
  brandBlue400: "#3392D2",
  brandBlue300: "#66ADDD",
  brandBlue200: "#99C9E9",
  brandBlue100: "#CCE4F4",
  brandOrange700: "#992E19",
  brandOrange600: "#CC3D21",
  brandOrange500: "#FF4C29",
  brandOrange400: "#FF7054",
  brandOrange300: "#FF947F",
  brandOrange200: "#FFB7A9",
  brandOrange100: "#FFDBD4",


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