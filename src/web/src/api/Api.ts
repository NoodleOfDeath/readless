/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AttrArticleTypeofARTICLEATTRS5Bnumber5D {
  id?: any;
  abridged: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  createdAt?: any;
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
}

export type ArticleAttr = AttrArticleTypeofARTICLEATTRS5Bnumber5D;

export interface DatedAttributes {
  /** @format date-time */
  deletedAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format double */
  id?: number;
}

export type PostAttributes = DatedAttributes & {
  imagePrompt: string;
  bullets: string[];
  shortSummary: string;
  summary: string;
  abridged: string;
  text: string;
};

export type TitledCategorizedPostAttributes = PostAttributes & {
  tags: string[];
  subcategory: string;
  category: string;
  title: string;
};

export type ArticleAttributes = TitledCategorizedPostAttributes & object;

export interface AttrSourceTypeofSOURCEATTRSAtNumber {
  id?: any;
  abridged: string;
  summary: string;
  shortSummary: string;
  bullets: string[];
  createdAt?: any;
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
  /** @format double */
  outletId: number;
  url: string;
  originalTitle: string;
}

export type SourceAttr = AttrSourceTypeofSOURCEATTRSAtNumber;

export type SourceWithOutletAttr = SourceAttr & {
  outletName: string;
};

export type SourceAttributes = TitledCategorizedPostAttributes & {
  originalTitle: string;
  filteredText: string;
  rawText: string;
  url: string;
  /** @format double */
  outletId: number;
};

export type SourceWithOutletName = SourceAttributes & {
  outletName: string;
};

export type SubscriptionAttributes = DatedAttributes & {
  /** @format double */
  newsletterId: number;
  alias: string;
  aliasType: string;
};

export type SubscriptionCreationAttributes = SubscriptionAttributes;

/** Construct a type with a set of properties K of type T */
export type RecordStringUnknown = object;

export type MetricAttributes = DatedAttributes & {
  /** the user agent info of the consumer of this referral */
  userAgent: string;
  /** ip address(es) of actor */
  referrer?: string[];
  /** Construct a type with a set of properties K of type T */
  data: RecordStringUnknown;
  type: "click" | "nav";
};

export type MetricCreationAttributes = MetricAttributes;

export type PolicyAttributes = DatedAttributes & {
  content: string;
  name: string;
};

export type ReferralAttributes = DatedAttributes & {
  /** geolocation of the referrer */
  geolocation?: string;
  /** the user agent info of the consumer of this referral */
  userAgent: string;
  /** the url path of the referral destination */
  target: string;
  /** the url path this referral was generated from */
  origin?: string;
  /** the IP address this referral was accessed from */
  referrer: string;
  /**
   * id of a user if ref link was created while logged in
   * @format double
   */
  referredById?: number;
};

