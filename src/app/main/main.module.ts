import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule} from '@ngx-translate/core';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TemplateModule} from '../template/template.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { MainService } from './services/main.service';
import { HomeComponent } from './views/home/home.component';
import { Page404Component } from './views/page404/page404.component';
import { CompanyDashboardComponent } from './views/company-dashboard/company-dashboard.component';
import { CompanyCardDashboardComponent } from './views/company-card-dashboard/company-card-dashboard.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CompanyBuildingDashboardComponent } from './views/company-building-dashboard/company-building-dashboard.component';
import { ZoneAdminDashboardComponent } from './views/zone-admin-dashboard/zone-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './views/super-admin-dashboard/super-admin-dashboard.component';
import { SuperCardDashboardComponent } from './views/super-card-dashboard/super-card-dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { VendorDashboardComponent } from './views/vendor-dashboard/vendor-dashboard.component';
import { VendorCardDashboardComponent } from './views/vendor-card-dashboard/vendor-card-dashboard.component';
import { BoardDashboardComponent } from './views/board-dashboard/board-dashboard.component';
import { BoardCardDashboardComponent } from './views/board-card-dashboard/board-card-dashboard.component';
import { ZoneCardDashboardComponent } from './views/zone-card-dashboard/zone-card-dashboard.component';
import { ClientDashboardComponent } from './views/client-dashboard/client-dashboard.component';
import { ClientCardDashboardComponent } from './views/client-card-dashboard/client-card-dashboard.component';
import { DistributorDashboardComponent } from './views/distributor-dashboard/distributor-dashboard.component';
import { DistributorCardDashboardComponent } from './views/distributor-card-dashboard/distributor-card-dashboard.component';
import { ManufacturerDashboardComponent } from './views/manufacturer-dashboard/manufacturer-dashboard.component';
import { DeviceDashboardComponent } from './views/device-dashboard/device-dashboard.component';
import { ProductDetailDashboardComponent } from './views/product-detail-dashboard/product-detail-dashboard.component';
import { ProductTypeDashboardComponent } from './views/product-type-dashboard/product-type-dashboard.component';
import { VendorTopCompanyComponent } from './views/vendor-top-company/vendor-top-company.component';
import { VendorTopDistributorComponent } from './views/vendor-top-distributor/vendor-top-distributor.component';
import { ClientTopCompanyComponent } from './views/client-top-company/client-top-company.component';
import { ClientTopVendorComponent } from './views/client-top-vendor/client-top-vendor.component';
import { SuperTopSubscriptionComponent } from './views/super-top-subscription/super-top-subscription.component';
import { SuperTopClientComponent } from './views/super-top-client/super-top-client.component';
import { CompanyTopCustomerComponent } from './views/company-top-customer/company-top-customer.component';
import { CompanyTopProductComponent } from './views/company-top-product/company-top-product.component';
import { DistributorTopProductComponent } from './views/distributor-top-product/distributor-top-product.component';
import { DistributorTopCompanyComponent } from './views/distributor-top-company/distributor-top-company.component';
import { ManufacturerCardDashboardComponent } from './views/manufacturer-card-dashboard/manufacturer-card-dashboard.component';
import { ClientAllProductComponent } from './views/client-all-product/client-all-product.component';
import { ClientHealthReportComponent } from './views/client-health-report/client-health-report.component';
import { ClientZoneProductComponent } from './views/client-zone-product/client-zone-product.component';
import { ClientMachineProductComponent } from './views/client-machine-product/client-machine-product.component';
import { ClientProductSaleComponent } from './views/client-product-sale/client-product-sale.component';
import { ClientRevenueCategoryComponent } from './views/client-revenue-category/client-revenue-category.component';
import { VendorMachineHealthComponent } from './views/vendor-machine-health/vendor-machine-health.component';
import { VendorMachineSaleComponent } from './views/vendor-machine-sale/vendor-machine-sale.component';
import { VendorProductSaleComponent } from './views/vendor-product-sale/vendor-product-sale.component';
import { VendorRevenueCategoryComponent } from './views/vendor-revenue-category/vendor-revenue-category.component';
import { VendorStoreLocationComponent } from './views/vendor-store-location/vendor-store-location.component';
import { ClientStoreLocationComponent } from './views/client-store-location/client-store-location.component';
import { ClientMachineReportComponent } from './views/client-machine-report/client-machine-report.component';
import { ClientZoneRevenueComponent } from './views/client-zone-revenue/client-zone-revenue.component';
import { ClientCompanyReportComponent } from './views/client-company-report/client-company-report.component';
import { ClientVendorProductComponent } from './views/client-vendor-product/client-vendor-product.component';
import { CompanyMachineHealthComponent } from './views/company-machine-health/company-machine-health.component';
import { CompanyStoreLocationComponent } from './views/company-store-location/company-store-location.component';
import { DistributorMachineHealthComponent } from './views/distributor-machine-health/distributor-machine-health.component';
import { DistributorMachineSaleComponent } from './views/distributor-machine-sale/distributor-machine-sale.component';
import { DistributorProductSaleComponent } from './views/distributor-product-sale/distributor-product-sale.component';
import { DistributorRevenueCategoryComponent } from './views/distributor-revenue-category/distributor-revenue-category.component';
import { DistributorStoreLocationComponent } from './views/distributor-store-location/distributor-store-location.component';
import { BuildingTopManufactureComponent } from './views/building-top-manufacture/building-top-manufacture.component';
import { BuildingTopProductComponent } from './views/building-top-product/building-top-product.component';
import { CompanyCardBuildingComponent } from './views/company-card-building/company-card-building.component';
import { CompanyTopBuildingComponent } from './views/company-top-building/company-top-building.component';
import { CompanyProductBuildingComponent } from './views/company-product-building/company-product-building.component';
import { ProductCardDashboardComponent } from './views/product-card-dashboard/product-card-dashboard.component';
import { ProductHealthDashboardComponent } from './views/product-health-dashboard/product-health-dashboard.component';
import { ProductReportComponent } from './views/product-report/product-report.component';
import { DeviceCardDashboardComponent } from './views/device-card-dashboard/device-card-dashboard.component';
import { DeviceChartComponent } from './views/device-chart/device-chart.component';
import { DeviceTopCustomerComponent } from './views/device-top-customer/device-top-customer.component';
import { DeviceTopProductComponent } from './views/device-top-product/device-top-product.component';
import { VendorAllProductComponent } from './views/vendor-all-product/vendor-all-product.component';
import { CompanyAllProductComponent } from './views/company-all-product/company-all-product.component';
import { DistributorAllProductComponent } from './views/distributor-all-product/distributor-all-product.component';
import { CompanyBuildingAllComponent } from './views/company-building-all/company-building-all.component';
import { RevenueCategoryComponent } from './views/revenue-category/revenue-category.component';
import { HealthReportComponent } from './views/health-report/health-report.component';
import { ProductSaleComponent } from './views/product-sale/product-sale.component';
import { ConsumerDashboardComponent } from './views/consumer-dashboard/consumer-dashboard.component';
import { ConsumerCardDashboardComponent } from './views/consumer-card-dashboard/consumer-card-dashboard.component';
import { ConsumerTopRevenueComponent } from './views/consumer-top-revenue/consumer-top-revenue.component';
import { ConsumerTopDeviceComponent } from './views/consumer-top-device/consumer-top-device.component';
import { ConsumerOverAllProductComponent } from './views/consumer-overall-product/consumer-overall-product.component';
import { ConsumerHealthReportComponent } from './views/consumer-health-report/consumer-health-report.component';
import { ZoneTopCompanyComponent } from './views/zone-top-company/zone-top-company.component';
import { ZoneTopVendorComponent } from './views/zone-top-vendor/zone-top-vendor.component';
import { ZoneAllProductComponent } from './views/zone-all-product/zone-all-product.component';

