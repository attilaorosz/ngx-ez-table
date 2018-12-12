export interface NgxEzTableConfig {
    searchable?: boolean;
    sortable?: boolean;
    globalSearch?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
    pagination?: boolean;
    pageSizeSelector?: boolean;
    pageSizeOptions?: Array<number>;
    pageSize?: number;
    rowDetails?: boolean;
    rowClassFunc?: Function;
    serverSide?: boolean;
    url?: string;
}
