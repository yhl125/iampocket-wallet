export type SizeType = keyof typeof fontSize;
export type ColorType = keyof typeof color;
export type SpaceType = keyof typeof space;
export type LineHeightType = keyof typeof lineHeight;

const fontSize = {
  display: "4rem",
  title1: "3.2rem",
  title2: "2.4rem",
  title3: "2.1rem",
  body1: "1.8rem",
  body2: "1.6rem",
  body3: "1.4rem",
  body4: "1.2rem",
  large: "1.8rem",
  regular: "1.6rem",
  tiny: "0.9rem",
}


const color = {
    textPrimary: "#fff",
    textSecondary: "#636669",
    textDisabled:" #636669",

    primaryDark: "#0cb259", // hover
    primaryMain: "#12ff80",
    primaryLight:"#a1a3a7",

    secondaryDark:"#636669",
    secondaryMain: "#fff",
    secondaryLight: "#12ff80",
    secondaryBackground: "#303033",

    borderMain: "#636669",
    borderLight: "#303033",
    borderBackground: "#121312",

    // error-dark: #ac2c3b;
    // error-main: #ff5f72;
    // error-light: #ffb4bd;
    // error-background: #2f2527;

    // success-dark: #028d4c;
    // success-main: #00b460;
    // success-light: #81c784;
    // success-background: #1f2920;
    // info-dark: #52bfdc;
    // info-main: #5fddff;
    // info-light: #b7f0ff;
    // info-background: #19252c;

    // warning-dark: #cd674e;
    // warning-main: #ff8061;
    // warning-light: #ffb7a6;
    // warning-background: #2f2318;

    backgroundDefault: "#121312",
    backgroundMain:"#121312",
    backgroundPaper:"#1c1c1c",
    backgroundLight: "#1b2a22",
    backdropMain: "#636669",
    // logo-main: #fff;
    // logo-background: #303033;
    // static-main: #121312;
}



const lineHeight = {
  display: "54px",
  title1: "44px",
  title2: "34px",
  title3: "30px",
  body1: "28px",
  body2: "24px",
  body3: "18px",
  body4: "16px",
  large: "28px",
  regular: "24px",
  small: "18px",
  tiny: "16px",
}

const space = {
  xxTiny: "4px",
  xTiny: "6px",
  tiny: "8px",
  xSmall: "12px",
  small: "16px",
  sMedium: "20px",
  base: "24px",
  medium: "32px",
  mLarge: "40px",
  large: "48px",
  xLarge: "52px",
  xxLarge: "64px",
}

export type Color = keyof typeof color;

const theme = {
  fontSize,
  lineHeight,
  space,
  color,
}

export default theme;
