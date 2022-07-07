import { Component, OnInit } from '@angular/core';
import { LrsServiceService } from 'app/lrs-service.service';
import { NotificationService } from 'app/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
user;
  constructor(private lrsServiceService :LrsServiceService,private notifyService : NotificationService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user)
  }

  updateInfo(){
    this.lrsServiceService.updateUser(this.user).subscribe(res=>{this.user = res
      this.spinner.show(); 
       

setTimeout(() => {
  /** spinner ends after 5 seconds */
  this.spinner.hide();
}, 5000);
      this.showToasterSuccess('Opération bien effectué', 'informations a été ajoutée');

    },err=>this.showToasterWarning('something goes wrong', 'check that you did that properly')
    )
  }

  hola(dd,ddv){
    this.user[dd] = ddv
    console.log(this.user)
  }




  
showToasterSuccess(titre,message){
  this.notifyService.showSuccess(titre, message)
}

showToasterError(titre,message){
  this.notifyService.showError(titre, message)
}

showToasterInfo(titre,message){
  this.notifyService.showInfo(titre, message)
}

showToasterWarning(titre,message){
  this.notifyService.showWarning(titre, message)
}

}
