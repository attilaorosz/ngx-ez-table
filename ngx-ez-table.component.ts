import { NgxEzTableResponse } from './models/response';
import { HttpClient } from '@angular/common/http';
import { NgxEzTableFilter } from './components/filter/filter.component';
import { deepFind } from './utils/deep-find';
import { NgxEzTablePagination } from './components/pagination/pagination.component';
import { Component, ViewEncapsulation, Input, ViewChild, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { NgxEzTableColumn } from './models/column';
import { NgxEzTableConfig } from './models/config';
import { NgxEzTableDefaultConfig } from './ngx-ez-table-default-config';
import { NgxEzTablePageSizeSelector } from './components/page-size-selector/page-size-selector.component';
import { NgxEzTableRequest } from './models/request';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'ngx-ez-table', // tslint:disable-line
    templateUrl: './ngx-ez-table.component.html',
    styleUrls: ['./ngx-ez-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NgxEzTableComponent implements AfterViewInit {
    @Input() set rows(rows: Array<any>) {
        this._rows = rows.map((el, i) => { el.ngxEzTableId = i; return el; });
        this.update();
    }

    @Input('columns') set _columns(columns: Array<NgxEzTableColumn>) {
        this.columns = columns;
        if (!this.isLoading) {
            this.update();
        }
    }

    @Input('config') set _config(config: NgxEzTableConfig) {
        this.config = { ...NgxEzTableDefaultConfig, ...config };
        if (!this.isLoading) {
            this.update();
        }
    }

    @Input() rowTemplateRef: TemplateRef<any>;
    @Input() detailsRef: TemplateRef<any>;

    @ViewChild('pagination') paginationRef: NgxEzTablePagination;
    @ViewChild('filter') filterRef: NgxEzTableFilter;
    @ViewChild('pageSizeSelector') pageSizeSelector: NgxEzTablePageSizeSelector;

    public isLoading = true;
    public currentPage = 1;
    public totalPages = 0;
    public visibleRows: Array<any> = [];
    public columns: Array<NgxEzTableColumn> = [];
    public pageSize: number;
    public deepFind = deepFind;
    public config: NgxEzTableConfig = NgxEzTableDefaultConfig;
    public sortByColumn: string;
    public sortDirection: 'ASC' | 'DESC' | null;
    public openDetails = new Set();

    private _rows: Array<any> = [];
    private _processedRows: Array<any> = [];
    private _filters: any;

    constructor(private http: HttpClient) {
        this.pageSize = NgxEzTableDefaultConfig.pageSize;
    }

    ngAfterViewInit() {
        if (this.paginationRef) {
            this.paginationRef.pageChangeEmitter.pipe(debounceTime(200)).subscribe((page: number) => {
                console.log('??? 4');
                this.currentPage = page;
                this.update();
            });
        }

        if (this.filterRef) {
            this.filterRef.filterChanged.pipe(debounceTime(200)).subscribe((values: any) => {
                console.log('??? 5');
                this._filters = values;
                this.currentPage = 1;
                this.update();
            });
        }

        if (this.pageSizeSelector) {
            this.pageSizeSelector.onChange.pipe(debounceTime(200)).subscribe((pageSize: number) => {
                console.log('??? 6');
                this.pageSize = pageSize;
                this.currentPage = 1;
                this.update();
            });
        }

        this.update();
    }

    public toggleRowDetails(id: number) {
        if (this.openDetails.has(id)) {
            this.openDetails.delete(id);
        } else {
            this.openDetails.add(id);
        }
    }

    public onSortByColumn(key: string): void {
        if (!this.config.sortable || this.columns.find(el => el.accessor === key).sortable === false) {
            return;
        }

        if (key !== this.sortByColumn) {
            this.sortByColumn = key;
            this.sortDirection = 'ASC';
        } else {
            if (this.sortDirection === 'DESC') {
                this.sortByColumn = null;
                this.sortDirection = null;
            } else {
                this.sortByColumn = key;
                this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
            }
        }

        console.log('??? 7');
        this.update();
    }

    public getRowClass(row: any) {
        if (this.config.rowClassFunc) {
            return this.config.rowClassFunc(row);
        } else {
            return '';
        }
    }

    public update(): void {
        if (!this.config.serverSide) {
            this._processedRows = this.sortRows(this.getFilteredRows());
            this.visibleRows = this.getVisibleRows();
            this.totalPages = this.getTotalPageCount();
            this.isLoading = false;
        } else {
            if (!this.config.url) {
                return;
            }

            this.isLoading = true;

            const sortColumn = this.columns.find(el => el.accessor === this.sortByColumn);
            const requestOptions: NgxEzTableRequest = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                filters: !this._filters ? {} : Object.keys(this._filters).reduce((prev, next) => {
                    const pr = this.columns.find(el => el.accessor === next);
                    if (!pr) {
                        return prev;
                    }
                    prev[pr.key ? pr.key : pr.accessor] = this._filters[next];
                    return prev;
                }, {}),
                sortKey: sortColumn ? sortColumn.key ? sortColumn.key : this.sortByColumn : this.sortByColumn,
                sortDirection: this.sortDirection
            };

            this.http.post(this.config.url, requestOptions).subscribe((resp: NgxEzTableResponse) => {
                this.visibleRows = resp.rows;
                this.totalPages = resp.totalPages;

                this.isLoading = false;
            });
        }
    }

    private getTotalPageCount(): number {
        return Math.ceil(this._processedRows.length / this.pageSize);
    }

    private getFilteredRows(): Array<any> {
        if (!this._rows) {
            return [];
        }

        return this._filters ? this._rows.filter(el => {
            return Object.keys(this._filters).every(filterKey => {
                if (this._filters[filterKey] === null || this._filters[filterKey] === '') {
                    return true;
                }

                if (!el[filterKey]) {
                    return false;
                }

                return el[filterKey].toString().toLowerCase().indexOf(this._filters[filterKey].toString().toLowerCase()) > -1;
            });
        }) : this._rows.slice();
    }

    private sortRows(rows: Array<any>): Array<any> {
        let sortedRows = rows;
        if (this.sortByColumn) {
            sortedRows = rows.slice().sort((prev: any, next: any) => {
                let a = prev[this.sortByColumn];
                let b = next[this.sortByColumn];

                // If a is empty
                if ((a === '' || a === null) && b) {
                    return -1;
                }

                // If b is empty
                if ((b === '' || b === null) && a) {
                    return 1;
                }

                // If same
                if (a === b) {
                    return 0;
                }

                // Attempt arithmetic.
                const diff = a - b;
                if (!isNaN(diff)) {
                    return diff;
                }

                // Stringify.
                a += '';
                b += '';

                // Fall back to lexicographic comparison.
                if (a < b) {
                    return -1;
                }

                if (b < a) {
                    return 1;
                }

                // Here a === b, since < is a strict total ordering on strings.
                return 0;
            });
        }

        if (this.sortDirection === 'DESC') {
            sortedRows.reverse();
        }

        return sortedRows;
    }

    private getVisibleRows(): Array<any> {
        if (!this._rows) {
            return [];
        }

        if (!this.config.pagination) {
            return this._processedRows.slice();
        }

        return this._processedRows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage);
    }
}
