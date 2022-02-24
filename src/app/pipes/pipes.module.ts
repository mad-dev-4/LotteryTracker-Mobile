import { NgModule } from '@angular/core';
import { OrderByPipe } from './orderby.pipe';
import { MapToIterablePipe } from './maptoiterable.pipe';
import { FormatLottoBoardPipe } from './formatlottoboard.pipe';
import { FormatCurrencyPipe } from './formatcurrency.pipe';

@NgModule({
    declarations: [OrderByPipe,
        MapToIterablePipe,
        FormatLottoBoardPipe,
        FormatCurrencyPipe],
    imports: [],
    exports: [OrderByPipe,
        MapToIterablePipe,
        FormatLottoBoardPipe,
        FormatCurrencyPipe]
})
export class PipesModule { }
