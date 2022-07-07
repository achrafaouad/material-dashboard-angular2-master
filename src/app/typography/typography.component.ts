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
export class TypographyComponent implements OnInit { 
  users:any[];
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
    this.getusers();
  }

  getusers(){
    this.lrsServiceService.getUsers().subscribe(res=>{


      for(let i = 0;i<res.length;i++){
        res[i]['lastConnect'] = format(new Date(res[i]['lastConnect']), 'yyyy-MM-dd');
        res[i]['birthday'] = format(new Date(res[i]['birthday']), 'yyyy-MM-dd');
      }
      this.users = res;
      this.lrsServiceService.users = res;

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
  this.getusers();
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
  

}
