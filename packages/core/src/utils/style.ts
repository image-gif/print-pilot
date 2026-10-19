import CommonUitls from "./common";
import IframeUtils from "./iframe";

export class StyleUtils {
  private readonly baseStyleMap: Map<string, Record<string, CSSStyleValue>>;
  private iframe: HTMLIFrameElement;

  constructor() {
    this.iframe = IframeUtils.createIframe('base-style-iframe');
    document.body.appendChild(this.iframe);
    this.baseStyleMap = new Map();
  }

  /**
   * @description Get the default browser style for the specified element.
  */
  public getBaseStyles(tagName: string) {
    if (!tagName) {
      return {};
    }
    const tag = tagName.toLocaleLowerCase();
    if (this.baseStyleMap.has(tag)) {
      return this.baseStyleMap.get(tag)!;
    }

    const targetDom = document.createElement(tag);
    this.iframe.contentDocument?.body.appendChild(targetDom);

    const baseStyle: Record<string, CSSStyleValue> = this.getElementComputedStyles(targetDom);
    this.baseStyleMap.set(tag, baseStyle);

    this.iframe.contentDocument?.body.removeChild(targetDom);

    return baseStyle;
  }

  /**
   * @description Get element style in the current document.
  */
  public getCustomStyles(element: HTMLElement) {
    const baseStyle = this.getBaseStyles(element.tagName);
    const computedStyle = this.getElementComputedStyles(element);
    const styles: Record<string, CSSStyleValue> = {};

    for (const [key, value] of Object.entries(computedStyle)) {
      if (baseStyle[key] !== value) {
        styles[key] = value;
      }
    }

    return styles;
  }

  /**
   * @description styles to string
   * */
  public toStyleString(styles: Record<string, CSSStyleValue>) {
    return Object.entries(styles).reduce((str, [key, value]) => str + `${key}:${value};`, "");
  }

  private getElementComputedStyles(element: HTMLElement) {
    const computedStyle = window.getComputedStyle(element);
    const styles: Record<string, CSSStyleValue> = {};

    for (const key of computedStyle) {
      if (['Firefox', 'Unknown'].includes(CommonUitls.getBrowser().name)) {
        styles[key] = computedStyle.getPropertyValue(key);
      } else {
        styles[key] = element.computedStyleMap().get(key)?.toString()!;
      }
    }

    return styles;
  }

}