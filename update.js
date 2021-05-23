#!/usr/bin/env node

const { writeFile } = require('fs').promises
const url = require('url')
const path = require('path')
const fetch = require('node-fetch')
const postcss = require('postcss')
const fontkit = require('fontkit')
const mkdirp = require('mkdirp').sync
const rimraf = require('rimraf').sync

const TEMP = path.resolve('.temp')

const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-')

const interUrl = 'https://rsms.me/inter/'
const interSource = interUrl + 'inter.css'
const interFamilies = new Set([])
const interFiles = new Set([])
const inter = {
  version: null,
  availableFeatures: new Set([]),
  base: {
    '@font-face': [],
  },
  utilities: {
    '.font-inter': {
      'font-family': "'Inter', system-ui, sans-serif",
    },
    '@supports(font-variation-settings: normal)': {
      '.font-inter': {
        'font-family': "'Inter var', system-ui, sans-serif",
      },
    },
  },
}

const extractCss = root => {
  console.info('Parsing fetched CSS...')

  root.walkAtRules(rule => {
    let declarations = {}

    rule.walkDecls(decl => {
      let name = toKebabCase(decl.prop)
      let value = decl.value
        .split(',')
        .map(val => val.trim())
        .join(', ')

      if (name === 'font-family') {
        let fontName = value.replace(/^['"]|['"]$/g, '').trim()
        if (!fontName.match(/\salt$/)) {
          interFamilies.add(fontName)
        }
      }

      if (name === 'src') {
        let vals = value.match(/url\(['"]([^'"]*)['"]\)/gi)

        if (vals) {
          vals.forEach(val => {
            val = val.replace(/^url\(['"]|['"]\)$/g, '')
            value = value.replace(val, interUrl + val)
            interFiles.add(interUrl + val)
          })
        }
      }

      declarations[name] = value
    })

    if (declarations['font-family'].match(/\salt\b/)) {
      console.log('Excluding declaration for font', declarations['font-family'])
      return
    }

    if (declarations['font-family'].match(/\sexperimental\b/)) {
      console.log('Excluding declaration for font', declarations['font-family'])
      return
    }

    inter.base[`@${rule.name}`].push(declarations)
  })

  console.log('Found font families:', [...interFamilies].join(', '))
}

const download = (fileUrl, file = null) => {
  if (!file) {
    const parsed = url.parse(fileUrl)
    const fileName = path.basename(parsed.pathname)
    file = path.join(TEMP, fileName)
  }

  require('child_process').execFileSync('curl', ['--silent', '-o', file, '-L', fileUrl], {
    encoding: 'utf8',
  })

  return file
}

console.info('Fetching', interSource)

rimraf(TEMP)
mkdirp(TEMP)

fetch(interSource)
  .then(res => res.text())
  .then(css => postcss([extractCss]).process(css, { from: undefined }))
  .then(() => {
    console.info('Fetching font files...')

    for (let fontFile of interFiles) {
      let file = download(fontFile)
      let font = fontkit.openSync(file)

      inter.version = font.version.replace(/Version\s/, '')
      font.availableFeatures.forEach(feature => inter.availableFeatures.add(feature))
    }

    inter.availableFeatures = [...inter.availableFeatures].sort()

    console.log('Font version:', inter.version)
    console.log('Found font features:', inter.availableFeatures.join(', '))
  })
  .then(async () => {
    let file = path.join(__dirname, 'inter.json')
    await writeFile(file, JSON.stringify(inter))
    console.info('Finished. Meta data stored in ./inter.json')
  })
  .catch(err => console.error(err))
