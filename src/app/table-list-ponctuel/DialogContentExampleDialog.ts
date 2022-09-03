import { Component, OnInit, ViewChild } from '@angular/core';
import { LrsServiceService } from 'app/lrs-service.service';


@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-content-example-dialog.html',
  })
  export default class DialogContentExampleDialog {
     
      constructor(private lrsServiceService:LrsServiceService){
     

      }
      csvRecords = this.lrsServiceService.getTableToView()
      headerTable = Object.keys(this.csvRecords[0])
     
  }