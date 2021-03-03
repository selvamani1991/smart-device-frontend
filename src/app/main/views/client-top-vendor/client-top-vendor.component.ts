import { Component, Input } from '@angular/core';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { MainService} from '../../services/main.service';
declare var $: any;

@Component({
  selector: 'ClientTopVendor',
  templateUrl: './client-top-vendor.component.html',
  styleUrls: [],
})

export class ClientTopVendorComponent {
    loading = false;
    selectedZone: any = '';
    zone: any= {};
    @Input ()client: any= {};
    @Input () zones= [];
    users= [];
    topVendors= [];
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
        let _self = this;
        this.loadTopVendor();
        $('#clientTopVendor').select2({
          width: '100%'
        });
        $('#clientTopVendor').on('select2:select', function(e){
           let selectId = e.params.data.id;
           _self.selectedZone = selectId;
           if (_self.selectedZone.length > 5) {
                _self.loadTopVendor();
           }

        });
    }

    loadTopVendor( ) {
        this.mainService.getTopVendors(this.selectedZone)
        .subscribe(
        data => {
            this.topVendors = data['data'];
            var activeVendors=[];
            for(let i=0; i<this.topVendors.length; i++){
                 if(this.topVendors[i].active){
                     activeVendors.push(this.topVendors[i])
                 }
            }
            this.topVendors=activeVendors;
        },
        () => {
            this.loading = false;
        });
    }

}
