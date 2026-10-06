import type { HTMLPrintParams, IMAGEPrintParams, PDFPrintParams, PrintParams } from './types';
import HTMLPrint from './handlers/html';
import IMAGEPrint from './handlers/image';
import PDFPrint from './handlers/pdf';
import CommonUitls from './utils/common';


export function print(params: PrintParams) {
  const { printType = 'html' } = params || {};

  if (!CommonUitls.PrintTypes.includes(printType)) {
    throw new Error(`The parameter printType must be one of: ${CommonUitls.PrintTypes.join(', ')}.`);
  }

  switch (printType) {
    case 'image':
      const imagePrint = IMAGEPrint.getInstance();
      imagePrint.run(params as IMAGEPrintParams);
      break;
    case 'pdf':
      const pdfPrint = PDFPrint.getInstance();
      pdfPrint.run(params as PDFPrintParams);
      break;
    case 'html':
      const htmlPrint = HTMLPrint.getInstance();
      htmlPrint.run(params as HTMLPrintParams);
      break;
  }
}