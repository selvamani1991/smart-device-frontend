import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './main/views/home/home.component';
import { DashboardComponent } from './main/views/dashboard/dashboard.component';
import { UserModule} from './user/user.module';
import { PermissionModule} from './permission/permission.module';
import { MainModule} from './main/main.module';
import { ExternalModule} from './external/external.module';
import { AuthModule} from './auth/auth.module';
import { AuthGuard} from './auth/services/auth.guard';
import { Page404Component } from './main/views/page404/page404.component';

import { CityModule } from './city/city.module';
import { MachineManufacturerModule } from './machine-manufacturer/machine-manufacturer.module';
import { ClientModule } from './client/client.module';
import { CompanyBuildingModule} from './company-building/company-building.module';

import { CompanyModule } from './company/company.module';
import { DistributorModule } from './distributor/distributor.module';
import { BoardModule } from './board/board.module';
import { VendorModule } from './vendor/vendor.module';
import { ProductModule } from './product/product.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { MachineModule } from './machine/machine.module';
import { BoardManufacturerModule } from './board-manufacturer/board-manufacturer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TelemetricDataModule } from './telemetric-data/telemetric-data.module';
import { ZoneModule} from './zone/zone.module';
import { ReportModule} from './report/report.module';
import { ProductSubscriptionModule} from './product-subscription/product-subscription.module';
import { ProductCategoryModule} from './product-category/product-category.module';
import { InvoiceModule} from './invoice/invoice.module';
import { MediaModule} from './media/media.module';
import { ResourcesModule} from './resources/resources.module';
import { ProductWizardModule} from './product-wizard/product-wizard.module';
import { ConsumerSubscriptionModule} from './consumer-subscription/consumer-subscription.module';
import { RoomTypeModule} from './room-type/room-type.module';


import { APP_CONSTANTS } from './constants';



const appRoutes: Routes = [
    { path: APP_CONSTANTS.LINK.HOME, component: DashboardComponent, canActivate: [AuthGuard] },
    { path: APP_CONSTANTS.LINK.AUTH, loadChildren: () => AuthModule },
    { path: APP_CONSTANTS.LINK.MAIN, loadChildren: () => MainModule },
    { path: APP_CONSTANTS.LINK.EXTERNAL, loadChildren: () => ExternalModule },
    { path: APP_CONSTANTS.LINK.PERMISSION, loadChildren: () => PermissionModule },
    { path: APP_CONSTANTS.LINK.USER, loadChildren: () => UserModule },
    { path: APP_CONSTANTS.LINK.CITY, loadChildren: () => CityModule },
    { path: APP_CONSTANTS.LINK.CLIENT, loadChildren: () => ClientModule },
    { path: APP_CONSTANTS.LINK.COMPANY, loadChildren: () => CompanyModule },
    { path: APP_CONSTANTS.LINK.DISTRIBUTOR, loadChildren: () => DistributorModule },
    { path: APP_CONSTANTS.LINK.BOARD, loadChildren: () => BoardModule },
    { path: APP_CONSTANTS.LINK.MACHINE_MANUFACTURER, loadChildren: () => MachineManufacturerModule },
    { path: APP_CONSTANTS.LINK.COMPANY_BUILDING, loadChildren: () => CompanyBuildingModule },
    { path: APP_CONSTANTS.LINK.PRODUCT, loadChildren: () => ProductModule },
    { path: APP_CONSTANTS.LINK.PRODUCT_TYPE, loadChildren: () => ProductTypeModule },
    { path: APP_CONSTANTS.LINK.VENDOR, loadChildren: () => VendorModule },
    { path: APP_CONSTANTS.LINK.MACHINE, loadChildren: () => MachineModule },
    { path: APP_CONSTANTS.LINK.BOARD_MANUFACTURER, loadChildren: () => BoardManufacturerModule },
    { path: APP_CONSTANTS.LINK.CONSUMER, loadChildren: () => ConsumerModule },
    { path: APP_CONSTANTS.LINK.SUBSCRIPTION, loadChildren: () => SubscriptionModule },
    { path: APP_CONSTANTS.LINK.TELEMETRIC_DATA, loadChildren: () => TelemetricDataModule },
    { path: APP_CONSTANTS.LINK.ZONE, loadChildren: () => ZoneModule },
    { path: APP_CONSTANTS.LINK.PRODUCT_SUBSCRIPTION, loadChildren: () => ProductSubscriptionModule },
    { path: APP_CONSTANTS.LINK.PRODUCT_CATEGORY, loadChildren: () => ProductCategoryModule },
    { path: APP_CONSTANTS.LINK.REPORT, loadChildren: () => ReportModule },
    { path: APP_CONSTANTS.LINK.INVOICE, loadChildren: () => InvoiceModule },
    { path: APP_CONSTANTS.LINK.MEDIA, loadChildren: () => MediaModule },
    { path: APP_CONSTANTS.LINK.RESOURCES, loadChildren: () => ResourcesModule },
    { path: APP_CONSTANTS.LINK.PRODUCT_WIZARD, loadChildren: () => ProductWizardModule },
    { path: APP_CONSTANTS.LINK.CONSUMER_SUBSCRIPTION, loadChildren: () => ConsumerSubscriptionModule },
    { path: APP_CONSTANTS.LINK.ROOM_TYPE, loadChildren: () => RoomTypeModule },

    // otherwise redirect to home
    { path: APP_CONSTANTS.LINK.OTHERS, redirectTo: APP_CONSTANTS.LINK.PAGE404 }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
