import { Directive } from '@angular/core';
import { AbstractControl, NG_ASYNC_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserGetItem } from 'src/app/pixelart/model/user-get-item';

@Directive({
  selector: '[appEmailAliasValidator]',
  providers: [
    {provide: NG_ASYNC_VALIDATORS,
      useExisting: EmailAliasValidatorDirective, multi: true}]
})

export class EmailAliasValidatorDirective implements Validator {

  constructor(private userService: UserService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return new Promise(resolve => {
      // setTimeout(() => {
        this.userService.getAllUsers().subscribe((users: UserGetItem[]) => {
          for (let i = 0; i < users.length; i++) {
            if (users[i].alias === control.value.alias) {
              console.log('Inside of alias exists, control value: '+ control.value.alias);
              if (users[i].user_email === control.value.email) {
                console.log('Inside of alias and mail exist, control value: '+ control.value.email);
                resolve({'AliasAndEmailAreTaken' : true});
              }
              resolve({'AliasIsTaken' : true});
            } else if (users[i].user_email === control.value.email) {
                resolve({'EmailIsTaken' : true});
            } else {
              console.log('Inside if else at the end, control value: '+ control.value)
                resolve(null);
            }
          }
        })
        // , 1500});
    });
  }
}
