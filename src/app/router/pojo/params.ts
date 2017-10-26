export type PathParams = {
    [key: string]: any
};

export type QueryParams = {
    [key: string]: any
};

export type Params = PathParams | QueryParams;

export type QueryParamsHandling = 'merge' | 'preserve' | '';

export interface NavigationExtras {
    queryParams?: QueryParams;
    queryParamsHandling?: QueryParamsHandling;
}