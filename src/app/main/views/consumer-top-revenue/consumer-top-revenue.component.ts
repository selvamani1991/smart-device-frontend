import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ConsumerTopRevenue',
  templateUrl: './consumer-top-revenue.component.html',
  styleUrls: [],
})

export class ConsumerTopRevenueComponent {
    loading = false;
    @Input () client: any= {};
    @Input () dashboardDetail: any= {};
    //@Input () zones= [];
    users= [];
    topConsumers= [];
    steps: any= [];
    alias: any;
    CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;
    constructor(
    private mainService: MainService) {
        this.CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;
    }

    ngOnInit() {
        this.loadTopConsumerByRevenue();
    }

    loadTopConsumerByRevenue( ) {
        this.mainService.getTopConsumerByRevenue()
        .subscribe(
        data => {
            this.topConsumers = data['data'];
        },
        () => {
            this.loading = false;
        });
    }

}
