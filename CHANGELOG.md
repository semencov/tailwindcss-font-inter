### Version 2.0.0

-   Inter font updated to v3.15
-   Fixed different size units caused `NaN` for letter spacing
-   Refactored styles generation
-   Removed line height usage as redundant
-   Removed plugin specific font size classes to use inherited classes instead (`.text-inter-lg` → `.font-inter .text-lg`)
-   Limited font feature settings classes to apply only if Inter font family applied (`.font-feature-numeric` → `.font-inter .font-feature-numeric`)
-   Added `.font-feature-default` class with `calt` and `kern` font feature settings enabled
-   Option `importFontFace` is now `true` by default

### Version 1.0.8

-   Replaced Object.fromEntries with lodash methods to provide compatability older Node.js versions

### Version 1.0.7

-   Fixed line height and letter spacing values calculation for different font sizes (#2, #3)

### Version 1.0.6

-   Fixed npm package missed files

### Version 1.0.5

-   Bump config adjustments

### Version 1.0.4

-   Bump config adjustments

### Version 1.0.3

-   Bump config

### Version 1.0.2

-   Inter font updated to v3.11
-   Demo page updated
-   Small improvements

### Version 1.0.1

-   Fixed exception when no `interFontFeatures` config specified.

### Version 1.0.0

Currently supports fot feature settings and dynamic line height with the different font sizes.

-   Inter font updated to v3.10 (1.000)
-   Updated README.md
