/* global: document */

const merge = require('lodash/merge')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const plugin = require('./src/index.js')

const Inter = require('./inter.json')

const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875em', { lineHeight: '1.25em' }],
  base: ['16px', { lineHeight: '24px' }],
  lg: ['1.125rem', { lineHeight: '175%' }],
  xl: ['1.25in', { lineHeight: '1.75' }],
  '2xl': ['15ch', { lineHeight: '2rem' }],
  '3xl': ['187%', { lineHeight: '2.25em' }],
  '4xl': ['2.25cm', { lineHeight: '2.5rem' }],
  '5xl': ['3ex', { lineHeight: '1' }],
  '6xl': ['3.75rem', { lineHeight: '1' }],
  '7xl': ['4.5rem', { lineHeight: '1' }],
  '8xl': ['6pt', { lineHeight: '1' }],
  '9xl': ['8mm', { lineHeight: '1' }],
  '10xl': '32px',
}

const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025ch',
  normal: '0em',
  wide: '0.025ex',
  wider: '0.05cm',
  widest: '0.1in',
}

expect.extend({
  toMatchCss(received, argument) {
    const stripped = str => str.replace(/[;\s]/g, '')

    if (stripped(received).includes(stripped(argument))) {
      return {
        message: () => `expected\n${received} not to match CSS ${argument}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected\n${received} to match CSS ${argument}`,
        pass: false,
      }
    }
  },
})

function generateCss(type, overrides) {
  const config = {
    theme: { fontSize, letterSpacing },
    safelist: [
      'font-inter',
      {
        pattern: /font-feature-(normal|default|numeric|case)/,
      },
    ],
    corePlugins: false,
    plugins: [plugin],
  }

  return postcss(tailwindcss(merge(config, overrides)))
    .process(`@tailwind ${type};`, {
      from: undefined,
    })
    .then(({ css }) => css)
}

test('it injects @font-face declaration', () => {
  const { base } = Inter

  const output = Object.entries(base)
    .map(([selector, properties]) =>
      properties
        .map(prop => {
          const body = Object.entries(prop).reduce(
            (rules, [property, value]) => rules + `${property}: ${value};`,
            ''
          )

          return `
              ${selector} {
                ${body}
              }
            `
        })
        .join('')
    )
    .join('')

  return generateCss('base').then(css => {
    expect(css).toMatchCss(output)
  })
})

test('it generates .font-inter class', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter {
          font-family: 'Inter', system-ui, sans-serif
      }
      @supports(font-variation-settings: normal) {
          .font-inter {
              font-family: 'Inter var', system-ui, sans-serif
          }
      }
    `)
  })
})

test('it generates default font feature classes', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .font-feature-normal, .font-inter.font-feature-normal {
        font-feature-settings: normal
      }
    `)
    expect(css).toMatchCss(`
      .font-inter .font-feature-default,.font-inter.font-feature-default {
        font-feature-settings: "calt" 1, "kern" 1
      }
    `)
  })
})

test('it generates custom font feature classes', () => {
  const options = {
    theme: {
      interFontFeatures: {
        numeric: ['tnum', 'salt', 'ss02'],
        case: { case: true },
      },
    },
  }
  return generateCss('utilities', options).then(css => {
    expect(css).toMatchCss(`
      .font-inter .font-feature-normal, .font-inter.font-feature-normal {
        font-feature-settings: normal
      }

      .font-inter .font-feature-numeric,.font-inter.font-feature-numeric {
        font-feature-settings: "salt" 1, "ss02" 1, "tnum" 1
      }

      .font-inter .font-feature-case,.font-inter.font-feature-case {
        font-feature-settings: "case" 1
      }

      .font-inter .font-feature-default,.font-inter.font-feature-default {
        font-feature-settings: "calt" 1, "kern" 1
      }
    `)
  })
})

