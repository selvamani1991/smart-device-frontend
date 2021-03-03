import { Injectable } from '@angular/core';


@Injectable()
export class TooltipService {
  constructor() {
  }
  clear() {
    $('[data-toggle="tooltip"]').tooltip('hide');
  }

  enable() {
    setTimeout(function(){
      $('[data-toggle="tooltip"]').tooltip();
    }, 500);
  }
}
