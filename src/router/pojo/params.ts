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
    /**
     * Preserves the fragment for the next navigation
     *
     * ```
     * // Preserve fragment from /results#top to /view#top
     * this.router.navigate(['/view'], { preserveFragment: true });
     * ```
     */
    preserveFragment?: boolean;
    /**
     * Navigates without pushing a new state into history.
     *
     * ```
     * // Navigate silently to /view
     * this.router.navigate(['/view'], { skipLocationChange: true });
     * ```
     */
    skipLocationChange?: boolean;
    /**
     * Navigates while replacing the current state in history.
     *
     * ```
     * // Navigate to /view
     * this.router.navigate(['/view'], { replaceUrl: true });
     * ```
     */
    replaceUrl?: boolean;
}