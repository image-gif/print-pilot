import type { BrowerInfo } from "../types";

export default class CommonUitls {

  static readonly PrintTypes = ['html', 'image', 'pdf'] as const;

  static NOOP<T extends any[]>(...args: T) { }

  static IsEmptyValue(val: any): boolean {
    return [undefined, null].includes(val);
  }

  static getBrowser(): BrowerInfo {
    const ua = navigator.userAgent;

    const brower: BrowerInfo = {
      name: 'Unknown',
    };

    switch(true) {
      case /Chrome\//.test(ua):
        brower.name = 'Chrome';
        break;
      case /Firefox\//.test(ua):
        brower.name = 'Firefox';
        break;
      case /Safari\//.test(ua):
        brower.name = 'Safari';
        break;
      case /Edg\//.test(ua):
        brower.name = 'Edge';
        break;
      case /OPR\//.test(ua):
        brower.name = 'Opera';
        break;
      case /MSIE|Trident/.test(ua):
        brower.name = 'IE';
        break;
      default:
        brower.name = 'Unknown';
        break;
    }

    return brower;

  }
}