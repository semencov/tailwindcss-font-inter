# Tailwind Inter Plugin

TailwindCSS Plugin to integrate with Inter Typeface from Rasmus Andersson [@rsms](https://twitter.com/rsms). It adds `.font-inter` class to apply Inter font family, adjusts letter spacing for each font size according to the [Dynamic Metrics](https://rsms.me/inter/dynmetrics/) and allows to toggle font feature settings. Optionally adds `@font-face` from [https://rsms.me/inter/inter.css](https://rsms.me/inter/inter.css).

The plugin is inspired with [tailwind-plugin-inter-font](https://github.com/imsus/tailwind-plugin-font-inter) plugin developed by Imam Susanto [@imsus](https://github.com/imsus).

:warning: **This plugin produces pretty large amount of utility classes! It is highly recommended to use it in JIT-mode or with `purge` option.**


## Installation

```sh
# with npm
npm install --save-dev tailwindcss-font-inter

# or with yarn
yarn add -D tailwindcss-font-inter
```

## Usage

Add plugin to your `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {},
  variants: {},
  plugins: [require('tailwindcss-font-inter')]
}
```

Now you can put `.font-inter` class to apply the font (by default `@font-face` definitions will be added to your CSS).

```html
<body class="font-inter text-base text-black bg-white antialiased font-feature-default">
  ...
</body>
```

You can set additional options for plugin:

```js
// tailwind.config.js
module.exports = {
  /* ... */
  plugins: [
    require('tailwindcss-font-inter')({ // default settings
      a: -0.0223,
      b: 0.185,
      c: -0.1745,
      baseFontSize: 16,
      importFontFace: true,
    })
  ]
}
```


### Plugin Options

The plugin has several adjustable options.

-   `a`, `b`, `c` — constants used to calculate [Dynamic Metrics](https://rsms.me/inter/dynmetrics/).
-   `baseFontSize` — integer for base font size, default is `16`.
-   `importFontFace` — flag to inject Inter's `@font-face` to the output, default is `true`. If `false`, you should import Inter by yourself (e.g. from Google Fonts).


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
  plugins: [require('tailwindcss-font-inter')]
}
```


### Font Family

The plugin will inject `@font-face` declaration from https://rsms.me/inter/inter.css (set `importFontFace` option to `false` to import font manually) and add `.font-inter` utility class.


## Font Sizes

Alongside with the default `text-*` classes, the plugin will generate nested `text-*` to set letter spacing according to Inter's **Dynamic Metrics**. Also it will generate additional classes to adjust letter spacing for `tracking-*` modifiers according to the **Dynamic Metrics**.

```css
.font-inter .text-xs, .font-inter.text-xs {
  font-size: 0.75rem;
  letter-spacing: 0.000490774em
}
.font-inter .text-xs .tracking-tighter,
.font-inter .text-xs.tracking-tighter,
.font-inter.text-xs .tracking-tighter,
.font-inter.text-xs.tracking-tighter,
.tracking-tighter .font-inter .text-xs,
.tracking-tighter .font-inter.text-xs {
  font-size: 0.75rem;
  letter-spacing: -0.049509226em
}
/* ... */
```

And if the font size in config specified along with line height, it will be applied as well.

```js
module.exports = {
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1.25rem' }]
      // ...
    }
  },
  plugins: [require('tailwindcss-font-inter')]
};
```

Will generate classes like this:

```css
.font-inter .text-xs, .font-inter.text-xs {
  line-height: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.000490774em
}
/* ... */
```


### Font features

Also the plugin generates utility classes which allow you to specify named sets of font feature settings.

```js
// tailwind.config.js
module.exports = {
  theme: {
    interFontFeatures: {
      numeric: ['tnum', 'salt', 'ss02']
    }
  },
  plugins: [require('tailwindcss-font-inter')]
};
```

This will generate the following classes:

```css
/* This is default classes */
.font-inter .font-feature-normal,
.font-inter.font-feature-normal {
  font-feature-settings: normal;
}

.font-inter .font-feature-default,
.font-inter.font-feature-default {
  font-feature-settings: 'calt' 1, 'kern' 1;
}

/* This is a custom class defined in config */
.font-inter .font-feature-numeric,
.font-inter.font-feature-numeric {
  font-feature-settings: 'tnum' 1, 'salt' 1, 'ss02' 1;
}
```


# License

[MIT](LICENSE.md)
