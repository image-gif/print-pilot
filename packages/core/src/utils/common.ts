export default class CommonUitls {

  static readonly PrintTypes = [ 'html', 'image', 'pdf' ] as const;

  static NOOP<T extends any[]>(...args: T) {}

  static IsEmptyValue(val: any): boolean {
    return [undefined, null].includes(val);
  }
}