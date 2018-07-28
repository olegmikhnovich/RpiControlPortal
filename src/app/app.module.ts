import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DeviceSettingsComponent } from './components/device-settings/device-settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthComponent } from './components/auth/auth.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { ConnectivityComponent } from './components/connectivity/connectivity.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { AboutComponent } from './components/about/about.component';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { AuthService } from './services/auth-service/auth.service';
import { ControlService } from './services/control/control.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'device-settings', component: DeviceSettingsComponent, canActivate: [AuthGuardService] },
  { path: 'file-explorer', component: FileExplorerComponent, canActivate: [AuthGuardService] },
  { path: 'connectivity', component: ConnectivityComponent, canActivate: [AuthGuardService] },
  { path: 'terminal', component: TerminalComponent, canActivate: [AuthGuardService] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuardService] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DeviceSettingsComponent,
    NotFoundComponent,
    AuthComponent,
    FileExplorerComponent,
    ConnectivityComponent,
    TerminalComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    MatInputModule,
    MatSliderModule,
    MatSnackBarModule,
    MatListModule,
    MatMenuModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuardService,
    AuthService,
    ControlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
