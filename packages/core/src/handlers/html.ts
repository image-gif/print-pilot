import type { HTMLPrintParams } from "../types";
import { StyleUtils } from "../utils/style";
import Handler from "./handler";


export default class HTMLPrint extends Handler<HTMLElement> {
  private styleUtils: StyleUtils | null = null;
  private ignoreModules: HTMLElement[] = [];

  constructor() {
    super();
    this.styleUtils = new StyleUtils();
  }

  public async run(params: HTMLPrintParams) {
    this.initCommonParams(params);
    this.ignoreModules = params.ignoreModules || [];

    const finished = await this.renderInIframe({
      getBodyContent: this.createBodyContent.bind(this),
      getHeaderContent: this.createHeadContent.bind(this),
    });

    // After rendering, start printing.
    if (finished) {
      this.iframe?.contentWindow?.print();
    }
  }

  /**
   * @description HTML type creates new content through cloning.
   **/
  protected override async createBodyContent() {
    return this.cloneNode(this.target);
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