import type { IMAGEPrintParams } from "../types";
import type IHandler from "./handler";
import SingleInstance from "../utils/singleInstance";

export default class IMAGEPrint extends SingleInstance implements IHandler {

  constructor() {
    super();
  }

  public run(params: IMAGEPrintParams) {}
}