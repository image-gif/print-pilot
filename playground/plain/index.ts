import { print } from 'print-pilot';
function printForm() {
  print({
    printType: 'html',
    target: document.getElementById('box')!,
    deleteIframeAfterPrinting: false,
    ignoreModules: [
      document.getElementById('print')!,
    ],
    styles: [
      {
        type: 'stylesheet',
        value: `
        body {
          width: 200px;
          max-width: 200px;
        }
        `
      },
      // {
      //   type: 'link',
      //   value: 'xxx.css'
      // },
    ],
  });
}
const btn = document.getElementById('print');
btn?.addEventListener('click', () => printForm());