import { ClientTotalRevenueComponent } from './views/client-total-revenue/client-total-revenue.component';
import { ClientTotalProductInstalledComponent } from './views/client-total-product-installed/client-total-product-installed.component';
import { ClientTotalHealthComponent } from './views/client-total-health/client-total-health.component';
import { ClientTotalUsageComponent } from './views/client-total-usage/client-total-usage.component';
import { ClientTotalErrorDataComponent } from './views/client-total-error-data/client-total-error-data.component';

import { ConsumerTotalUsageComponent } from './views/consumer-total-usage/consumer-total-usage.component';
import { ConsumerTotalErrorDataComponent } from './views/consumer-total-error-data/consumer-total-error-data.component';

import { CompanyTotalUsageComponent } from './views/company-total-usage/company-total-usage.component';
import { CompanyTotalErrorDataComponent } from './views/company-total-error-data/company-total-error-data.component';
import { CompanyTotalProductInstalledComponent } from './views/company-total-product-installed/company-total-product-installed.component';
import { CompanyTotalRevenueComponent } from './views/company-total-revenue/company-total-revenue.component';

import { ConsumerTotalHealthComponent } from './views/consumer-total-health/consumer-total-health.component';

import { CompanyTotalHealthComponent } from './views/company-total-health/company-total-health.component';

