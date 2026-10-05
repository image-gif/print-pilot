export default class CommonUitls {

  static readonly PrintTypes = [ 'html', 'image' ] as const;

  static NOOP<T extends any[]>(...args: T) {}
}