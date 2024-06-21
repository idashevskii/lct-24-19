export const createStorageMock = () => {
  const storage = new Map<string, string>();

  return {
    getItem(key): string | null {
      return storage.has(key) ? (storage.get(key) as string) : null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
    removeItem(key) {
      storage.delete(key);
    },
  } as Storage;
};

export interface FetchMockRoute {
  baseUrl: string;
  params?: { [key: string]: string };
  bodyParams?: { [key: string]: string };
  data: unknown;
  status?: number;
}

export const createLocationMock = () =>
  ({
    search: '',
    href: '',
    replace(url: string) {
      this.href = url;
      this.search = url.includes('?') ? url.substring(url.indexOf('?')) : '';
    },
    assign(url: string) {
      this.replace(url);
    },
  } as Location);

export const parseUrl = (url: string) => {
  const [baseUrl, search] = url.split('?');
  const params = new URLSearchParams(search || '');
  return { baseUrl, params };
};

export const createFetchMock = (
  routes: FetchMockRoute[],
  virtualParams: Record<string, string>,
) => {
  return ((url: string, { body }: { body?: string }) => {
    const { baseUrl, params } = parseUrl(url);
    const match = routes.find((item) => {
      if (item.baseUrl !== baseUrl) {
        return false;
      }
      if (item.params) {
        return Object.entries(item.params).every(
          ([key, value]) => virtualParams[key] === value || params.get(key) === value,
        );
      }
      if (item.bodyParams) {
        const bodyParams = new URLSearchParams(body || '');
        return Object.entries(item.bodyParams).every(
          ([key, value]) => bodyParams.get(key) === value,
        );
      }
      return true;
    });
    if (!match) {
      throw `No matches for ${url}`;
    }
    return {
      json: () => new Promise((resolve) => resolve(match.data)),
      status: match.status || 200,
    };
  }) as unknown as typeof global.fetch;
};