@NgModule({
    declarations: [
        HomeComponent,
        DashboardComponent,
        VendorDashboardComponent,
        BoardDashboardComponent,
        ClientDashboardComponent,
        CompanyDashboardComponent,
        CompanyBuildingDashboardComponent,
        DistributorDashboardComponent,
        ZoneAdminDashboardComponent,
        Page404Component,
        ProductDetailDashboardComponent,
        SuperAdminDashboardComponent,
        ManufacturerDashboardComponent,
        DeviceDashboardComponent,
        ProductTypeDashboardComponent,
        VendorCardDashboardComponent,
        SuperCardDashboardComponent,
        ClientCardDashboardComponent,
        DistributorCardDashboardComponent,
        CompanyCardDashboardComponent,
        VendorTopCompanyComponent,
        VendorTopDistributorComponent,
        ClientTopCompanyComponent,
        ClientTopVendorComponent,
        SuperTopSubscriptionComponent,
        SuperTopClientComponent,
        CompanyTopCustomerComponent,
        CompanyTopProductComponent,
        DistributorTopCompanyComponent,
        DistributorTopProductComponent,
        BoardCardDashboardComponent,
        ZoneCardDashboardComponent,
        ManufacturerCardDashboardComponent,
        ClientAllProductComponent,
        ClientHealthReportComponent,
        ClientZoneProductComponent,
        ClientMachineProductComponent,
        ClientProductSaleComponent,
        ClientRevenueCategoryComponent,
        VendorMachineHealthComponent,
        VendorMachineSaleComponent,
        VendorProductSaleComponent,
        VendorRevenueCategoryComponent,
        VendorStoreLocationComponent,
        ClientStoreLocationComponent,
        ClientMachineReportComponent,
        ClientZoneRevenueComponent,
        ClientCompanyReportComponent,
        ClientVendorProductComponent,
        CompanyMachineHealthComponent,
        CompanyStoreLocationComponent,
        DistributorMachineHealthComponent,
        DistributorMachineSaleComponent,
        DistributorProductSaleComponent,
        DistributorRevenueCategoryComponent,
        DistributorStoreLocationComponent,
        BuildingTopManufactureComponent,
        BuildingTopProductComponent,
        CompanyCardBuildingComponent,
        CompanyTopBuildingComponent,
        CompanyProductBuildingComponent,
        ProductCardDashboardComponent,
        ProductHealthDashboardComponent,
        ProductReportComponent,
        DeviceCardDashboardComponent,
        DeviceChartComponent,
        DeviceTopCustomerComponent,
        DeviceTopProductComponent,
        VendorAllProductComponent,
        CompanyAllProductComponent,
        DistributorAllProductComponent,
        CompanyBuildingAllComponent,
        RevenueCategoryComponent,
        HealthReportComponent,
        ProductSaleComponent,
        ConsumerDashboardComponent,
        ConsumerCardDashboardComponent,
        ConsumerTopRevenueComponent,
        ConsumerTopDeviceComponent,
        ConsumerOverAllProductComponent,
        ConsumerHealthReportComponent,
        ConsumerTopDeviceComponent,
        ZoneTopCompanyComponent,
        ZoneTopVendorComponent,
        ZoneAllProductComponent,
        ClientTotalRevenueComponent,
        ClientTotalProductInstalledComponent,
        ClientTotalHealthComponent,
        ClientTotalUsageComponent,
        ClientTotalErrorDataComponent,
        ConsumerTotalUsageComponent,
        ConsumerTotalErrorDataComponent,

        CompanyTotalUsageComponent,
        CompanyTotalErrorDataComponent,
        CompanyTotalProductInstalledComponent,
        CompanyTotalRevenueComponent,
        ConsumerTotalHealthComponent,
        CompanyTotalHealthComponent
    ],

    imports: [
        TranslateModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        PerfectScrollbarModule,
        TemplateModule,
        SharedModule,
        LayoutModule,
        MainRoutingModule
    ],

    exports: [
        HomeComponent,
        DashboardComponent,
        VendorDashboardComponent,
        BoardDashboardComponent,
        ClientDashboardComponent,
        CompanyDashboardComponent,
        CompanyBuildingDashboardComponent,
        DistributorDashboardComponent,
        ZoneAdminDashboardComponent,
        SuperAdminDashboardComponent,
        ManufacturerDashboardComponent,
        DeviceDashboardComponent,
        Page404Component,
        ProductDetailDashboardComponent,
        ProductTypeDashboardComponent,
        VendorCardDashboardComponent,
        SuperCardDashboardComponent,
        ClientCardDashboardComponent,
        DistributorCardDashboardComponent,
        CompanyCardDashboardComponent,
        VendorTopCompanyComponent,
        VendorTopDistributorComponent,
        ClientTopCompanyComponent,
        ClientTopVendorComponent,
        SuperTopSubscriptionComponent,
        SuperTopClientComponent,
        CompanyTopCustomerComponent,
        CompanyTopProductComponent,
        DistributorTopCompanyComponent,
        DistributorTopProductComponent,
        BoardCardDashboardComponent,
        ZoneCardDashboardComponent,
        ManufacturerCardDashboardComponent,
        ClientAllProductComponent,
        ClientHealthReportComponent,
        ClientZoneProductComponent,
        ClientMachineProductComponent,
        ClientProductSaleComponent,
        ClientRevenueCategoryComponent,
        VendorMachineHealthComponent,
        VendorMachineSaleComponent,
        VendorProductSaleComponent,
        VendorRevenueCategoryComponent,
        VendorStoreLocationComponent,
        ClientStoreLocationComponent,
        ClientMachineReportComponent,
        ClientZoneRevenueComponent,
        ClientCompanyReportComponent,
        ClientVendorProductComponent,
        CompanyMachineHealthComponent,
        CompanyStoreLocationComponent,
        DistributorMachineHealthComponent,
        DistributorMachineSaleComponent,
        DistributorProductSaleComponent,
        DistributorRevenueCategoryComponent,
        DistributorStoreLocationComponent,
        BuildingTopManufactureComponent,
        BuildingTopProductComponent,
        CompanyCardBuildingComponent,
        CompanyTopBuildingComponent,
        CompanyProductBuildingComponent,
        ProductCardDashboardComponent,
        ProductHealthDashboardComponent,
        ProductReportComponent,
        DeviceCardDashboardComponent,
        DeviceChartComponent,
        DeviceTopCustomerComponent,
        DeviceTopProductComponent,
        VendorAllProductComponent,
        CompanyAllProductComponent,
        DistributorAllProductComponent,
        CompanyBuildingAllComponent,
        RevenueCategoryComponent,
        HealthReportComponent,
        ProductSaleComponent,
        ConsumerDashboardComponent,
        ConsumerCardDashboardComponent,
        ConsumerTopRevenueComponent,
        ConsumerTopDeviceComponent,
        ConsumerOverAllProductComponent,
        ConsumerHealthReportComponent,
        ConsumerTopDeviceComponent,
        ZoneTopCompanyComponent,
        ZoneTopVendorComponent,
        ZoneAllProductComponent,
        ClientTotalRevenueComponent,
        ClientTotalProductInstalledComponent,
        ClientTotalHealthComponent,
        ClientTotalUsageComponent,
        ClientTotalErrorDataComponent,
        ConsumerTotalUsageComponent,
        ConsumerTotalErrorDataComponent,

        CompanyTotalUsageComponent,
        CompanyTotalErrorDataComponent,
        CompanyTotalProductInstalledComponent,
        CompanyTotalRevenueComponent,
        ConsumerTotalHealthComponent,
        CompanyTotalHealthComponent
    ],

    providers: [MainService],
    bootstrap: [
        HomeComponent,
        DashboardComponent,
        Page404Component,
        VendorDashboardComponent,
        BoardDashboardComponent,
        ClientDashboardComponent,
        CompanyDashboardComponent,
        CompanyBuildingDashboardComponent,
        DistributorDashboardComponent,
        ZoneAdminDashboardComponent,
        SuperAdminDashboardComponent,
        ManufacturerDashboardComponent,
        DeviceDashboardComponent,
        ProductDetailDashboardComponent,
        ProductTypeDashboardComponent,
        VendorCardDashboardComponent,
        SuperCardDashboardComponent,
        ClientCardDashboardComponent,
        DistributorCardDashboardComponent,
        CompanyCardDashboardComponent,
        VendorTopCompanyComponent,
        VendorTopDistributorComponent,
        ClientTopCompanyComponent,
        ClientTopVendorComponent,
        SuperTopSubscriptionComponent,
        SuperTopClientComponent,
        CompanyTopCustomerComponent,
        CompanyTopProductComponent,
        DistributorTopProductComponent,
        DistributorTopCompanyComponent,
        BoardCardDashboardComponent,
        ZoneCardDashboardComponent,
        ManufacturerCardDashboardComponent,
        ClientAllProductComponent,
        ClientHealthReportComponent,
        ClientZoneProductComponent,
        ClientMachineProductComponent,
        ClientProductSaleComponent,
        ClientRevenueCategoryComponent,
        VendorMachineHealthComponent,
        VendorMachineSaleComponent,
        VendorProductSaleComponent,
        VendorRevenueCategoryComponent,
        VendorStoreLocationComponent,
        ClientStoreLocationComponent,
        ClientMachineReportComponent,
        ClientZoneRevenueComponent,
        ClientCompanyReportComponent,
        ClientVendorProductComponent,
        CompanyMachineHealthComponent,
        DistributorMachineHealthComponent,
        CompanyStoreLocationComponent,
        DistributorMachineSaleComponent,
        DistributorProductSaleComponent,
        DistributorRevenueCategoryComponent,
        DistributorStoreLocationComponent,
        BuildingTopManufactureComponent,
        BuildingTopProductComponent,
        CompanyCardBuildingComponent,
        CompanyTopBuildingComponent,
        CompanyProductBuildingComponent,
        ProductCardDashboardComponent,
        ProductHealthDashboardComponent,
        ProductReportComponent,
        DeviceCardDashboardComponent,
        DeviceChartComponent,
        DeviceTopProductComponent,
        VendorAllProductComponent,
        CompanyAllProductComponent,
        DistributorAllProductComponent,
        CompanyBuildingAllComponent,
        RevenueCategoryComponent,
        HealthReportComponent,
        ProductSaleComponent,
        ConsumerDashboardComponent,
        ConsumerCardDashboardComponent,
        ConsumerTopRevenueComponent,
        ConsumerTopDeviceComponent,
        ConsumerOverAllProductComponent,
        ConsumerHealthReportComponent,
        ConsumerTopDeviceComponent,
        ZoneTopCompanyComponent,
        ZoneTopVendorComponent,
        ZoneAllProductComponent,
        ClientTotalRevenueComponent,
        ClientTotalProductInstalledComponent,
        ClientTotalHealthComponent,
        ClientTotalUsageComponent,
        ClientTotalErrorDataComponent,
        ConsumerTotalUsageComponent,
        ConsumerTotalErrorDataComponent,

        CompanyTotalUsageComponent,
        CompanyTotalErrorDataComponent,
        CompanyTotalProductInstalledComponent,
        CompanyTotalRevenueComponent,
        ConsumerTotalHealthComponent,
        CompanyTotalHealthComponent
    ]
})
export class MainModule { }
