import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'default',
  standalone: true, // Set to true for modern standalone pipes (Angular 14+).
  // If you use NgModules, remove this line and declare it in a module.
})
export class DefaultValuePipe implements PipeTransform {
  /**
   * Transforms a value to a default string if it is null or undefined.
   * @param value The value to check.
   * @param defaultValue The string to return if the value is null or undefined. Defaults to 'No data'.
   */
  transform(value: unknown, defaultValue = 'No data'): unknown {
    // Return the default value only if the input is null or undefined
    return value === null || value === undefined ? defaultValue : value;
  }
}
