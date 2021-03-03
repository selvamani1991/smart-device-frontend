import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Injectable()
export class AddressService {
    form: FormGroup;
    constructor() {
    }

    getAddressForm(_formBuilder: FormBuilder, address){
        return _formBuilder.group({
            id           : new FormControl(address.id),
            houseNumber  : new FormControl(address.houseNumber, [Validators.required,Validators.minLength(3),Validators.pattern(/^[A-Za-z0-9_ ,+_-]+$/)]),
            street       : new FormControl(address.street, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            landMark     : new FormControl(address.landMark, [Validators.required, Validators.minLength(3),Validators.pattern(/^(?!\d+$)\w+\S+/)]),
            city         : new FormControl(address.city ? address.city.name : '', [Validators.required]),
            region       : new FormControl(address.city ? address.city.region.name : '', [Validators.required, Validators.minLength(3)]),
            country      : new FormControl(address.city ? address.city.country.name : '', [Validators.required, Validators.minLength(3)]),
            zipCode      : new FormControl(address.zipCode, [Validators.required, Validators.pattern('^[0-9]{5,6}$')])
        });
    }

    validateForm() {
        let valid = true;
        return valid;
    }


}