test('it generates default font feature classes', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .font-feature-normal, .font-inter.font-feature-normal {
        font-feature-settings: normal
      }
    `)
    expect(css).toMatchCss(`
      .font-inter .font-feature-default,.font-inter.font-feature-default {
        font-feature-settings: "calt" 1, "kern" 1
      }
    `)
  })
})

test('it generates classes for font-size = 0.75rem and line-height = 1rem', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-xs, .font-inter.text-xs {
        line-height: 1rem;
        font-size: 0.75rem;
        letter-spacing: 0.000490774em
      }
      .font-inter .text-xs .tracking-tighter, .font-inter .text-xs.tracking-tighter, .font-inter.text-xs .tracking-tighter, .font-inter.text-xs.tracking-tighter, .tracking-tighter .font-inter .text-xs, .tracking-tighter .font-inter.text-xs {
        line-height: 1rem;
        font-size: 0.75rem;
        letter-spacing: -0.049509226em
      }
      .font-inter .text-xs .tracking-tight, .font-inter .text-xs.tracking-tight, .font-inter.text-xs .tracking-tight, .font-inter.text-xs.tracking-tight, .tracking-tight .font-inter .text-xs, .tracking-tight .font-inter.text-xs {
        line-height: 1rem;
        font-size: 0.75rem;
        letter-spacing: -0.016175892em
      }
      .font-inter .text-xs .tracking-normal, .font-inter .text-xs.tracking-normal, .font-inter.text-xs .tracking-normal, .font-inter.text-xs.tracking-normal, .tracking-normal .font-inter .text-xs, .tracking-normal .font-inter.text-xs {
        line-height: 1rem;
        font-size: 0.75rem;
        letter-spacing: 0.000490774em
      }
      .font-inter .text-xs .tracking-wide, .font-inter .text-xs.tracking-wide, .font-inter.text-xs .tracking-wide, .font-inter.text-xs.tracking-wide, .tracking-wide .font-inter .text-xs, .tracking-wide .font-inter.text-xs {
        line-height: 1rem;
        font-size: 0.75rem;
        letter-spacing: 0.015399629em
      }
      .font-inter .text-xs .tracking-wider, .font-inter .text-xs.tracking-wider, .font-inter.text-xs .tracking-wider, .font-inter.text-xs.tracking-wider, .tracking-wider .font-inter .text-xs, .tracking-wider .font-inter.text-xs {
        line-height: 1rem;
        font-size: 0.75rem;
        letter-spacing: 0.157971089em
      }
      .font-inter .text-xs .tracking-widest, .font-inter .text-xs.tracking-widest, .font-inter.text-xs .tracking-widest, .font-inter.text-xs.tracking-widest, .tracking-widest .font-inter .text-xs, .tracking-widest .font-inter.text-xs {
        line-height: 1rem;
        font-size: 0.75rem;
        letter-spacing: 0.800490774em
      }
    `)
  })
})

