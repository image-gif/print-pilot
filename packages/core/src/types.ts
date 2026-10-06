namespace ImagePrintType {
  type BaseTarget = {
    /**
     * @description Image Element's class, You can set the style through the styles(BasePrintParams.styles) parameter
     **/
    className?: string;
    /**
     * @description Image Element's inline styles.
     **/
    style?: string;
    /**
     * @description img tag attribute: width. 
     **/
    width?: string | number;
    /**
     * @description img tag attribute: height. 
    **/
    height?: string | number;
  }

  export type LinkTarget = {
    type: 'link';
    value: string;
  } & BaseTarget;

  export type FileTarget = {
    type: 'file';
    value: File;
  } & BaseTarget;
}

namespace PdfPrintType {
  export type LinkTarget = {
    type: 'link';
    value: string;
  };

  export type FileTarget = {
    type: 'file';
    value: File;
  };
}

/**
 * @description Supported link and file type.
 **/
export type ImageTarget = ImagePrintType.LinkTarget | ImagePrintType.FileTarget;
export type PdfTarget = PdfPrintType.LinkTarget | PdfPrintType.FileTarget;

export type StyleType = {
  type: 'link';
  value: string;
} | {
  type: 'stylesheet';
  value: string;
}

export type BasePrintParams = {
  /**
   * @description Global style，which will be placed in the head tag.
   **/
  styles?: StyleType[];
  /**
   * @description delete iframe after printing.
   * @default true
   **/
  deleteIframeAfterPrinting?: boolean;
  /**
   * @description onBeforePrint
   **/
  onBeforePrint?: (e: Event) => void;
  /**
   * @description onAfterPrint
   **/
  onAfterPrint?: (e: Event) => void;
  /**
   * @description Loading before printing, mainly for rendering.
   **/
  onLoading?: (loading: boolean) => void;
}

export type HTMLPrintParams = {
  printType: 'html';
  /**
   * @description Unique identification of printing area. Only supports ID.
   **/
  target: HTMLElement;
  /**
   * @description Modules that need to be ignored.
   * @default []
   **/
  ignoreModules?: Array<HTMLElement>;
} & BasePrintParams;

export type IMAGEPrintParams = {
  printType: 'image';
  /**
   * @description Support link strings and files.
   **/
  target: ImageTarget[];
  /**
   * @description All images will be placed in a DIV element, and you can add a class to it based on the current parameter 
   * and set the specific style in the styles(BasePrintParams.styles) parameter.
   **/
  containerClassName?: string;
  /**
   * @description container dom's inline style.
   **/
  containerStyle?: string;
} & BasePrintParams;

export type PDFPrintParams = {
  printType: 'pdf';
  target: PdfTarget;
} & BasePrintParams;

export type PrintParams = HTMLPrintParams | IMAGEPrintParams | PDFPrintParams;