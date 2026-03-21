import { merge } from "theme-ui"
import originalTheme from "@lekoarts/gatsby-theme-cara/src/gatsby-plugin-theme-ui/index"

const theme = merge(originalTheme, {
  colors: {
    background: "#f9f9ff",
    text: "#181c25",
    primary: "#5A67D8",
    secondary: "#F6AD55",
    muted: "#f1f3ff",
    heading: "#181c25",
    modes: {
      dark: {
        background: "#141821",
        text: "#f9f9ff",
        primary: "#bdc2ff",
        secondary: "#ffddba",
        muted: "#2c303a",
        heading: "#ffffff",
      },
    },
  },
  fonts: {
    body: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    monospace: 'Menlo, monospace',
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
  },
})

export default theme
