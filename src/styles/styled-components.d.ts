import "styled-components";
import { FontSize, Color, LineHeight, Space } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    fontSize: { [key in FontSize]: string };
    color: { [key in Color]: string };
    lineHeight: { [key in LineHeight]: string };
    space: { [key in Space]: string };
  }
}