test('it generates classes for font-size = 0.875em and line-height = 1.25em', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-sm, .font-inter.text-sm {
        line-height: 1.25em;
        font-size: 0.875em;
        letter-spacing: -0.006223544em
      }
      .font-inter .text-sm .tracking-tighter, .font-inter .text-sm.tracking-tighter, .font-inter.text-sm .tracking-tighter, .font-inter.text-sm.tracking-tighter, .tracking-tighter .font-inter .text-sm, .tracking-tighter .font-inter.text-sm {
        line-height: 1.25em;
        font-size: 0.875em;
        letter-spacing: -0.056223544em
      }
      .font-inter .text-sm .tracking-tight, .font-inter .text-sm.tracking-tight, .font-inter.text-sm .tracking-tight, .font-inter.text-sm.tracking-tight , .tracking-tight .font-inter .text-sm, .tracking-tight .font-inter.text-sm{
        line-height: 1.25em;
        font-size: 0.875em;
        letter-spacing: -0.020509259em
      }
      .font-inter .text-sm .tracking-normal, .font-inter .text-sm.tracking-normal, .font-inter.text-sm .tracking-normal, .font-inter.text-sm.tracking-normal, .tracking-normal .font-inter .text-sm, .tracking-normal .font-inter.text-sm {
        line-height: 1.25em;
        font-size: 0.875em;
        letter-spacing: -0.006223544em
      }
      .font-inter .text-sm .tracking-wide, .font-inter .text-sm.tracking-wide, .font-inter.text-sm .tracking-wide, .font-inter.text-sm.tracking-wide, .tracking-wide .font-inter .text-sm, .tracking-wide .font-inter.text-sm {
        line-height: 1.25em;
        font-size: 0.875em;
        letter-spacing: 0.006555474em
      }
      .font-inter .text-sm .tracking-wider, .font-inter .text-sm.tracking-wider, .font-inter.text-sm .tracking-wider, .font-inter.text-sm.tracking-wider, .tracking-wider .font-inter .text-sm, .tracking-wider .font-inter.text-sm {
        line-height: 1.25em;
        font-size: 0.875em;
        letter-spacing: 0.128759583em
      }
      .font-inter .text-sm .tracking-widest, .font-inter .text-sm.tracking-widest, .font-inter.text-sm .tracking-widest, .font-inter.text-sm.tracking-widest, .tracking-widest .font-inter .text-sm, .tracking-widest .font-inter.text-sm {
        line-height: 1.25em;
        font-size: 0.875em;
        letter-spacing: 0.679490741em
      }
    `)
  })
})

test('it generates classes for font-size = 16px and line-height = 24px', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-base, .font-inter.text-base {
        line-height: 24px;
        font-size: 16px;
        letter-spacing: -0.010959779em
      }
      .font-inter .text-base .tracking-tighter, .font-inter .text-base.tracking-tighter, .font-inter.text-base .tracking-tighter, .font-inter.text-base.tracking-tighter, .tracking-tighter .font-inter .text-base, .tracking-tighter .font-inter.text-base {
        line-height: 24px;
        font-size: 16px;
        letter-spacing: -0.060959779em
      }
      .font-inter .text-base .tracking-tight, .font-inter .text-base.tracking-tight, .font-inter.text-base .tracking-tight, .font-inter.text-base.tracking-tight, .tracking-tight .font-inter .text-base, .tracking-tight .font-inter.text-base {
        line-height: 24px;
        font-size: 16px;
        letter-spacing: -0.023459779em
      }
      .font-inter .text-base .tracking-normal, .font-inter .text-base.tracking-normal, .font-inter.text-base .tracking-normal, .font-inter.text-base.tracking-normal, .tracking-normal .font-inter .text-base, .tracking-normal .font-inter.text-base {
        line-height: 24px;
        font-size: 16px;
        letter-spacing: -0.010959779em
      }
      .font-inter .text-base .tracking-wide, .font-inter .text-base.tracking-wide, .font-inter.text-base .tracking-wide, .font-inter.text-base.tracking-wide, .tracking-wide .font-inter .text-base, .tracking-wide .font-inter.text-base {
        line-height: 24px;
        font-size: 16px;
        letter-spacing: 0.000221862em
      }
      .font-inter .text-base .tracking-wider, .font-inter .text-base.tracking-wider, .font-inter.text-base .tracking-wider, .font-inter.text-base.tracking-wider, .tracking-wider .font-inter .text-base, .tracking-wider .font-inter.text-base {
        line-height: 24px;
        font-size: 16px;
        letter-spacing: 0.107150458em
      }
      .font-inter .text-base .tracking-widest, .font-inter .text-base.tracking-widest, .font-inter.text-base .tracking-widest, .font-inter.text-base.tracking-widest, .tracking-widest .font-inter .text-base, .tracking-widest .font-inter.text-base {
        line-height: 24px;
        font-size: 16px;
        letter-spacing: 0.589040221em
      }
    `)
  })
})

