import type { HTMLPrintParams, StyleType } from "../types";
import type IHandler from "./handler";
import CommonUitls from "../utils/common";
import IframeUtils from "../utils/iframe";
import SingleInstance from "../utils/singleInstance";
import { StyleUtils } from "../utils/style";

const NOOP = CommonUitls.NOOP;

export default class HTMLPrint extends SingleInstance implements IHandler {
  private iframe: HTMLIFrameElement | null = null;
  private styleUtils: StyleUtils | null = null;

  private target!: HTMLElement;
  private additionalStyles: StyleType[] = [];
  private ignoreModules: HTMLElement[] = [];
  private deleteIframeAfterPrinting: boolean = false;
  private onBeforePrint: (e: Event) => void = NOOP;
  private onAfterPrint: (e: Event) => void = NOOP;
  private onLoading: (loading: boolean) => void = NOOP;

  constructor() {
    super();
    this.styleUtils = new StyleUtils();
  }

  public async run(params: HTMLPrintParams) {
    if (!params.target) {
      throw new Error('The target parameter must not be undefined or null.');
    }
    this.target = params.target;
    this.additionalStyles = params.styles || [];
    this.ignoreModules = params.ignoreModules || [];
    this.deleteIframeAfterPrinting = params.deleteIframeAfterPrinting === undefined ? true : !!params.deleteIframeAfterPrinting;
    this.onBeforePrint = params.onBeforePrint || NOOP;
    this.onAfterPrint = params.onAfterPrint || NOOP;
    this.onLoading = params.onLoading || NOOP;

    this.onLoading(true);
    try {
      const finished = await this.renderInIframe();
      // After rendering, start printing.
      if (finished) {
        this.iframe?.contentWindow?.print();
      }
    } catch (err) { }
    finally {
      this.onLoading(false);
    }
  }

  private async renderInIframe(): Promise<boolean> {
    const { resolve, reject, promise } = Promise.withResolvers<boolean>();
    try {
      if (!this.iframe) {
        this.iframe = IframeUtils.createIframe('print-container');
        const printIframe = this.iframe;

        printIframe.addEventListener('load', () => {
          printIframe.contentWindow?.addEventListener('beforeprint', (e) => {
            this.onBeforePrint(e);
          });

          printIframe.contentWindow?.addEventListener('afterprint', (e) => {
            this.onAfterPrint(e);
            if (this.deleteIframeAfterPrinting) {
              document.body.removeChild(printIframe);
              this.iframe = null;
            }
          });

          this.handleAdditionalStyles();

          const clonedNode = this.cloneNode(this.target);
          printIframe.contentDocument?.body.appendChild(clonedNode);
          resolve(true);
        });

        document.body.appendChild(this.iframe!);
      } else {
        const clonedNode = this.cloneNode(this.target);
        this.iframe.contentDocument?.body.replaceChildren(clonedNode);
        resolve(true);
      }
    } catch (err) {
      reject(err);
    }

    return promise;
  }

  // Handling additional styles.
  private handleAdditionalStyles() {
    if (!this.additionalStyles.length) {
      return;
    }
    const fragment = this.iframe?.contentDocument?.createDocumentFragment();

    for (const style of this.additionalStyles) {
      if (!style.value) {
        continue;
      }

      if (style.type === 'link') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = style.value;
        fragment?.appendChild(link!);
        continue;
      }

      const stylesheet = this.iframe?.contentDocument?.createElement('style');
      const styleContent = this.iframe?.contentDocument?.createTextNode(style.value);
      stylesheet?.appendChild(styleContent!);
      fragment?.appendChild(stylesheet!);
    }
    this.iframe?.contentDocument?.head.appendChild(fragment!);
  }

  private cloneNode<T extends HTMLElement>(target: T): T {
    const contentDocument = this.iframe?.contentDocument!;

    const clonedNode = contentDocument.importNode(target);

    if (clonedNode.nodeType !== Node.ELEMENT_NODE) {
      return clonedNode;
    }

    const styles = this.styleUtils!.getCustomStyles(target);

    if (styles) {
      clonedNode.setAttribute('style', this.styleUtils!.toStyleString(styles));
    }

    Array.from(target.childNodes).forEach(child => {
      if (this.ignoreModules.includes(child as HTMLElement)) {
        return;
      }
      clonedNode.appendChild(this.cloneNode(child as HTMLElement));
    });

    return clonedNode;
  }
}