import { FormGroup, FormControl } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngx-ez-table-page-size-selector', // tslint:disable-line
    templateUrl: './page-size-selector.component.html',
    styleUrls: ['./page-size-selector.component.scss']
})
// tslint:disable-next-line
export class NgxEzTablePageSizeSelector implements OnInit {
    @Input() set pageSize(pageSize: number) {
        this.form.get('pageSize').setValue(pageSize, { emitEvent: false });
    }

    @Input() pageSizeOptions: Array<number>;

    public onChange: EventEmitter<number> = new EventEmitter();

    public form = new FormGroup({
        pageSize: new FormControl()
    });

    ngOnInit() {
        this.form.valueChanges.subscribe((val: any) => {
            this.onChange.emit(val.pageSize);
        });
    }

}
