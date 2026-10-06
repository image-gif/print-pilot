import type { PDFPrintParams, PdfTarget } from "../types";
import IframeUtils from "../utils/iframe";
import Handler from "./handler";

export default class PDFPrint extends Handler<PdfTarget> {
  private promiseResolvers!: PromiseWithResolvers<boolean>;

  constructor() {
    super();
  }

  public async run(params: PDFPrintParams) {
    this.initCommonParams(params);
    this.promiseResolvers = Promise.withResolvers<boolean>();

    const finished = await this.renderInIframe();

    // After rendering, start printing. 
    if (finished) {
      this.iframe?.contentWindow?.print();
    }
  }

  protected override async renderInIframe(): Promise<boolean> {
    try {
      const url = await this.createContentBySrc();
      if (!this.iframe) {
        this.iframe = IframeUtils.createIframe('print-container');

        this.iframe.addEventListener('load', () => {
          this.iframe!.contentWindow?.addEventListener('beforeprint', (e) => {
            this.onBeforePrint(e);
          });

          this.iframe!.contentWindow?.addEventListener('afterprint', (e) => {
            this.onAfterPrint(e);
            if (this.deleteIframeAfterPrinting) {
              document.body.removeChild(this.iframe!);
              this.iframe = null;
            }
          });
          this.onLoading(false);
          this.promiseResolvers.resolve(true);
        });

        this.iframe!.src = url;

        document.body.appendChild(this.iframe!);
      } else {
        this.iframe!.src = url;
      }
    } catch (err) {
      this.onLoading(false);
      this.promiseResolvers.reject(err);
    }

    return this.promiseResolvers.promise;
  }

  private async createContentBySrc(): Promise<string> {
    if (this.target.type === 'file') {
      return URL.createObjectURL(this.target.value);
    } else if (this.target.type === 'link') {
      return this.target.value;
    }

    return '';
  }
}