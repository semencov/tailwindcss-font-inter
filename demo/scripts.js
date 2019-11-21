import tailwindConfig from '../tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig';

const { theme: { interFontFeatures, fontSize } } = resolveConfig(tailwindConfig);
const shortText = `
  <p class="font-black">Minute 360</p>
  <p class="font-semibold">Zenith zone</p>
  <p class="font-normal">1234567890!</p>
  <p class="font-thin">Grafik design</p>
`;
const longText = `
  <p class="whitespace-pre-wrap overflow-x-auto">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
  <p class="whitespace-pre-wrap overflow-x-auto">abcdefghijklmnopqrstuvwxyz</p>
  <p class="whitespace-pre-wrap overflow-x-auto">0 1 2 3 4 5 6 7 8 9  7*4  7×4  3/4  7÷8  3°  ℃  ℉</p>
  <p class="whitespace-pre-wrap overflow-x-auto">64%  90px  45 kg   $64 $7   €64  £7  1 440 ₽</p>
  <p class="whitespace-pre-wrap overflow-x-auto">Å Ä Ö Ë Ü Ï Ÿ å ä â ö ë ü ï î ÿ Ø ø • ∞ ~</p>
  <p class="whitespace-pre-wrap overflow-x-auto">. ‥ … → ← ↑ ↓</p>
`;

console.log(interFontFeatures, fontSize);

const query = selector => document.querySelector(selector);
const render = str => {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.firstElementChild;
};

function printFontSizes(sizes = {}) {
  let container = query('#fontSizes');

  if (container) {
    Object.entries(sizes)
      .reverse()
      .forEach(([name]) => {
        let el = render(
          `<div>
            <p class="text-xs text-gray-500 py-2">
              .text-inter-${name}
            </p>
            <div class="mb-10 text-inter-${name}">
              ${shortText}
            </div>
          </div>`
        );
        container.appendChild(el)
      });
  }
}

function printFontFeatures(features = {}) {
  let container = query('#fontFeatures');

  if (container) {
    Object.entries(features)
      .forEach(([name, value]) => {
        let el = render(
          `<div>
            <p class="text-xs text-gray-500 py-2">
              .font-feature-${name} (${value.join(', ')})
            </p>
            <div class="mb-10 text-inter-2xl font-feature-${name}">
              ${longText}
            </div>
          </div>`
        );
        container.appendChild(el)
      });
  }
}

printFontSizes(fontSize);
printFontFeatures(interFontFeatures);
