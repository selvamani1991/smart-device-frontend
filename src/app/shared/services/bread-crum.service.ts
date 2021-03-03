import { Injectable } from '@angular/core';

@Injectable()
export class BreadCrumService {
    steps= [];
    constructor() {

    }

    pushStep(title, state, isTop) {
        var step = {
            'title': title,
            'state': state
        };
        if (isTop) {
            this.steps = [];
        }
        this.steps.push(step);
    }

    getSteps() {
        return this.steps;
    }
}
