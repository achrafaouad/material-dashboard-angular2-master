import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import  DialogContentExampleDialog from '../../table-list/DialogContentExampleDialog';

import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { FlatfileAdapterModule } from '@flatfile/angular';
import { NgxCsvParser, NgxCsvParserModule } from 'ngx-csv-parser';
import { LrsServiceService } from 'app/lrs-service.service';
import { AgentProfilComponent } from 'app/agent-profil/agent-profil.component';
import { AgentsComponent } from 'app/agents/agents.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import { AgGridModule } from 'ag-grid-angular';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SynoptiqueComponent } from 'app/synoptique/synoptique.component';
import { NgApexchartsModule } from "ng-apexcharts";
import {MatIconModule} from '@angular/material/icon';
import {WebcamModule} from 'ngx-webcam';
import { ModalModule } from 'ng-modal-lib';
import { JwtClientService } from 'app/jwt-client.service';
import { AgentProfilEditComponent } from 'app/agent-profil-edit/agent-profil-edit.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NotificationService } from 'app/notification.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  imports: [  
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    FlatfileAdapterModule,
    NgxCsvParserModule,
    MatTooltipModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatCardModule,
    AgGridModule,
    MatSlideToggleModule,
    NgApexchartsModule,
    MatIconModule,
    WebcamModule,
    ModalModule,
    NgxSpinnerModule,
    DragDropModule,
    MatTableModule
  ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    AgentProfilComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    AgentsComponent,
    DialogContentExampleDialog,
    SynoptiqueComponent,
    AgentProfilEditComponent

  ],
  providers: [LrsServiceService,JwtClientService,NotificationService]
})

export class AdminLayoutModule {}
