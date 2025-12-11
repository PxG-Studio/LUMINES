export class NextResponseMock {
  status: number;
  ok: boolean;
  headers: Map<string, string>;
  body: any;

  constructor(body: any = null, status = 200, headers: Record<string, string> = {}) {
    this.body = body;
    this.status = status;
    this.ok = status >= 200 && status < 300;
    this.headers = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  }

  static json(data: any, options: { status?: number; headers?: Record<string, string> } = {}) {
    return new NextResponseMock(
      data,
      options.status ?? 200,
      options.headers ?? { 'content-type': 'application/json' }
    );
  }

  static error(message = 'Internal error', status = 500) {
    return new NextResponseMock({ error: message }, status);
  }

  static redirect(url: string, status = 302) {
    return new NextResponseMock(null, status, { location: url });
  }

  text(): Promise<string> {
    if (typeof this.body === 'string') return Promise.resolve(this.body);
    return Promise.resolve(JSON.stringify(this.body));
  }

  json(): Promise<any> {
    return Promise.resolve(this.body);
  }

  getHeader(key: string): string | undefined {
    return this.headers.get(key.toLowerCase());
  }

  setHeader(key: string, value: string) {
    this.headers.set(key.toLowerCase(), value);
  }
}

