import type { PrintParams, StyleType } from "../types";
import CommonUitls from "../utils/common";
import SingleInstance from "../utils/singleInstance";
import IframeUtils from "../utils/iframe";

type NewContentHandler = {
  getBodyContent?: () => Promise<Node | undefined>;
  getHeaderContent?: () => Promise<Node | undefined>;
};

const NOOP = CommonUitls.NOOP;

export default abstract class Handler<T extends PrintParams['target']> extends SingleInstance {
  protected iframe: HTMLIFrameElement | null = null;
  protected target!: T;
  protected additionalStyles: StyleType[] = [];
  protected deleteIframeAfterPrinting: boolean = false;
  protected onBeforePrint: (e: Event) => void = NOOP;
  protected onAfterPrint: (e: Event) => void = NOOP;
  protected onLoading: (loading: boolean) => void = NOOP;

  /**
   * @description Main entrance.
   **/
  abstract run(...args: any[]): any;

  protected initCommonParams(params: PrintParams) {
    if (!params.target) {
      throw new Error('The target parameter must not be undefined or null.');
    }

    this.target = params.target as T;
    this.additionalStyles = params.styles || [];
    this.deleteIframeAfterPrinting = params.deleteIframeAfterPrinting === undefined ? true : !!params.deleteIframeAfterPrinting;
    this.onBeforePrint = params.onBeforePrint || NOOP;
    this.onAfterPrint = params.onAfterPrint || NOOP;
    this.onLoading = params.onLoading || NOOP;
    this.onLoading(true);
  }

  /**
   * @description Create a new body content. Can be rewritten.
   **/
  protected async createBodyContent(): Promise<Node | undefined> { return; }

  /**
   * @description Create a new head content. Can be rewritten.
   **/
  protected async createHeadContent() {
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
      } else {
        const stylesheet = this.iframe?.contentDocument?.createElement('style');
        const styleContent = this.iframe?.contentDocument?.createTextNode(style.value);
        stylesheet?.appendChild(styleContent!);
        fragment?.appendChild(stylesheet!);
      }
    }

    return fragment;
  }

  /**
   * @description Render a new content in iframe. Can be rewritten.
   **/
  protected async renderInIframe(newContentHandler?: NewContentHandler): Promise<boolean> {
    const { resolve, reject, promise } = Promise.withResolvers<boolean>();
    try {
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
        });

        document.body.appendChild(this.iframe!);
        await this.setNewContent(newContentHandler);
        this.onLoading(false);
        resolve(true);

      } else {
        await this.setNewContent(newContentHandler);
        this.onLoading(false);
        resolve(true);
      }
    } catch (err) {
      this.onLoading(false);
      reject(err);
    }

    return promise;
  }

  private async setNewContent(handler?: NewContentHandler) {
    if (!handler) {
      return;
    }

    const {
      getBodyContent,
      getHeaderContent,
    } = handler;

    if (typeof getHeaderContent === 'function') {
      const newContent = await getHeaderContent();
      if (newContent) {
        this.iframe?.contentDocument?.head.replaceChildren(newContent);
      }
    }

    if (typeof getBodyContent === 'function') {
      const newContent = await getBodyContent();
      if (newContent) {
        this.iframe!.contentDocument?.body.replaceChildren(newContent);
      }
    }
  }
}
