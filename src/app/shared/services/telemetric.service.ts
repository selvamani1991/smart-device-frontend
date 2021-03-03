import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable()
export class TelemetricService {
    currentPage='';
    constructor(private router: Router,
                ) {

    }

    getCurrentPage(){
        this.currentPage=localStorage.getItem('currentPage');
        return this.currentPage;
    }
    setCurrentPage(currentPage){
        this.currentPage=currentPage;
        localStorage.setItem('currentPage', this.currentPage);
    }
}
