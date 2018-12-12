export interface NgxEzTableRequest {
    currentPage: number;
    pageSize: number;
    filters: any;
    sortKey: string;
    sortDirection: 'DESC' | 'ASC';
}
