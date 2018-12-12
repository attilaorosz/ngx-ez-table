import { NgxEzTableConfig } from './models/config';

export const NgxEzTableDefaultConfig: NgxEzTableConfig = {
    searchable: true,
    sortable: true,
    globalSearch: false,
    showHeader: true,
    showFooter: true,
    pagination: true,
    pageSizeSelector: true,
    pageSizeOptions: [5, 10, 20, 25, 50, 100],
    pageSize: 10,
    rowDetails: true,
    serverSide: false
};
