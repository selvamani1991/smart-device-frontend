import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, Response } from '@angular/http';

import { HttpClientService } from '../../shared/services/http-client.service';
import { MAIN_CONSTANTS } from '../constants';

@Injectable()
export class MainService {
MAIN_CONSTANTS=MAIN_CONSTANTS;
message:any;
constructor(private httpClientService:HttpClientService ) {
this.MAIN_CONSTANTS=MAIN_CONSTANTS;
}

    setMessage(message){
        this.message=message;
    }

    getMessage(){
        return this.message;
    }

    getDashboard(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.DASHBOARD,{});
    }

    getTopCompany(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANIES+data,{});
    }

    getTopVendor(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_VENDORS,{});
    }

    getTopVendors(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_VENDORS+data,{});
    }


    getTopCompanies(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANIES+data,{});
    }

    getTopZoneCompany(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANIES,{});
    }

    getTopClient(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_CLIENTS,{});
    }

    getTopSubscription(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_SUBSCRIPTIONS,{});
    }

    getTopDistributor(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_DISTRIBUTORS+data,{});
    }

    getTopCompanyBuilding(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANY_BUILDINGS,{});
    }

    getTopCompanyBuildings(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANY_BUILDINGS+data,{});
    }


    getTopDistributorProduct(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_DISTRIBUTOR_PRODUCT,{});
    }

    getTopCompanyProduct(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANY_PRODUCT,{});
    }

    getTopCompanyProducts(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANY_PRODUCT+data,{});
    }

    getTopCompanyBuildingProduct(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANY_BUILDING_PRODUCT,{});
    }

    getClient(ownerId){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

    getVendor(ownerId){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CLIENT.replace(':alias',ownerId)+"?isId=false",{});
    }

    getClientSubscriptions(){
        //var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CLIENT_SUBSCRIPTIONS,{});
    }

    getVendorSubscriptions(){
        //var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.VENDOR_SUBSCRIPTIONS,{});
    }

    getCompanySubscriptions(){
        //var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.COMPANY_SUBSCRIPTIONS,{});
    }

    getDistributorSubscriptions(){
        //var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.DISTRIBUTOR_SUBSCRIPTIONS,{});

    }

    getZones(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.ZONES+data,{});
    }
    getProducts(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCTS,{});
    }


    getCountries(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.COUNTRIES+data,{});
    }

    getProductTypes(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPES+data,{});
    }

    getCompanies(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.COMPANIES+data,{});
    }

    getVendors(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.VENDORS+data,{});
    }

    getClientOverAllProduct(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CLIENT_OVERALL_PRODUCT,{});
    }

    /* getTopProductType(){
    return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_PRODUCT_TYPE,{});
    } */

    getCurrentVendorDetail(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CURRENT_VENDOR,{});
    }

    getProduct(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT,{});
    }

    getProductType(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPE,{});
    }

    getAllVendorProducts(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.VENDOR_PRODUCT,{});
    }

    getProductRevenue(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT,{});
    }

    getProductTypeZone(productTypeId){
        var data="?productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_PRODUCT_TYPE_ZONE+data,{});
    }


    getZoneVendors(zoneId){
    var data="?zoneId="+zoneId;
    return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_VENDORS+data,{});
    }

    /* getTotalProduct(zoneId){
    var data="?active=true&zoneId="+zoneId;
    return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOTAL_PRODUCT+data,{});
    } */

    getClientTopProductType(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CLIENT_TOP_PRODUCT_TYPE+data,{});
    }

    getZoneTopProductType(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CLIENT_TOP_PRODUCT_TYPE,{});
    }


    getInstalledProduct(zoneId,productTypeId){
        var data="?zoneId="+zoneId+"&productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.INSTALLED_PRODUCT+data,{});
    }

    getZoneProductType(productTypeId){
        var data="?productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.ZONE_PRODUCT_TYPE+data,{});
    }

    getProductTypeComponent(zoneId,productTypeId){
        var data="?zoneId="+zoneId+"&productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPE_COMPONENT+data,{});
    }

    getProductRevenueReport(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_REVENUE_REPORT+data,{});
    }

    getProductTypeWiseRevenue(zoneId,alias){
        var data="?zoneId="+zoneId+"&alias="+alias;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPE_WISE_REVENUE+data,{});
    }

    getZoneWiseRevenue(zoneId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.ZONE_WISE_REVENUE+data,{});
    }

    getProductTypeWiseCompanyRevenue(zoneId,alias){
        var data="?zoneId="+zoneId+"&alias="+alias;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.COMPANY_WISE_REVENUE+data,{});
    }

    getProductTypeWiseVendorRevenue(zoneId,alias){
        var data="?zoneId="+zoneId+"&alias="+alias;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.VENDOR_WISE_REVENUE+data,{});
    }

    getProductRevenueCategory(productTypeId){
        var data="?productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.VENDOR_WISE_REVENUE+data,{});
    }
    getInstalledProductHealth(productTypeId){
        var data="?productTypeId="+productTypeId;
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.INSTALLED_PRODUCT_HEALTH,{});
    }

    getSalesRevenue(zoneId,productTypeId){
        var data="?zoneId="+zoneId+"&productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.SALES_REVENUE+data,{});
    }

    getProductSalesRevenue(productTypeId){
        var data="?productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.SALES_REVENUE+data,{});
    }

    getProductSales(productTypeId){
        var data="?productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_SALES+data,{});
    }

    getCompanyTopProductType(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CLIENT_TOP_PRODUCT_TYPE,{});
    }

    getProductStatus(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_STATUS,{});
    }

    getTotalRevenue(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOTAL_REVENUE,{});
    }

    /***** Consumer-Product ******/

    getInstalledConsumerProduct(productTypeId){
        var data="?productTypeId="+productTypeId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.INSTALLED_PRODUCT+data,{});
    }

    getTopConsumerByDevice(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_CONSUMER_BY_DEVICE,{});
    }

    getTopConsumerByRevenue(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_CONSUMER_BY_REVENUE,{});
    }

    getConsumerDashboard(){
        var data="?isConsumerProduct=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CONSUMER_DASHBOARD+data,{});
    }

    getConsumerProductHealth(){
        var data="?isConsumerProduct=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CONSUMER_PRODUCT_HEALTH+data,{});
    }

    getConsumerTopProductType(){
        /// var data="?productTypeId="+productTypeId+"&isConsumerProduct=true"; /
        //var data="?isConsumerProduct=true";
        var data="?owner=true&isConsumerProduct=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CONSUMER_TOP_PRODUCT_TYPE+data,{});
    }

    getConsumerTotalRevenue(){
        var data="?isConsumerProduct=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CONSUMER_TOTAL_REVENUE+data,{});
    }

    getConsumerProductHealthReport(request){
        var data="?dummy=true";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.CONSUMER_PRODUCT_HEALTH_REPORT+data,request);
    }

    getZoneAdminProductTypes(ownerId){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPES.replace(':ownerId', ownerId), {});
    }

    getTopZoneCompanies(zoneId,ownerId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANIES.replace(':ownerId',ownerId)+data,{});
    }

    getTopZoneVendors(zoneId,ownerId){
        var data="?zoneId="+zoneId;
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_VENDORS.replace(':ownerId',ownerId)+data,{});
    }

    getCompanyZones(ownerId){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.ZONES.replace(':ownerId',ownerId)+"?isId=false",{});
    }

    getZoneAdminCompany(ownerId){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.COMPANY_LIST.replace(':ownerId',ownerId),{});
    }

    getZoneAdminVendor(ownerId){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.VENDOR_LIST.replace(':ownerId',ownerId),{});
    }

    getCurrentProductType() {
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CURRENT_PRODUCT_TYPE, {});
    }

    getTopCompanyBuildingProductType(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.TOP_COMPANY_BUILDING_PRODUCT_TYPE,{});
    }

    getProductActiveInactiveStatus(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_ACTIVE_INACTIVE,{});
    }

    /* dummy */

    getClientProductInstalled(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.CLIENT_PRODUCT_INSTALLED+data,request);
    }

    getClientTotalRevenue(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.CLIENT_TOTAL_REVENUE+data,request);
    }

    getClientTotalHealth(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.CLIENT_TOTAL_HEALTH+data,request);
    }

    getTotalUsage(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.CLIENT_TOTAL_USAGE+data,request);
    }

    getTotalErrorData(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.CLIENT_TOTAL_ERROR_DATA+data,request);
    }
    /* dummy */

    /***** companyDummy ******/

    getCompanyProductInstalled(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.COMPANY_PRODUCT_INSTALLED+data,request);
    }

    getCompanyTotalUsage(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.COMPANY_TOTAL_USAGE+data,request);
    }

    getCompanyTotalErrorData(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.COMPANY_TOTAL_ERROR_DATA+data,request);
    }

    getCompanyTotalRevenue(request){
        var data="?dummy=false";
        return this.httpClientService.postRequest(this.MAIN_CONSTANTS.API.COMPANY_TOTAL_REVENUE+data,request);
    }
    getCompanyProductTypes(){
        //var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPES,{});
    }
    /***** companyDummy *******/

    getProductLocations(){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_LOCATION,{});
    }

    getCompanyBuilding(){
        var data="?owner=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.COMPANY_BUILDING+data,{});
    }

    getConsumerProductActiveInactiveStatus(){
        var data="?isConsumerProduct=true";
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CONSUMER_PRODUCT_ACTIVE_INACTIVE+data,{});
    }



   getProductTypeForGraph() {
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPE_GRAPH, {});
   }

   /* getProductTypeForGraph(alias){
        return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.PRODUCT_TYPE_GRAPH.replace(':alias',alias),{});
   } */

   getCurrentProductTypeList() {
       return this.httpClientService.getRequest(this.MAIN_CONSTANTS.API.CURRENT_PRODUCT_TYPE_LIST, {});
   }

}