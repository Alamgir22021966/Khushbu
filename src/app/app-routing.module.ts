import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import { BlankComponent } from '@pages/blank/blank.component';
import { LoginComponent } from '@modules/login/login.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { RegisterComponent } from '@modules/register/register.component';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { PrivacyPolicyComponent } from '@modules/privacy-policy/privacy-policy.component';
import { MainMenuComponent } from '@pages/main-menu/main-menu.component';
import { SubMenuComponent } from '@pages/main-menu/sub-menu/sub-menu.component';
import { ModalComponent } from '@pages/modal/modal.component';

const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full',
    },
    {
        path: 'login', component: LoginComponent, canActivate: [NonAuthGuard],
    },

    {
        path: 'home', component: MainComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: async () => (await import('./pages/Dashboard/dashboard.module')).DashboardModule, pathMatch: 'prefix',
            },
            {
                path: 'adminpanel',
                loadChildren: async () => (await import('./Views/adminpanel/adminpanel.module')).AdminpanelModule, pathMatch: 'prefix',
            },
            {
                path: 'humanresource',
                loadChildren: async () => (await import('./Views/humanresource/humanresource.module')).HumanresourceModule, pathMatch: 'prefix',
            },
            {
                path: 'purchaseinformation',
                loadChildren: async () => (await import('./Views/PurchaseInformation/purchaseinformation.Module')).PurchaseinformationModule, pathMatch: 'prefix',
            },
            {
                path: 'SalesInformation',
                loadChildren: async () => (await import('./Views/SalesInformation/sales-information.Module')).SalesInformationModule, pathMatch: 'prefix',
            },
            {
                path: 'PurchaseReports',
                loadChildren: async () => (await import('./Reports/PurchaseReports/purchase.Module')).PurchaseModule, pathMatch: 'prefix',
            },
            {
                path: 'SalesReports',
                loadChildren: async () => (await import('./Reports/SalesReports/sales.Module')).SalesModule, pathMatch: 'prefix',
            },
            {
                path: 'GoogleMaps',
                loadChildren: async () => (await import('./Views/GoogleMap/google-map.Module')).GoogleMapModule, pathMatch: 'prefix',
            },
            {
                path: 'PaymentGateways',
                loadChildren: async () => (await import('./Views/PaymentGateway/payment-gateway.Module')).PaymentGatewayModule, pathMatch: 'prefix',
            },
            {
                path: 'DataVisualization',
                loadChildren: async () => (await import('./DataVisualization/datavisualization.Module')).DatavisualizationModule, pathMatch: 'prefix',
            },
            {
                path: 'profile', component: ProfileComponent,
                data: { title: 'Profile Component' }
            },
            {
                path: 'blank', component: BlankComponent,
                data: { title: 'Blank Component' }
            },
            {
                path: 'modal', component: ModalComponent,
                data: { title: 'Modal Component' }
            },
            {
                path: 'sub-menu-1', component: SubMenuComponent,
                data: { title: 'Sub Menu Component Title' }
            },
            {
                path: 'sub-menu-2', component: BlankComponent,
                data: { title: 'Blank Component' }
            },

        ]
    },
    // {
    //     path: 'login', component: LoginComponent, canActivate: [NonAuthGuard]
    // },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        canActivate: [NonAuthGuard]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
    MainComponent,
    BlankComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
    PrivacyPolicyComponent,
    MainMenuComponent,
    SubMenuComponent,
];