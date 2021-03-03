import { Component, Input, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'letter-icon',
  templateUrl: './letter-icon.component.html',
  styleUrls: []
})
export class LetterIconComponent implements OnInit{

    @Input() size: any;
    @Input() icon: any;
    @Input() data: any;
    @Input() charCount: any;
    @Input() customClass: any;
    @Input() border: any;
    @Input() box: any;
    @Input() color: any;
    letter: any = '';
    constructor(private letterIconRef : ElementRef, private translate: TranslateService) {

    }

    ngAfterViewInit() {

    }

    ngOnInit(): void {
        this.showLetter();
    }

    showLetter() {
        var self = this;
        var elem = $(self.letterIconRef.nativeElement).find('div');
        if (self.size && (self.size == 'sm' || self.size == 'lg')) {
            elem.addClass('size-' + self.size);
        }
        if (self.customClass) {
            if (self.customClass.charAt(0) === '.') {
                self.customClass = self.customClass.substr(1);
            }
            elem.addClass(self.customClass);
        }
        if (self.border) {
            elem.addClass('border');
        }
        if (self.box && (self.box == 'round' || self.box == 'circle')) {
            elem.addClass('box-' + self.box);
        }
        if (self.color && (this.parseColourString(self.color) !== false || self.color !== 'auto')) {
            var boxColor;
            elem.removeClass(function (index, css) {
                return (css.match(/(^|\s)letter-color-\S+/g) || []).join(' ');
            });
            boxColor = this.parseColourString(self.color);
            elem.css({
                backgroundColor: 'rgb(' + boxColor + ')'
            });
        }
        if (self.icon) {
            elem.append('<i class="' + self.icon + '"></i>');
        }
        this.translate.get(self.data).subscribe((res: string) => {
            var text = res.trim();

            if (self.color && self.color == 'auto') {

                elem.removeClass(function (index, css) {
                    return (css.match(/(^|\s)letter-color-\S+/g) || []).join(' ');
                });
                elem.addClass('letter-color-' + text.charAt(0).toLowerCase());

            }
            if (self.charCount && !isNaN(self.charCount)) {
                var newString = text.split(/(?=[A-Z])/), count = parseInt(self.charCount);

                if (count > newString.length) {
                    count = newString.length;
                }
                for (let i = 0; i < count; i++) {
                    self.letter = self.letter + newString[i].charAt(0);

                }
                self.letter = self.letter.toUpperCase();
            } else {
                self.letter = text.charAt(0).toUpperCase();
            }

        });
    }

    parseColourString(s) {

        // Tokenise input
        var m = s.match(/^\#|^rgb\(|[\d\w]+$|\d{3}/g);

        // Other variables
        var value, values;
        var valid = true, double = false;

        // If no matches, return false
        if (!m) {
            return false;
        }

        // If hex value
        if (m.length < 3) {
            // Get the value
            value = m[m.length - 1];

            // Split into parts, either x,x,x or xx,xx,xx
            values = value.length == 3 ? double = true && value.split('') : value.match(/../g);

            // Convert to decimal values - if #nnn, double up on values 345 => 334455
            values.forEach(function (v, i) {
                values[i] = parseInt(double ? '' + v + v : v, 16);
            });

            // Otherwise it's rgb, get the values
        } else {
            values = m.length == 3 ? m.slice() : m.slice(1);
        }

        // Check that each value is between 0 and 255 inclusive and return the result
        values.forEach(function (v) {
            valid = valid ? v >= 0 && v <= 255 : false;
        });

        // If string is invalid, return false, otherwise return an array of the values
        return valid && values;
    }

}
