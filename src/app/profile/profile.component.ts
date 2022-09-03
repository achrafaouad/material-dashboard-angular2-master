import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LrsServiceService } from 'app/lrs-service.service';
import { compareAsc, format } from 'date-fns'
@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class ProfileComponent implements OnInit { 
  profiles:any[];
  province: any;
  provinces: string[];
  provinceTosave: any;
  role: any;
  object: any;
  constructor(private lrsServiceService:LrsServiceService,private router: Router,private route: ActivatedRoute) { 
    this.getProvinces();
  }

  ngOnInit() {
    // this.users = this.lrsServiceService.getAllUsers();
    this.getprofiles();
  }

  getprofiles(){
    this.lrsServiceService.getprofiles().subscribe(res=>{


      for(let i = 0;i<res.length;i++){
        if(res[i]['dateAjout'])
        res[i]['dateAjout'] = format(new Date(res[i]['dateAjout']), 'yyyy-MM-dd');
      }
      this.profiles = res;
      this.lrsServiceService.profiles = this.profiles;

       console.log(res)
    
    },err=> console.log(err))
  }


  navigateToAccount(val){ 
    console.log(val)
    this.router.navigate([val], {relativeTo:this.route});
  }

  onSubmitEdit(ff:NgForm){
    console.log(ff.value);
    this.object = ff.value;
    this.object['id'] = null;
    this.object['image'] = null
    this.object['lastConnect'] = null
    if(this.role == 'simple_user') 
    this.object['roles'] = [{id: 1, name: 'simple_user'}]
    else this.object['roles'] = [{id: 2, name: 'Role_Admin'}]
    this.object['province'] = this.provinceTosave

this.lrsServiceService.saveUser(this.object).subscribe(res=>{
  this.getprofiles();
},err=>console.log(err))
  }

  onchangeR(value){
    this.role = value;
    
  }
  onchangeP(value){
    // console.log(value) 
    this.province  = value.toString();

    console.log(this.province);
    


      this.lrsServiceService.getProvinceByName(this.province).subscribe(
        (res)=>{
          console.warn(res)
          this.provinceTosave = res;
          // console.log(res);
        }
        ,err=>{
          console.log(err);
      })
  }


  getProvinces(){
    this.lrsServiceService.getProvinces().subscribe(res=>{
      this.provinces = res 
    },err=>{
      console.log(err)
    })
  }


  addprofile(){
    this.router.navigate(['/addprofile'])
  }
  

}
