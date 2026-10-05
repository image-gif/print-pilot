export type StyleType = {
  type: 'link',
  value: string;
} | {
  type: 'stylesheet',
  value: string;
}

export type BasePrintParams = {
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
   * @description Global styles.
   * @default ''
   **/
  styles?: StyleType[];
  /**
   * @description Modules that need to be ignored.
   * @default []
   **/
  ignoreModules?: Array<HTMLElement>;
} & BasePrintParams;

// TODO: finishing Image handler
export type IMAGEPrintParams = {
  printType: 'image';
  /**
   * @description Support link strings and files.
   **/ 
  target: string;
  /**
   * @description Image's Rendering width.
   **/
  width: string | number;
  /**
   * @description Image's Rendering height.
   **/
  height: string | number;
} & BasePrintParams;

export type PrintParams = HTMLPrintParams | IMAGEPrintParams;