export type ReferralCreationAttributes = ReferralAttributes;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title theskoop-api
 * @version 0.0.1
 * @baseUrl /
 * @contact
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags Articles
     * @name GetArticles
     * @request GET:/v1/articles
     */
    getArticles: (
      query?: {
        filter?: string;
        /**
         * @format double
         * @default 10
         */
        pageSize?: number;
        /**
         * @format double
         * @default 0
         */
        page?: number;
        /** @format double */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: ArticleAttr[];
          /** @format double */
          count: number;
        },
        any
      >({
        path: `/v1/articles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Articles
     * @name WriteArticleFromSources
     * @request POST:/v1/articles
     */
    writeArticleFromSources: (data: number[], params: RequestParams = {}) =>
      this.request<ArticleAttributes, any>({
        path: `/v1/articles`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Articles
     * @name GetArticlesForCategory
     * @request GET:/v1/articles/{category}
     */
    getArticlesForCategory: (
      category: string,
      query?: {
        filter?: string;
        /**
         * @format double
         * @default 10
         */
        pageSize?: number;
        /**
         * @format double
         * @default 0
         */
        page?: number;
        /** @format double */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: ArticleAttr[];
          /** @format double */
          count: number;
        },
        any
      >({
        path: `/v1/articles/${category}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Articles
     * @name GetArticlesForCategoryAndSubcategory
     * @request GET:/v1/articles/{category}/{subcategory}
     */
    getArticlesForCategoryAndSubcategory: (
      category: string,
      subcategory: string,
      query?: {
        filter?: string;
        /**
         * @format double
         * @default 10
         */
        pageSize?: number;
        /**
         * @format double
         * @default 0
         */
        page?: number;
        /** @format double */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: ArticleAttr[];
          /** @format double */
          count: number;
        },
        any
      >({
        path: `/v1/articles/${category}/${subcategory}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Articles
     * @name GetArticleForCategoryAndSubcategoryAndTitle
     * @request GET:/v1/articles/{category}/{subcategory}/{title}
     */
    getArticleForCategoryAndSubcategoryAndTitle: (
      category: string,
      subcategory: string,
      title: string,
      params: RequestParams = {},
    ) =>
      this.request<ArticleAttributes, any>({
        path: `/v1/articles/${category}/${subcategory}/${title}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sources
     * @name GetSources
     * @request GET:/v1/sources
     */
    getSources: (
      query?: {
        filter?: string;
        /**
         * @format double
         * @default 10
         */
        pageSize?: number;
        /**
         * @format double
         * @default 0
         */
        page?: number;
        /** @format double */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: SourceWithOutletAttr[];
          /** @format double */
          count: number;
        },
        any
      >({
        path: `/v1/sources`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sources
     * @name GetSourcesForCategory
     * @request GET:/v1/sources/{category}
     */
    getSourcesForCategory: (
      category: string,
      query?: {
        filter?: string;
        /**
         * @format double
         * @default 10
         */
        pageSize?: number;
        /**
         * @format double
         * @default 0
         */
        page?: number;
        /** @format double */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: SourceWithOutletAttr[];
          /** @format double */
          count: number;
        },
        any
      >({
        path: `/v1/sources/${category}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sources
     * @name GetSourcesForCategoryAndSubcategory
     * @request GET:/v1/sources/{category}/{subcategory}
     */
    getSourcesForCategoryAndSubcategory: (
      category: string,
      subcategory: string,
      query?: {
        filter?: string;
        /**
         * @format double
         * @default 10
         */
        pageSize?: number;
        /**
         * @format double
         * @default 0
         */
        page?: number;
        /** @format double */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          rows: SourceWithOutletAttr[];
          /** @format double */
          count: number;
        },
        any
      >({
        path: `/v1/sources/${category}/${subcategory}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sources
     * @name GetSourceForCategoryAndSubcategoryAndTitle
     * @request GET:/v1/sources/{category}/{subcategory}/{title}
     */
    getSourceForCategoryAndSubcategoryAndTitle: (
      category: string,
      subcategory: string,
      title: string,
      params: RequestParams = {},
    ) =>
      this.request<SourceWithOutletName, any>({
        path: `/v1/sources/${category}/${subcategory}/${title}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Newsletters
     * @name SubscribeToNewsletter
     * @request POST:/v1/newsletter/subscribe
     */
    subscribeToNewsletter: (data: SubscriptionCreationAttributes, params: RequestParams = {}) =>
      this.request<SubscriptionAttributes, any>({
        path: `/v1/newsletter/subscribe`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Metricss
     * @name RecordMetric
     * @request POST:/v1/metrics
     */
    recordMetric: (data: MetricCreationAttributes, params: RequestParams = {}) =>
      this.request<MetricAttributes, any>({
        path: `/v1/metrics`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policies
     * @name GetPrivacyPolicy
     * @request GET:/v1/policies/privacy
     */
    getPrivacyPolicy: (params: RequestParams = {}) =>
      this.request<PolicyAttributes, any>({
        path: `/v1/policies/privacy`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Policies
     * @name GetTermsOfService
     * @request GET:/v1/policies/terms
     */
    getTermsOfService: (params: RequestParams = {}) =>
      this.request<PolicyAttributes, any>({
        path: `/v1/policies/terms`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Referrals
     * @name RecordReferral
     * @request POST:/v1/referrals
     */
    recordReferral: (data: ReferralCreationAttributes, params: RequestParams = {}) =>
      this.request<ReferralAttributes, any>({
        path: `/v1/referrals`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
