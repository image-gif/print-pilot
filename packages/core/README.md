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

## Acknowledgments

This project was inspired by the design goals of [print-js](https://github.com/crabbly/Print.js), 
a tiny JavaScript library for printing from the web. 

PrintPilot is an independent implementation written from scratch in TypeScript. 
No source code from print-js has been copied or incorporated into this project. 
The API surface and feature set were designed independently based on common 
browser printing requirements.

## License
PrintPilot is available under the MIT license.