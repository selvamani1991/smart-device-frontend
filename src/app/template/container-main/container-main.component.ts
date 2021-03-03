import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'container-main',
  templateUrl: './container-main.component.html',
  styleUrls: []
})
export class ContainerMainComponent {
    constructor(private containerMainRef: ElementRef) {
    }

    ngOnInit(): void {
        var self = this;
        var elem = $(self.containerMainRef.nativeElement).find('div.container-main');
        elem.css('height', window.innerHeight - 150);
    }
}
