import type { HTMLPrintParams } from "../types";
import { StyleUtils } from "../utils/style";
import Handler from "./handler";

export default class HTMLPrint extends Handler<HTMLElement> {
  private styleUtils: StyleUtils | null = null;
  private ignoreModules: HTMLElement[] = [];
  private unmountedHandlers: (() => void)[] = [];

  constructor() {
    super();
    this.styleUtils = new StyleUtils();
  }

  public async run(params: HTMLPrintParams) {
    this.initCommonParams(params);
    this.target = this.getElement(params.target);
    this.ignoreModules = params.ignoreModules || [];
    this.unmountedHandlers = [];

    const finished = await this.renderInIframe({
      getBodyContent: this.createBodyContent.bind(this),
      getHeaderContent: this.createHeadContent.bind(this),
    });

    // After rendering, start printing.
    if (finished) {
      this.iframe?.contentWindow?.print();
    }

    for (const unmountedHandler of this.unmountedHandlers) {
      unmountedHandler();
    }

    this.unmountedHandlers = [];
  }

  /**
   * @description HTML type creates new content through cloning.
   **/
  protected override async createBodyContent() {
    return await this.cloneNode(this.target);
  }

  private async cloneNode<T extends HTMLElement>(target: T): Promise<T> {
    const contentDocument = this.iframe?.contentDocument!;

    const clonedNode = contentDocument.importNode(target);

    if (clonedNode.nodeType !== Node.ELEMENT_NODE) {
      return clonedNode;
    }

    const styles = this.styleUtils!.getCustomStyles(target);

    if (target.tagName.toLocaleLowerCase() === 'canvas') {
      return (await this.canvasToImage(target, styles)) as T;
    }

    if (styles) {
      clonedNode.setAttribute('style', this.styleUtils!.toStyleString(styles));
    }

    Array.from(target.childNodes).forEach(async (child) => {
      if (this.ignoreModules.includes(child as HTMLElement)) {
        return;
      }
      clonedNode.appendChild(await this.cloneNode(child as HTMLElement));
    });

    return clonedNode;
  }

  private getElement(query: HTMLElement | string): HTMLElement {
    if (query instanceof HTMLElement) {
      return query;
    }

    if (typeof query === 'string') {
      return document.querySelector<HTMLElement>(query)!;
    }

    throw new Error('Unable to query Element based on `target`.');
  }

  private async canvasToImage(target: HTMLElement, styles: Record<string, CSSStyleValue>): Promise<HTMLElement> {
    const canvas = target as HTMLCanvasElement;
    const { resolve, promise } = Promise.withResolvers<Blob>();
    canvas.toBlob((blob) => {
      resolve(blob!);
    });

    const blob = await promise;
    const img = document.createElement("img");
    const url = URL.createObjectURL(blob);

    if (!styles.width) {
      styles.width = canvas.clientWidth + 'px';
    }

    if (!styles.height) {
      styles.height = canvas.clientHeight + 'px';
    }

    img.setAttribute('style', this.styleUtils?.toStyleString(styles)!);

    this.unmountedHandlers.push(() => {
      URL.revokeObjectURL(url);
    });

    img.src = url;
    await img.decode();

    return img;
  }
}