test('it generates classes for font-size = 1.125rem and line-height = 175%', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-lg, .font-inter.text-lg {
        line-height: 175%;
        font-size: 1.125rem;
        letter-spacing: -0.014300686em
      }
      .font-inter .text-lg .tracking-tighter, .font-inter .text-lg.tracking-tighter, .font-inter.text-lg .tracking-tighter, .font-inter.text-lg.tracking-tighter, .tracking-tighter .font-inter .text-lg, .tracking-tighter .font-inter.text-lg {
        line-height: 175%;
        font-size: 1.125rem;
        letter-spacing: -0.064300686em
      }
      .font-inter .text-lg .tracking-tight, .font-inter .text-lg.tracking-tight, .font-inter.text-lg .tracking-tight, .font-inter.text-lg.tracking-tight, .tracking-tight .font-inter .text-lg, .tracking-tight .font-inter.text-lg {
        line-height: 175%;
        font-size: 1.125rem;
        letter-spacing: -0.025411797em
      }
      .font-inter .text-lg .tracking-normal, .font-inter .text-lg.tracking-normal, .font-inter.text-lg .tracking-normal, .font-inter.text-lg.tracking-normal, .tracking-normal .font-inter .text-lg, .tracking-normal .font-inter.text-lg {
        line-height: 175%;
        font-size: 1.125rem;
        letter-spacing: -0.014300686em
      }
      .font-inter .text-lg .tracking-wide, .font-inter .text-lg.tracking-wide, .font-inter.text-lg .tracking-wide, .font-inter.text-lg.tracking-wide, .tracking-wide .font-inter .text-lg, .tracking-wide .font-inter.text-lg {
        line-height: 175%;
        font-size: 1.125rem;
        letter-spacing: -0.00436145em
      }
      .font-inter .text-lg .tracking-wider, .font-inter .text-lg.tracking-wider, .font-inter.text-lg .tracking-wider, .font-inter.text-lg.tracking-wider, .tracking-wider .font-inter .text-lg, .tracking-wider .font-inter.text-lg {
        line-height: 175%;
        font-size: 1.125rem;
        letter-spacing: 0.090686191em
      }
      .font-inter .text-lg .tracking-widest, .font-inter .text-lg.tracking-widest, .font-inter.text-lg .tracking-widest, .font-inter.text-lg.tracking-widest, .tracking-widest .font-inter .text-lg, .tracking-widest .font-inter.text-lg {
        line-height: 175%;
        font-size: 1.125rem;
        letter-spacing: 0.519032648em
      }
    `)
  })
})

test('it generates classes for font-size = 1.25in and line-height = 1.75', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-xl, .font-inter.text-xl {
        line-height: 1.75;
        font-size: 1.25in;
        letter-spacing: -0.0223em
      }
      .font-inter .text-xl .tracking-tighter, .font-inter .text-xl.tracking-tighter, .font-inter.text-xl .tracking-tighter, .font-inter.text-xl.tracking-tighter, .tracking-tighter .font-inter .text-xl, .tracking-tighter .font-inter.text-xl {
        line-height: 1.75;
        font-size: 1.25in;
        letter-spacing: -0.0723em
      }
      .font-inter .text-xl .tracking-tight, .font-inter .text-xl.tracking-tight, .font-inter.text-xl .tracking-tight, .font-inter.text-xl.tracking-tight, .tracking-tight .font-inter .text-xl, .tracking-tight .font-inter.text-xl {
        line-height: 1.75;
        font-size: 1.25in;
        letter-spacing: -0.023966667em
      }
      .font-inter .text-xl .tracking-normal, .font-inter .text-xl.tracking-normal, .font-inter.text-xl .tracking-normal, .font-inter.text-xl.tracking-normal, .tracking-normal .font-inter .text-xl, .tracking-normal .font-inter.text-xl {
        line-height: 1.75;
        font-size: 1.25in;
        letter-spacing: -0.0223em
      }
      .font-inter .text-xl .tracking-wide, .font-inter .text-xl.tracking-wide, .font-inter.text-xl .tracking-wide, .font-inter.text-xl.tracking-wide, .tracking-wide .font-inter .text-xl, .tracking-wide .font-inter.text-xl {
        line-height: 1.75;
        font-size: 1.25in;
        letter-spacing: -0.020809114em
      }
      .font-inter .text-xl .tracking-wider, .font-inter .text-xl.tracking-wider, .font-inter.text-xl .tracking-wider, .font-inter.text-xl.tracking-wider, .tracking-wider .font-inter .text-xl, .tracking-wider .font-inter.text-xl {
        line-height: 1.75;
        font-size: 1.25in;
        letter-spacing: -0.006551968em
      }
      .font-inter .text-xl .tracking-widest, .font-inter .text-xl.tracking-widest, .font-inter.text-xl .tracking-widest, .font-inter.text-xl.tracking-widest, .tracking-widest .font-inter .text-xl, .tracking-widest .font-inter.text-xl {
        line-height: 1.75;
        font-size: 1.25in;
        letter-spacing: 0.0577em
      }
    `)
  })
})

