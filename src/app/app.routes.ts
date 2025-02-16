import { Routes } from '@angular/router';
import { LoginComponent } from './Page/login/login.component';
import { AdminComponent } from './Page/Dashboard/admin/admin.component';
import { HomeComponent } from './Page/Dashboard/home/home.component';
import { DashboardComponent } from './Page/Dashboard/dashboard/dashboard.component';
import { CategoryComponent } from './Page/MasterFile/category/category.component';
import { authGuard } from './Guards/auth.guard';
import { SubCategoryComponent } from './Page/MasterFile/sub-category/sub-category.component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    // {path:'', component:LoginComponent},
    {path:'', component:LoginComponent},
    {path:'admin', component:AdminComponent,
     canActivate: [authGuard],
     children:[
            {path:'dashboard', component:DashboardComponent},
            {path:'category', component:CategoryComponent},
            {path:'subCategory', component:SubCategoryComponent}
        ]
    }
];
