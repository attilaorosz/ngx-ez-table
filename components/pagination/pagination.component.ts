import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngx-ez-table-pagination', // tslint:disable-line
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
// tslint:disable-next-line
export class NgxEzTablePagination implements OnInit {

    @Input('totalPages') set totalPages(totalPages: number) {
        this._totalPages = totalPages;
        this.pages = this.calculatePages(totalPages);
    }
    @Input() set currentPage(val) {
        this._currentPage = val;
        this.pages = this.calculatePages(this._totalPages);
    }

    public pageChangeEmitter: EventEmitter<number> = new EventEmitter();
    public pages: Array<{ label: string, pageNum: number }>;
    public _currentPage;
    public _totalPages;

    private readonly collapseThreshold = 6;

    constructor() { }

    ngOnInit() {
        this.pages = this.calculatePages(this._totalPages);
    }

    onPageSwitch(pageNum) {
        if (pageNum < 1 || pageNum > this._totalPages) {
            return;
        }
        this.pageChangeEmitter.emit(pageNum);
    }

    onNext() {
        this.onPageSwitch(this._currentPage + 1);
    }

    onPrev() {
        this.onPageSwitch(this._currentPage - 1);
    }

    private calculatePages(totalPages): Array<{ label: string, pageNum: number }> {
        if (!totalPages || !this._currentPage) {
            return;
        }

        // Show all pages if fit
        if (totalPages < this.collapseThreshold) {
            return Array.from(Array(totalPages), (_, x) => x + 1).map(el => ({ label: el.toString(), pageNum: el }));
        }

        const pages: Array<{ label: string, pageNum: number }> = [];

        // Show first 4, a placeholder and the last if current page is 3 or less
        if (this._currentPage < 5) {
            for (let i = 0; i < 5; i++) {
                pages.push({ label: (i + 1).toString(), pageNum: (i + 1) });
            }
            pages.push({ label: '...', pageNum: 6 });
            pages.push({ label: totalPages.toString(), pageNum: totalPages });

            return pages;
        }

        // Current page is more than 3
        // Add the first
        pages.push({ label: '1', pageNum: 1 });

        // If last page
        if (this._currentPage === totalPages) {
            pages.push({ label: '...', pageNum: (totalPages - 5) });
            for (let i = 0; i < 5; i++) {
                pages.push({ label: (totalPages - (4 - i)).toString(), pageNum: (totalPages - (4 - i)) });
            }

            return pages;
        }

        if ((this._currentPage + 3) < totalPages) {
            pages.push({ label: '...', pageNum: (this._currentPage - 2) });
            pages.push({ label: (this._currentPage - 1).toString(), pageNum: this._currentPage - 1 });
            pages.push({ label: this._currentPage.toString(), pageNum: this._currentPage });
            pages.push({ label: (this._currentPage + 1).toString(), pageNum: this._currentPage + 1 });
            pages.push({ label: '...', pageNum: (this._currentPage + 2) });
        } else {
            pages.push({ label: '...', pageNum: (totalPages - 5) });
            pages.push({ label: (totalPages - 4).toString(), pageNum: (totalPages - 4) });
            pages.push({ label: (totalPages - 3).toString(), pageNum: (totalPages - 3) });
            pages.push({ label: (totalPages - 2).toString(), pageNum: (totalPages - 2) });
            pages.push({ label: (totalPages - 1).toString(), pageNum: (totalPages - 1) });
        }

        pages.push({ label: totalPages.toString(), pageNum: totalPages });

        return pages;
    }

}
