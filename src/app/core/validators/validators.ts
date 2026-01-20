import { ValidatorFn, AbstractControl, ValidationErrors, FormControl } from "@angular/forms";

export function whiteSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control as FormControl).value.trim();

    if (value) {
      return null
    } else {
      return { emptyString: true }
    }
  }
}