import { Component, OnInit,ElementRef,AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../constants';
import { MAIN_CONSTANTS } from '../../constants';
import { ViewChild } from '@angular/core'
import  MarkerClusterer from "@google/markerclusterer"

import { MainService} from '../../services/main.service';


@Component({
  selector: 'ClientStoreLocation',
  templateUrl: './client-store-location.component.html',
  styleUrls: [],
})

export class ClientStoreLocationComponent implements OnInit, AfterViewInit{
   @ViewChild('map', {static: false}) mapElement: ElementRef;
   map: google.maps.Map;
   mapProperties:any={};
   productLocation:any={};
   productLocations=[];
   loading = false;
   setting = {
        pageTitle: 'dashboard.pageTitle',
        pageDesc: 'dashboard.pageDesc',
        fullscreen: 'FullScreen',
        human: 'Human',
        mapType: 'MapType'
   };
    steps: any= [];
    APP_CONFIG= APP_CONFIG;
    MAIN_CONSTANTS= MAIN_CONSTANTS;

    constructor(
       private titleService: Title,
       private mainService: MainService
    ){
        this.APP_CONFIG = APP_CONFIG;
        this.MAIN_CONSTANTS = MAIN_CONSTANTS;

        this.titleService.setTitle( APP_CONFIG.APP_NAME + ' :: ' + this.MAIN_CONSTANTS.LABEL.DASHBOARD);
    }
    ngAfterViewInit(){
        this.mapProperties = {
           center: new google.maps.LatLng(12.9716,77.5946),
           zoom: 6,
           mapTypeId: google.maps.MapTypeId.ROADMAP,
           mapTypeControl: this.setting.mapType,
           streetViewControl: this.setting.human,
           fullscreenControl: this.setting.fullscreen
       };
       this.map = new google.maps.Map(this.mapElement.nativeElement,this.mapProperties);
       $("#map").css("min-height", window.innerHeight - 100);
       $("#map").css("height", window.innerHeight - 100);
    }

    loadCluster(){
       const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
       const markers = [];
       for(var i=0;i< this.productLocations.length;i++){
            var location = this.productLocations[i];
            if(location.longitude && location.latitude){
                var productLocation:any={
                    lng: parseFloat(location.longitude),
                    lat: parseFloat(location.latitude)
                }
                console.log(productLocation);
               var marker =  new google.maps.Marker({
                 position: productLocation,
                 label:location.deviceId
               });
               markers.push(marker);
            }
       }
       if(markers.length > 0 ){
            this.map.setCenter(markers[0].getPosition());
       }
       new MarkerClusterer(this.map, markers, {
           imagePath:
             "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
       });

    }

    ngOnInit() {
       this.loadProductLocations();
    }

    loadProductLocations() {
        this.mainService.getProductLocations()
        .subscribe(
        data => {
            if (!data['hasError']) {
            this.productLocations = data['data'];
            this.loadCluster();
        }
        this.loading = false;
    },
    () => {
        this.loading = false;
    });
    }


}
