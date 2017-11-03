export type PathParams = {
    [key: string]: any
};

export type QueryParams = {
    [key: string]: any
};

export type Params = PathParams | QueryParams;

/**
 * merge 表示将url中参数和NavigationExtras.queryParams 合并，其中NavigationExtras.queryParams覆盖url
 * preserve 表示保留url中的参数
 * '' 表示保留NavigationExtras.queryParams的参数
 */
export type QueryParamsHandling = 'merge' | 'preserve' | '';

export interface NavigationExtras {
    queryParams?: QueryParams;
    queryParamsHandling?: QueryParamsHandling;
    fragment?: string;
    preserveFragment?: boolean;
}