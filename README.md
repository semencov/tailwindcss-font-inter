# Tailwind Inter Plugin

A TailwindCSS plugin that seamlessly integrates the beautiful Inter typeface by Rasmus Andersson ([@rsms](https://twitter.com/rsms)) into your projects. This plugin provides a complete solution for using Inter font with proper metrics and advanced OpenType features.

## Features

- 🎯 Adds `.font-inter` utility class for easy font family application
- ⚙️ Configurable OpenType feature settings (ligatures, numerics, case features, etc.)
- 🔄 Automatic `@font-face` injection from [Inter's CDN](https://rsms.me/inter/inter.css)
- 🎨 Works seamlessly with Tailwind's fontSize configuration
- 🚀 Zero configuration required to get started

## Installation

```sh
# with npm
npm install --save-dev tailwindcss-font-inter

# or with yarn
yarn add -D tailwindcss-font-inter
```

## Quick Start

Add the plugin to your `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {},
  plugins: [require('tailwindcss-font-inter')]
}
```

Now you can put `.font-inter` class to apply the font (by default `@font-face` definitions will be added to your CSS).

```html
<body class="font-inter font-feature-default antialiased">
  <h1 class="text-4xl font-bold">Beautiful Typography</h1>
  <p class="text-base">Your content with the full power of the Inter font features.</p>
</body>
```

## Configuration

### Plugin Options

Customize the plugin behavior with these options:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('tailwindcss-font-inter')({
      importFontFace: true, // Set to false if you want to import Inter from elsewhere
    })
  ]
}
```

### Font Features

Define custom sets of OpenType features:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      interFontFeatures: {
        numeric: ['tnum', 'salt', 'ss02'], // Tabular numbers with stylistic alternates
        case: ['case'],                     // Case-sensitive forms
        fractions: ['frac'],                // Enable fractions
        'stylistic-one': ['ss01']          // Stylistic Set 1
      }
    }
  },
  plugins: [require('tailwindcss-font-inter')]
}
```

This generates utility classes like:

```css
/* Default features */
.font-feature-default { font-feature-settings: 'calt' 1, 'kern' 1; }
.font-feature-normal { font-feature-settings: normal; }

/* Custom features */
.font-feature-numeric { font-feature-settings: 'tnum' 1, 'salt' 1, 'ss02' 1; }
.font-feature-case { font-feature-settings: 'case' 1; }
.font-feature-fractions { font-feature-settings: 'frac' 1; }
.font-feature-stylistic-one { font-feature-settings: 'ss01' 1; }
```

## Manual Font Import

If you set `importFontFace: false`, you'll need to import Inter yourself. You can use Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or import directly from Inter's CDN:

```css
@import url('https://rsms.me/inter/inter.css');
```

## Browser Support

Inter works in all modern browsers. The font-feature-settings are supported in:
- Chrome 48+
- Firefox 34+
- Safari 9.1+
- Edge 15+

## Credits

This plugin is inspired by [tailwind-plugin-inter-font](https://github.com/imsus/tailwind-plugin-font-inter) by Imam Susanto ([@imsus](https://github.com/imsus)).

## License

[MIT](LICENSE.md)
