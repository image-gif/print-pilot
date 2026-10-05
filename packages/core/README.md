# PrintPilot

> Your co-pilot for browser printing.
> A TypeScript-first toolkit for printing HTML, images, and PDF in the browser.

## Feature

* html printing

* image printing

* pdf printing

## Usage

* install
```shell
pnpm add print-pilot
```

* import and use
```ts
import { print } from 'print-pilot';

print({
  printType: 'html',
  target: document.getElementById('print-area-id')
});
```

## Reference
* [print-js](https://github.com/crabbly/Print.js): A tiny javascript library to help printing from the web.

## License
PrintPilot is available under the MIT license.