test('it generates classes for font-size = 15ch and line-height = 2rem', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-2xl, .font-inter.text-2xl {
        line-height: 2rem;
        font-size: 15ch;
        letter-spacing: -0.0223em
      }
      .font-inter .text-2xl .tracking-tighter, .font-inter .text-2xl.tracking-tighter, .font-inter.text-2xl .tracking-tighter, .font-inter.text-2xl.tracking-tighter, .tracking-tighter .font-inter .text-2xl, .tracking-tighter .font-inter.text-2xl {
        line-height: 2rem;
        font-size: 15ch;
        letter-spacing: -0.0723em
      }
      .font-inter .text-2xl .tracking-tight, .font-inter .text-2xl.tracking-tight, .font-inter.text-2xl .tracking-tight, .font-inter.text-2xl.tracking-tight, .tracking-tight .font-inter .text-2xl, .tracking-tight .font-inter.text-2xl {
        line-height: 2rem;
        font-size: 15ch;
        letter-spacing: -0.023966667em
      }
      .font-inter .text-2xl .tracking-normal, .font-inter .text-2xl.tracking-normal, .font-inter.text-2xl .tracking-normal, .font-inter.text-2xl.tracking-normal, .tracking-normal .font-inter .text-2xl, .tracking-normal .font-inter.text-2xl {
        line-height: 2rem;
        font-size: 15ch;
        letter-spacing: -0.0223em
      }
      .font-inter .text-2xl .tracking-wide, .font-inter .text-2xl.tracking-wide, .font-inter.text-2xl .tracking-wide, .font-inter.text-2xl.tracking-wide, .tracking-wide .font-inter .text-2xl, .tracking-wide .font-inter.text-2xl {
        line-height: 2rem;
        font-size: 15ch;
        letter-spacing: -0.020809114em
      }
      .font-inter .text-2xl .tracking-wider, .font-inter .text-2xl.tracking-wider, .font-inter.text-2xl .tracking-wider, .font-inter.text-2xl.tracking-wider, .tracking-wider .font-inter .text-2xl, .tracking-wider .font-inter.text-2xl {
        line-height: 2rem;
        font-size: 15ch;
        letter-spacing: -0.006551968em
      }
      .font-inter .text-2xl .tracking-widest, .font-inter .text-2xl.tracking-widest, .font-inter.text-2xl .tracking-widest, .font-inter.text-2xl.tracking-widest, .tracking-widest .font-inter .text-2xl, .tracking-widest .font-inter.text-2xl {
        line-height: 2rem;
        font-size: 15ch;
        letter-spacing: 0.0577em
      }
    `)
  })
})

test('it generates classes for font-size = 187% and line-height = 2.25em', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-3xl, .font-inter.text-3xl {
        line-height: 2.25em;
        font-size: 187%;
        letter-spacing: -0.021300684em
      }
      .font-inter .text-3xl .tracking-tighter, .font-inter .text-3xl.tracking-tighter, .font-inter.text-3xl .tracking-tighter, .font-inter.text-3xl.tracking-tighter, .tracking-tighter .font-inter .text-3xl, .tracking-tighter .font-inter.text-3xl {
        line-height: 2.25em;
        font-size: 187%;
        letter-spacing: -0.071300684em
      }
      .font-inter .text-3xl .tracking-tight, .font-inter .text-3xl.tracking-tight, .font-inter.text-3xl .tracking-tight, .font-inter.text-3xl.tracking-tight, .tracking-tight .font-inter .text-3xl, .tracking-tight .font-inter.text-3xl {
        line-height: 2.25em;
        font-size: 187%;
        letter-spacing: -0.027985176em
      }
      .font-inter .text-3xl .tracking-normal, .font-inter .text-3xl.tracking-normal, .font-inter.text-3xl .tracking-normal, .font-inter.text-3xl.tracking-normal, .tracking-normal .font-inter .text-3xl, .tracking-normal .font-inter.text-3xl {
        line-height: 2.25em;
        font-size: 187%;
        letter-spacing: -0.021300684em
      }
      .font-inter .text-3xl .tracking-wide, .font-inter .text-3xl.tracking-wide, .font-inter.text-3xl .tracking-wide, .font-inter.text-3xl.tracking-wide, .tracking-wide .font-inter .text-3xl, .tracking-wide .font-inter.text-3xl {
        line-height: 2.25em;
        font-size: 187%;
        letter-spacing: -0.015321197em
      }
      .font-inter .text-3xl .tracking-wider, .font-inter .text-3xl.tracking-wider, .font-inter.text-3xl .tracking-wider, .font-inter.text-3xl.tracking-wider, .tracking-wider .font-inter .text-3xl, .tracking-wider .font-inter.text-3xl {
        line-height: 2.25em;
        font-size: 187%;
        letter-spacing: 0.04185987em
      }
      .font-inter .text-3xl .tracking-widest, .font-inter .text-3xl.tracking-widest, .font-inter.text-3xl .tracking-widest, .font-inter.text-3xl.tracking-widest, .tracking-widest .font-inter .text-3xl, .tracking-widest .font-inter.text-3xl {
        line-height: 2.25em;
        font-size: 187%;
        letter-spacing: 0.299554931em
      }
    `)
  })
})

