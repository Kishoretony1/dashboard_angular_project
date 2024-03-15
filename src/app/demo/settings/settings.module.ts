import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { MaterialModule } from "src/app/common/material-module";
import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [


  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    // MatPaginatorModule,
    MatTableModule,

    MaterialModule,
    // MatInputModule,
    // MatIconModule,
    MatDialogModule,
    // MatButtonModule
  ]
})
export class SettingsModule { }
