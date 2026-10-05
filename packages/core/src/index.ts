import HTMLPrint from './handlers/html';
import IMAGEPrint from './handlers/image';
import type { HTMLPrintParams, IMAGEPrintParams, PrintParams } from './types';
import CommonUitls from './utils/common';

export function print(params: PrintParams) {
  const { printType = 'html' } = params || {};

  if (!CommonUitls.PrintTypes.includes(printType)) {
    throw new Error(`The parameter printType must be one of: ${CommonUitls.PrintTypes.join(', ')}.`);
  }

  switch (printType) {
    case 'image':
      // TODO: finishing Image handler
      const imagePrint = IMAGEPrint.getInstance();
      imagePrint.run(params as IMAGEPrintParams);
    case 'html':
    default:
      const htmlPrint = HTMLPrint.getInstance();
      htmlPrint.run(params as HTMLPrintParams);
  }
}