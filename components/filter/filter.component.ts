import { NgxEzTableColumn } from './../../models/column';
import { Component, OnInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: '[ngx-ez-table-filters]', // tslint:disable-line
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
// tslint:disable-next-line
export class NgxEzTableFilter implements OnInit, OnDestroy {

    @Input('columns') set _columns(columns: NgxEzTableColumn[]) {
        this.columns = columns;
        Object.keys(this.parentForm).forEach(formElem => {
            this.parentForm.removeControl(formElem);
        });
        columns.forEach((column: NgxEzTableColumn) => {
            if (column.searchable || column.searchable === undefined) {
                this.parentForm.addControl(column.accessor.toString(), new FormControl());
            }
        });
    }

    @Input() hasDetails: boolean;

    public filterChanged: EventEmitter<any> = new EventEmitter();
    public parentForm = new FormGroup({});
    public columns: NgxEzTableColumn[] = [];

    private onComponentDestroyed = new Subject();

    constructor() { }

    ngOnInit() {
        this.parentForm.valueChanges.pipe(takeUntil(this.onComponentDestroyed)).subscribe(val => {
            this.filterChanged.emit(val);
        });
    }

    ngOnDestroy() {
        this.onComponentDestroyed.next();
        this.onComponentDestroyed.unsubscribe();
    }

}
