import type { IMAGEPrintParams, ImageTarget } from "../types";
import CommonUitls from "../utils/common";
import Handler from "./handler";

export default class IMAGEPrint extends Handler<ImageTarget[]> {
  private containerClassName: string | undefined = '';
  private containerStyle: string | undefined = '';
  constructor() {
    super();
  }

  public async run(params: IMAGEPrintParams) {
    this.initCommonParams(params);
    this.containerClassName = params.containerClassName;
    this.containerStyle = params.containerStyle;

    const finished = await this.renderInIframe({
      getBodyContent: this.createBodyContent.bind(this),
      getHeaderContent: this.createHeadContent.bind(this),
    });

    // After rendering, start printing. 
    if (finished) {
      this.iframe?.contentWindow?.print();
    }
  }

  protected override async createBodyContent() {
    const contentDocument = this.iframe?.contentDocument;
    const container = contentDocument?.createElement('div');
    const fragment = contentDocument?.createDocumentFragment();

    const imgHandler = async (item: ImageTarget) => {
      const img = contentDocument?.createElement('img')!;

      if (item.style) {
        img.setAttribute('style', item.style);
      }

      if (item.className) {
        img.setAttribute('class', item.className);
      }

      if (!CommonUitls.IsEmptyValue(item.width)) {
        img.setAttribute('width', item.width!.toString());
      }

      if (!CommonUitls.IsEmptyValue(item.height)) {
        img.setAttribute('height', item.height!.toString());
      }

      if (item.type === 'link') {
        img.setAttribute('src', item.value);
      } else if (item.type === 'file') {
        const url = URL.createObjectURL(item.value);
        img.onload = () => URL.revokeObjectURL(url);
        img.onerror = () => URL.revokeObjectURL(url);
        img.setAttribute('src', url)
      }

      // After the image is loaded, add it to the document. Implement immediate rendering.
      await img.decode();

      fragment?.appendChild(img);
    }

    await Promise.all(this.target.filter(item => item.value).map(imgHandler));

    if (this.containerClassName) {
      container?.setAttribute('class', this.containerClassName);
    }

    if (this.containerStyle) {
      container?.setAttribute('style', this.containerStyle);
    }

    container?.appendChild(fragment!);
    return container;
  }
}