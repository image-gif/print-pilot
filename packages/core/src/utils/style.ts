import IframeUtils from "./iframe";

const InheritStyleKeys = [
  // Font
  'font',
  'font-family',
  'font-size',
  'font-style',
  'font-variant',
  'font-weight',
  'font-stretch',
  'font-size-adjust',

  // Text
  'color',
  'direction',
  'letter-spacing',
  'line-height',
  'text-align',
  'text-indent',
  'text-transform',
  'white-space',
  'word-spacing',

  // List
  'list-style',
  'list-style-image',
  'list-style-position',
  'list-style-type',

  // Table
  'border-collapse',
  'border-spacing',
  'caption-side',
  'empty-cells',
  'table-layout',

  // Others
  'cursor',
  'visibility',
  'quotes',
  'orphans',
  'widows',
  'page-break-inside',
];

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

    const computedStyle = window.getComputedStyle(targetDom);
    const baseStyle: Record<string, CSSStyleValue> = {};

    for (const key of computedStyle) {
      baseStyle[key] = computedStyle.getPropertyValue(key);
    }

    this.baseStyleMap.set(tag, baseStyle);

    this.iframe.contentDocument?.body.removeChild(targetDom);

    return baseStyle;
  }

  /**
   * @description Get element style in the current document.
  */
  public getCustomStyles(element: HTMLElement) {
    const userDefinedStyleKeys = this.getUserDefinedStyleKeys(element);
    const baseStyle = this.getBaseStyles(element.tagName);
    const computedStyle = window.getComputedStyle(element);
    const styles: Record<string, CSSStyleValue> = {};
    for (const key of computedStyle) {
      const current = computedStyle.getPropertyValue(key);
      const base = baseStyle[key];

      if (current != base && (userDefinedStyleKeys.has(key) || InheritStyleKeys.includes(key))) {
        styles[key] = current;
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

  /**
   * @description Get user-defined style keys.
   * */
  private getUserDefinedStyleKeys(element: HTMLElement) {
    let styleKeys: Set<string> = new Set();

    // 1. Handling inline style
    for (const p of element.style) {
      styleKeys.add(p);
    }

    for (const sheet of document.styleSheets) {
      styleKeys = styleKeys.union(this.resolveCSSRules(sheet.cssRules, element));
    }
    return styleKeys;
  }

  private resolveCSSRules<T extends CSSRuleList, E extends HTMLElement>(rules: T, element: E) {
    let styleKeys: Set<string> = new Set();
    for (const rule of rules) {
      if (rule instanceof CSSMediaRule && window.matchMedia(rule.conditionText).matches) {
        const keys = this.resolveCSSRules(rule.cssRules, element);
        styleKeys = styleKeys.union(keys);
      }

      if (rule instanceof CSSSupportsRule && CSS.supports(rule.conditionText)) {
        const keys = this.resolveCSSRules(rule.cssRules, element);
        styleKeys = styleKeys.union(keys);
      }

      if (rule instanceof CSSStyleRule && rule.selectorText && rule.style) {
        if (element.matches(rule.selectorText)) {
          for (const key of rule.style) {
            styleKeys.add(key)
          }
        }
      }
    }
    return styleKeys;
  }

}