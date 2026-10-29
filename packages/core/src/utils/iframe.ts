interface ICreateIframeOptions {
  style?: string;
}

export default class IframeUtils {
  static createIframe(id: string, options?: ICreateIframeOptions) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', id);
    iframe.setAttribute('style', options?.style || 'postion:absolute;top:0;left:0;width:0;height:0;visibility:hidden;');
    return iframe;
  }
}