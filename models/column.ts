export interface NgxEzTableColumn {
    accessor: string;
    title: string;
    searchable?: boolean;
    sortable?: boolean;
    width?: number;
    headerClass?: string;
    cellClass?: string;
    key?: string;
}
