export default class SingleInstance {
  static #instances = new WeakMap<Function, unknown>();
  static #creatingSet = new WeakSet<Function>();

  constructor() {
    if (!SingleInstance.#creatingSet.has(new.target)) {
      throw new Error(`The \`${new.target.name}\` class can only obtain instances through the \`getInstance\` class  method.`);
    }
  }

  static getInstance<T extends SingleInstance>(this: new () => T): T {
    if (!SingleInstance.#instances.has(this)) {
      SingleInstance.#creatingSet.add(this);
      SingleInstance.#instances.set(this, new this());
      SingleInstance.#creatingSet.delete(this);
    }
    return SingleInstance.#instances.get(this) as T;
  }
}