# Tailwind Inter Plugin

TailwindCSS Plugin to integrate with Inter Typeface from Rasmus Andersson [@rsms](https://twitter.com/rsms).

The plugin is inspired with [tailwind-plugin-inter-font](https://github.com/suburbicode/tailwind-plugin-font-inter) plugin developed by Imam Susanto [@imsus](https://github.com/imsus).

## Features

- Optionally add `@font-face` from [https://rsms.me/inter/inter.css](https://rsms.me/inter/inter.css),
- [Dynamic Metrics](https://rsms.me/inter/dynmetrics/) utilities,
- Font feature settings utilities.

## Installation

```sh
# with npm
npm install --save-dev tailwindcss-font-inter

# or with yarn
yarn add --dev tailwindcss-font-inter
```

## Usage

Add plugin to your `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [
    require('tailwindcss-font-inter')()
  ]
};
```

You can set additional options for plugin:

```js
// tailwind.config.js
module.exports = {
  ...

  plugins: [
    require('tailwindcss-font-inter')({ // it's plugin's default settings
      a: -0.0223,
      b: 0.185,
      c: -0.1745,
      baseFontSize: 16,
      baseLineHeight: 1.5,
      importFontFace: false,
      disableUnusedFeatures: false
    })
  ]
};
```

### Plugin Options

The plugin has several adjustable options.

- `a`, `b`, `c` — constants used to calculate [Dynamic Metrics](https://rsms.me/inter/dynmetrics/).
- `baseFontSize` — integer for base font size, default is `16`.
- `baseLineHeight` — float for base line height, default is `1.5` (as in Tailwind's `preflight.css`).
- `importFontFace` — flag to inject Inter's `@font-face` to the output, default is `false`. If `false`, you should inport Inter CSS by yourself.
- `disableUnusedFeatures` — if this option is `true`, `font-feature-settings` will also disable all available font features which were not enabled in config.

### Theme Configuration

The plugin uses [`fontSize` and `lineHeight` core plugins](https://tailwindcss.com/docs/configuration#core-plugins) to generate proper font sizes for Inter Typeface. Additionally it uses `interFontFeatures` to config font feature settings.

```js
// tailwind.config.js
module.exports = {
  theme: {
    interFontFeatures: {
      default: ['calt', 'liga', 'kern'],
      numeric: ['tnum', 'salt', 'ss02']
    },
    extend: {
      fontSize: {
        'xs': '11px',
        's': '13px',
        'm': '17px',
        'l': '28px',
        'xl': '36px',
        '2xl': '48px',
        '3xl': '64px',
        base: '16px',
      },
      lineHeight: {
        'lg': '1.6',
        'md': '1.33',
        'sm': '1.25',
        'xs': '1',
      },
    }
  },
  plugins: [
    require('tailwindcss-font-inter')()
  ]
}
```

## Output

This package will generate CSS on components section and utilities section.

### Font Family

The plugin will add some `@font-face` declaration in base (if `importFontFace` option is set to `true`) and add `.font-inter` utility class.

```css
/* Just a copy of https://rsms.me/inter/inter.css */

@font-face {
  font-family: Inter UI;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-Regular.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-Regular.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-Italic.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-Italic.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-Medium.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-Medium.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: italic;
  font-weight: 500;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-MediumItalic.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-MediumItalic.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-SemiBold.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-SemiBold.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-SemiBoldItalic.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-SemiBoldItalic.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-Bold.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-Bold.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-BoldItalic.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-BoldItalic.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-ExtraBold.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-ExtraBold.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: italic;
  font-weight: 800;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-ExtraBoldItalic.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-ExtraBoldItalic.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-Black.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-Black.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI;
  font-style: italic;
  font-weight: 900;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI-BlackItalic.woff2?v=3.1") format("woff2"),
       url("https://rsms.me/inter/font-files/Inter-UI-BlackItalic.woff?v=3.1") format("woff");
}

@font-face {
  font-family: Inter UI var;
  font-style: oblique 0deg 10deg;
  font-weight: 400 900;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/Inter-UI.var.woff2?v=3.1") format("woff2-variations"),
       url("https://rsms.me/inter/font-files/Inter-UI.var.woff2?v=3.1") format("woff2");
}

.font-inter {
  font-family: "Inter UI", sans-serif;
}

@supports(font-variation-settings:normal) {
  .font-inter {
    font-family: "Inter UI var", sans-serif;
  }
}
```

## Font Sizes

Alongside with the default `text-lg` classes, the plugin will generate `text-inter-lg` to set also line height and letter spacing according to Inter's **Dynamic Metrics**.

```css
/* Will be generated on @tailwind utilities; */

.text-inter-xs {
    font-size: 0.75rem;
    letter-spacing: 0.16rem;
    line-height: 1.05rem;
}

.text-inter-sm {
    font-size: 0.875rem;
    letter-spacing: 0.16rem;
    line-height: 1.225rem;
}

.text-inter-base {
    font-size: 1rem;
    letter-spacing: 0.15rem;
    line-height: 1.4rem;
}

.text-inter-lg {
    font-size: 1.125rem;
    letter-spacing: 0.15rem;
    line-height: 1.575rem;
}

.text-inter-xl {
    font-size: 1.25rem;
    letter-spacing: 0.15rem;
    line-height: 1.75rem;
}

.text-inter-2xl {
    font-size: 1.5rem;
    letter-spacing: 0.14rem;
    line-height: 2.1rem;
}

.text-inter-3xl {
    font-size: 1.875rem;
    letter-spacing: 0.13rem;
    line-height: 2.625rem;
}

.text-inter-4xl {
    font-size: 2.25rem;
    letter-spacing: 0.12rem;
    line-height: 3.15rem;
}

.text-inter-5xl {
    font-size: 3rem;
    letter-spacing: 0.1rem;
    line-height: 4.2rem;
}
```
### Font features

Also the plugin generates utility classes which allow you to specify named font feature settings.

```js
// tailwind.config.js
module.exports = {
  theme: {
    interFontFeatures: {
      default: ['calt', 'liga', 'kern'],
      numeric: ['tnum', 'salt', 'ss02']
    },
  },
  plugins: [
    require('tailwindcss-font-inter')()
  ]
}
```

This will generate the following classes:

```css
/* This is a default class */
.font-feature-normal: {
  font-feature-settings: normal
}

.font-feature-default: {
  font-feature-settings: "calt", "liga", "kern";
}

.font-feature-numeric: {
  font-feature-settings: "tnum", "salt", "ss02";
}
```

The plugin will filter unsupported feature and won't include it to the output. Also to avoid some unexpected inheritance, you can set plugin's option `disableUnusedFeatures` to `true`, then generated classes will disable all supported featurs and enable only those you've specified.

```css
/* This is a default class */
.font-feature-normal: {
  font-feature-settings: normal
}

.font-feature-default: {
  font-feature-settings: "aalt" 0, "calt", "case" 0, "ccmp" 0, "cpsp" 0, "cv01" 0, "cv02" 0, "cv03" 0, "cv04" 0, "cv05" 0, "cv06" 0, "cv07" 0, "cv08" 0, "cv09" 0, "cv10" 0, "cv11" 0, "dlig" 0, "dnom" 0, "frac" 0, "kern", "liga", "numr" 0, "ordn" 0, "pnum" 0, "rlig" 0, "salt" 0, "ss01" 0, "ss02" 0, "ss03" 0, "subs" 0, "sups" 0, "tnum" 0, "zero" 0;
}

.font-feature-numeric: {
  font-feature-settings: "aalt" 0, "calt" 0, "case" 0, "ccmp" 0, "cpsp" 0, "cv01" 0, "cv02" 0, "cv03" 0, "cv04" 0, "cv05" 0, "cv06" 0, "cv07" 0, "cv08" 0, "cv09" 0, "cv10" 0, "cv11" 0, "dlig" 0, "dnom" 0, "frac" 0, "kern" 0, "liga" 0, "numr" 0, "ordn" 0, "pnum" 0, "rlig" 0, "salt", "ss01" 0, "ss02", "ss03" 0, "subs" 0, "sups" 0, "tnum", "zero" 0;
}
```

# License

[MIT](LICENSE.md)
