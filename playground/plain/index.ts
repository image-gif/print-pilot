import { print } from 'print-pilot';
function printForm() {
  print({
    printType: 'html',
    target: document.getElementById('box')!,
    // deleteIframeAfterPrinting: false,
    ignoreModules: [
      document.getElementById('print')!,
    ],
    onBeforePrint() {
      console.log("onBeforePrint");
    },
    onAfterPrint() {
      console.log("onAfterPrint");
    },
    styles: [
      {
        type: 'stylesheet',
        value: `
        #box {
          border: 1px solid #000 !important;
        }
        `
      },
    ],
  });
}

function printImage() {
  print({
    printType: 'image',
    target: [
      {
        type: 'link',
        value: 'http://localhost:5173/back.png',
        width: 700,
      },
    ],
    // deleteIframeAfterPrinting: false,
  });
}

function printImageFile(e: Event) {
  print({
    printType: 'image',
    target: Array.from((e.target as HTMLInputElement).files || []).map(file => ({
      type: 'file',
      value: file,
      width: 700
    })),
  })
}

function printPdfFile(e: Event) {
  const files = (e.target as HTMLInputElement).files || [];
  print({
    printType: 'pdf',
    target: {
      type: 'file',
      value: files[0]
    },
    deleteIframeAfterPrinting: false
  })
}

function printPdf() {
  print({
    printType: 'pdf',
    target: {
      type: 'link',
      value: 'http://localhost:5173/demo.pdf'
    },
    // deleteIframeAfterPrinting: false,
  });
}

const btn = document.getElementById('print');
btn?.addEventListener('click', printForm);

const btnImage = document.getElementById('print-image');
btnImage?.addEventListener('click', printImage);

const btnImageFile = document.getElementById('print-image-file');
btnImageFile?.addEventListener('change', printImageFile);

const btnPdf = document.getElementById('print-pdf');
btnPdf?.addEventListener('click', printPdf);

const btnPdfFile = document.getElementById('print-pdf-file');
btnPdfFile?.addEventListener('change', printPdfFile);