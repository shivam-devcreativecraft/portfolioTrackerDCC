import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eightDecimalPlace'
})
export class EightDecimalPlacePipe implements PipeTransform {
  transform(value: number): number {
    if (value !== null && !isNaN(value)) {
      // Convert to a string to ensure we have exactly 8 decimal places
      const stringValue = value!.toFixed(8);
      
      // Remove leading zeros and the decimal point to get the last 8 digits
      const lastEightDigits = stringValue.replace(/^0+\./, '');
      
      return parseFloat(lastEightDigits);
    }
    return value;
  }
}
