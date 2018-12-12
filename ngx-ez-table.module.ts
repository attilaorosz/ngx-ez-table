import { NgxEzTablePageSizeSelector } from './components/page-size-selector/page-size-selector.component';
import { NgxEzTableComponent } from './ngx-ez-table.component';
import { NgxEzTablePagination } from './components/pagination/pagination.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEzTableFilter } from './components/filter/filter.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [
        NgxEzTablePagination,
        NgxEzTableComponent,
        NgxEzTableFilter,
        NgxEzTablePageSizeSelector
    ],
    exports: [
        NgxEzTableComponent
    ]
})
export class NgxEzTableModule {
}
