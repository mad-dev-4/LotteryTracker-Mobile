import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe is specific to formatting a lotto board for display purposes.
 *  
 *
 * 
 *
 * <p> {{ lottoBoard | formatLottoBoardPipe}}  </p>
 **/
@Pipe({name: 'formatLottoBoardPipe'})
export class FormatLottoBoardPipe implements PipeTransform {
	transform(value: string): any {
		var lstReplace = value.replace(/\,/g,' ');
		return lstReplace;
	}
}