test('it generates classes for font-size = 2.25cm and line-height = 2.5rem', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-4xl, .font-inter.text-4xl {
        line-height: 2.5rem;
        font-size: 2.25cm;
        letter-spacing: -0.022299934em
      }
      .font-inter .text-4xl .tracking-tighter, .font-inter .text-4xl.tracking-tighter, .font-inter.text-4xl .tracking-tighter, .font-inter.text-4xl.tracking-tighter, .tracking-tighter .font-inter .text-4xl, .tracking-tighter .font-inter.text-4xl {
        line-height: 2.5rem;
        font-size: 2.25cm;
        letter-spacing: -0.072299934em
      }
      .font-inter .text-4xl .tracking-tight, .font-inter .text-4xl.tracking-tight, .font-inter.text-4xl .tracking-tight, .font-inter.text-4xl.tracking-tight, .tracking-tight .font-inter .text-4xl, .tracking-tight .font-inter.text-4xl {
        line-height: 2.5rem;
        font-size: 2.25cm;
        letter-spacing: -0.024651785em
      }
      .font-inter .text-4xl .tracking-normal, .font-inter .text-4xl.tracking-normal, .font-inter.text-4xl .tracking-normal, .font-inter.text-4xl.tracking-normal, .tracking-normal .font-inter .text-4xl, .tracking-normal .font-inter.text-4xl {
        line-height: 2.5rem;
        font-size: 2.25cm;
        letter-spacing: -0.022299934em
      }
      .font-inter .text-4xl .tracking-wide, .font-inter .text-4xl.tracking-wide, .font-inter.text-4xl .tracking-wide, .font-inter.text-4xl.tracking-wide, .tracking-wide .font-inter .text-4xl, .tracking-wide .font-inter.text-4xl {
        line-height: 2.5rem;
        font-size: 2.25cm;
        letter-spacing: -0.020196129em
      }
      .font-inter .text-4xl .tracking-wider, .font-inter .text-4xl.tracking-wider, .font-inter.text-4xl .tracking-wider, .font-inter.text-4xl.tracking-wider, .tracking-wider .font-inter .text-4xl, .tracking-wider .font-inter.text-4xl {
        line-height: 2.5rem;
        font-size: 2.25cm;
        letter-spacing: -0.000077711em
      }
      .font-inter .text-4xl .tracking-widest, .font-inter .text-4xl.tracking-widest, .font-inter.text-4xl .tracking-widest, .font-inter.text-4xl.tracking-widest, .tracking-widest .font-inter .text-4xl, .tracking-widest .font-inter.text-4xl {
        line-height: 2.5rem;
        font-size: 2.25cm;
        letter-spacing: 0.090588955em
      }
    `)
  })
})

test('it generates classes for font-size = 6pt and line-height = 1', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-8xl, .font-inter.text-8xl {
        line-height: 1;
        font-size: 6pt;
        letter-spacing: 0.023503286em
      }
      .font-inter .text-8xl .tracking-tighter, .font-inter .text-8xl.tracking-tighter, .font-inter.text-8xl .tracking-tighter, .font-inter.text-8xl.tracking-tighter, .tracking-tighter .font-inter .text-8xl, .tracking-tighter .font-inter.text-8xl {
        line-height: 1;
        font-size: 6pt;
        letter-spacing: -0.026496714em
      }
      .font-inter .text-8xl .tracking-tight, .font-inter .text-8xl.tracking-tight, .font-inter.text-8xl .tracking-tight, .font-inter.text-8xl.tracking-tight, .tracking-tight .font-inter .text-8xl, .tracking-tight .font-inter.text-8xl {
        line-height: 1;
        font-size: 6pt;
        letter-spacing: -0.001496714em
      }
      .font-inter .text-8xl .tracking-normal, .font-inter .text-8xl.tracking-normal, .font-inter.text-8xl .tracking-normal, .font-inter.text-8xl.tracking-normal, .tracking-normal .font-inter .text-8xl, .tracking-normal .font-inter.text-8xl {
        line-height: 1;
        font-size: 6pt;
        letter-spacing: 0.023503286em
      }
      .font-inter .text-8xl .tracking-wide, .font-inter .text-8xl.tracking-wide, .font-inter.text-8xl .tracking-wide, .font-inter.text-8xl.tracking-wide, .tracking-wide .font-inter .text-8xl, .tracking-wide .font-inter.text-8xl {
        line-height: 1;
        font-size: 6pt;
        letter-spacing: 0.045866567em
      }
      .font-inter .text-8xl .tracking-wider, .font-inter .text-8xl.tracking-wider, .font-inter.text-8xl .tracking-wider, .font-inter.text-8xl.tracking-wider, .tracking-wider .font-inter .text-8xl, .tracking-wider .font-inter.text-8xl {
        line-height: 1;
        font-size: 6pt;
        letter-spacing: 0.259723758em
      }
      .font-inter .text-8xl .tracking-widest, .font-inter .text-8xl.tracking-widest, .font-inter.text-8xl .tracking-widest, .font-inter.text-8xl.tracking-widest, .tracking-widest .font-inter .text-8xl, .tracking-widest .font-inter.text-8xl {
        line-height: 1;
        font-size: 6pt;
        letter-spacing: 1.223503286em
      }
    `)
  })
})
test('it generates classes for font-size = 32px and no line-height', () => {
  return generateCss('utilities').then(css => {
    expect(css).toMatchCss(`
      .font-inter .text-10xl, .font-inter.text-10xl {
        font-size: 32px;
        letter-spacing: -0.021604862em
      }
      .font-inter .text-10xl .tracking-tighter, .font-inter .text-10xl.tracking-tighter, .font-inter.text-10xl .tracking-tighter, .font-inter.text-10xl.tracking-tighter, .tracking-tighter .font-inter .text-10xl, .tracking-tighter .font-inter.text-10xl {
        font-size: 32px;
        letter-spacing: -0.071604862em
      }
      .font-inter .text-10xl .tracking-tight, .font-inter .text-10xl.tracking-tight, .font-inter.text-10xl .tracking-tight, .font-inter.text-10xl.tracking-tight, .tracking-tight .font-inter .text-10xl, .tracking-tight .font-inter.text-10xl {
        font-size: 32px;
        letter-spacing: -0.027854862em
      }
      .font-inter .text-10xl .tracking-normal, .font-inter .text-10xl.tracking-normal, .font-inter.text-10xl .tracking-normal, .font-inter.text-10xl.tracking-normal, .tracking-normal .font-inter .text-10xl, .tracking-normal .font-inter.text-10xl {
        font-size: 32px;
        letter-spacing: -0.021604862em
      }
      .font-inter .text-10xl .tracking-wide, .font-inter .text-10xl.tracking-wide, .font-inter.text-10xl .tracking-wide, .font-inter.text-10xl.tracking-wide, .tracking-wide .font-inter .text-10xl, .tracking-wide .font-inter.text-10xl {
        font-size: 32px;
        letter-spacing: -0.016014041em
      }
      .font-inter .text-10xl .tracking-wider, .font-inter .text-10xl.tracking-wider, .font-inter.text-10xl .tracking-wider, .font-inter.text-10xl.tracking-wider, .tracking-wider .font-inter .text-10xl, .tracking-wider .font-inter.text-10xl {
        font-size: 32px;
        letter-spacing: 0.037450257em
      }
      .font-inter .text-10xl .tracking-widest, .font-inter .text-10xl.tracking-widest, .font-inter.text-10xl .tracking-widest, .font-inter.text-10xl.tracking-widest, .tracking-widest .font-inter .text-10xl, .tracking-widest .font-inter.text-10xl {
        font-size: 32px;
        letter-spacing: 0.278395138em
      }
    `)
  })
})
