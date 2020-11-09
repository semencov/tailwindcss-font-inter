# Tailwind Inter Plugin

TailwindCSS Plugin to integrate with Inter Typeface from Rasmus Andersson [@rsms](https://twitter.com/rsms).

The plugin is inspired with [tailwind-plugin-inter-font](https://github.com/suburbicode/tailwind-plugin-font-inter) plugin developed by Imam Susanto [@imsus](https://github.com/imsus).

## Features

-   Optionally adds `@font-face` from [https://rsms.me/inter/inter.css](https://rsms.me/inter/inter.css),
-   [Dynamic Metrics](https://rsms.me/inter/dynmetrics/) utilities,
-   Font feature settings utilities.

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
    plugins: [require('tailwindcss-font-inter')()]
};
```

You can set additional options for plugin:

```js
// tailwind.config.js
module.exports = {
  ...

  plugins: [
    require('tailwindcss-font-inter')({ // plugin's default settings
      a: -0.0223,
      b: 0.185,
      c: -0.1745,
      baseFontSize: 16,
      importFontFace: false,
    })
  ]
};
```

### Plugin Options

The plugin has several adjustable options.

-   `a`, `b`, `c` — constants used to calculate [Dynamic Metrics](https://rsms.me/inter/dynmetrics/).
-   `baseFontSize` — integer for base font size, default is `16`.
-   `importFontFace` — flag to inject Inter's `@font-face` to the output, default is `false`. If `false`, you should inport Inter CSS by yourself.

### Theme Configuration

The plugin uses [`fontSize` core plugin](https://tailwindcss.com/docs/configuration#core-plugins) to generate proper letter spacing for Inter Typeface. Additionally it uses `fontFeatureSettings` to config font feature settings.

```js
// tailwind.config.js
module.exports = {
    theme: {
        fontFeatureSettings: {
            numeric: ['tnum', 'salt', 'ss02']
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '36px',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '4rem'
        }
    },
    plugins: [require('tailwindcss-font-inter')()]
};
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
      src: url('https://rsms.me/inter/font-files/Inter-UI-Regular.woff2?v=3.1') format('woff2'),   
            url('https://rsms.me/inter/font-files/Inter-UI-Regular.woff?v=3.1') format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-Italic.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-Italic.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-Medium.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-Medium.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: italic;
      font-weight: 500;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-MediumItalic.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-MediumItalic.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-SemiBold.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-SemiBold.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: italic;
      font-weight: 600;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-SemiBoldItalic.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-SemiBoldItalic.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-Bold.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-Bold.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: italic;
      font-weight: 700;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-BoldItalic.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-BoldItalic.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: normal;
      font-weight: 800;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-ExtraBold.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-ExtraBold.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: italic;
      font-weight: 800;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-ExtraBoldItalic.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-ExtraBoldItalic.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: normal;
      font-weight: 900;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-Black.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-Black.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI;
      font-style: italic;
      font-weight: 900;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI-BlackItalic.woff2?v=3.1') format('woff2'), url('https://rsms.me/inter/font-files/Inter-UI-BlackItalic.woff?v=3.1')
            format('woff');
}

@font-face {
      font-family: Inter UI var;
      font-style: oblique 0deg 10deg;
      font-weight: 400 900;
      font-display: swap;
      src: url('https://rsms.me/inter/font-files/Inter-UI.var.woff2?v=3.1') format('woff2-variations'), url('https://rsms.me/inter/font-files/Inter-UI.var.woff2?v=3.1')
            format('woff2');
}

.font-inter {
      font-family: 'Inter UI', sans-serif;
}

@supports (font-variation-settings: normal) {
      .font-inter {
            font-family: 'Inter UI var', sans-serif;
    }
}
```

## Font Sizes

Alongside with the default `text-lg` classes, the plugin will generate nested `text-lg` to set also letter spacing according to Inter's **Dynamic Metrics**.

```css
/* Will be generated on @tailwind utilities; */

.font-inter .text-xs,
.font-inter.text-xs {
    font-size: 0.75rem;
    letter-spacing: 0.0004908em;
}

.font-inter .text-sm,
.font-inter.text-sm {
    font-size: 0.875rem;
    letter-spacing: -0.0062235em;
}

.font-inter .text-base,
.font-inter.text-base {
    font-size: 1rem;
    letter-spacing: -0.0109598em;
}

.font-inter .text-lg,
.font-inter.text-lg {
    font-size: 1.125rem;
    letter-spacing: -0.0143007em;
}

.font-inter .text-2xl,
.font-inter.text-2xl {
    font-size: 1.5rem;
    letter-spacing: -0.0194923em;
}

.font-inter .text-3xl,
.font-inter.text-3xl {
    font-size: 1.875rem;
    letter-spacing: -0.0213145em;
}

.font-inter .text-4xl,
.font-inter.text-4xl {
    font-size: 2.25rem;
    letter-spacing: -0.0219541em;
}

.font-inter .text-5xl,
.font-inter.text-5xl {
    font-size: 3rem;
    letter-spacing: -0.0222574em;
}

.font-inter .text-6xl,
.font-inter.text-6xl {
    font-size: 4rem;
    letter-spacing: -0.0222974em;
}
```

### Font features

Also the plugin generates utility classes which allow you to specify named font feature settings.

```js
// tailwind.config.js
module.exports = {
    theme: {
        interFontFeatures: {
            numeric: ['tnum', 'salt', 'ss02']
        }
    },
    plugins: [require('tailwindcss-font-inter')()]
};
```

This will generate the following classes:

```css
/* This is a default classes */
.font-inter .font-feature-normal,
.font-inter.font-feature-normal {
    font-feature-settings: normal;
}

.font-inter .font-feature-default,
.font-inter.font-feature-default {
    font-feature-settings: 'calt' 1, 'kern' 1;
}

/* This is a custom class defuned in config */
.font-inter .font-feature-numeric,
.font-inter.font-feature-numeric {
    font-feature-settings: 'tnum' 1, 'salt' 1, 'ss02' 1;
}
```

# License

[MIT](LICENSE.md)
