export class NextRequestMock {
  method: string;
  private _body: any;
  headers: Map<string, string>;

  constructor(body: any = {}, options: { method?: string; headers?: Record<string, string> } = {}) {
    this._body = body;
    this.method = options.method ?? 'GET';
    this.headers = new Map(
      Object.entries(options.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])
    );
  }

  json(): Promise<any> {
    return Promise.resolve(this._body);
  }

  text(): Promise<string> {
    return Promise.resolve(typeof this._body === 'string' ? this._body : JSON.stringify(this._body));
  }

  get body() {
    return this._body;
  }

  setHeader(key: string, value: string) {
    this.headers.set(key.toLowerCase(), value);
  }

  getHeader(key: string): string | undefined {
    return this.headers.get(key.toLowerCase());
  }
}

