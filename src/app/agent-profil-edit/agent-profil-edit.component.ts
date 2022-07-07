import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LrsServiceService } from 'app/lrs-service.service';
import LayerTile from "ol/layer/Tile";
import { View } from 'ol';
import Map from "ol/Map";
import OSM from 'ol/source/OSM';
import FullScreen from 'ol/control/FullScreen';
import ScaleLine from 'ol/control/ScaleLine';
import Zoom from 'ol/control/Zoom';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-agent-profil-edit',
  templateUrl: './agent-profil-edit.component.html',
  styleUrls: ['./agent-profil-edit.component.css']
})

export class AgentProfilEditComponent implements OnInit {
  id:Number;
  mapPrevLine: Map;
  user: any;
  provinces: string[];
  isChecked = true;
  object: any;
  province:string;
  provincesSelect: any;
  provinceSelect: string;
  selectedProvince: any;
  constructor( private lrsServiceService :LrsServiceService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.getProvinces();
    this.route.params.subscribe((params:Params)=>{  
      this.id= +params['id'];
      console.log(this.id);
      this.user = this.lrsServiceService.getUserByid(this.id);
      // this.agent = this.lrsServiceService.getuserById(this.id);
      this.province = this.user.province.name;
    }
    ) 

  }


  onSubmit(ff:NgForm){
    console.log(ff.value)
    this.object = ff.value;
    this.object['id'] = this.user.id
    this.object['image'] = this.user.image
    this.object['password'] = this.user.password
    this.object['lastConnect'] = this.user.lastConnect
    this.object['lastConnect'] = this.user.lastConnect
    this.object['roles'] = this.user.roles
    this.object['username'] = this.user.username
    this.object['provinces'] = this.user.provinces


    this.lrsServiceService.updateUser(this.object).subscribe(res=>{this.user = res},err=>console.log(err))
  }


  getProvinces(){
    this.lrsServiceService.getProvinces().subscribe(res=>{
      this.provinces = res 
    },err=>{
      console.log(err)
    })
  }


  // onchangeP(value){
  //   // console.log(value) 
  //   this.province  = value.toString();

  //   console.log(this.province);
    


  //     this.lrsServiceService.getProvinceByName(this.province).subscribe(
  //       (res)=>{
  //         console.warn(res)
  //         this.user.province = res;
  //       }
  //       ,err=>{
  //         console.log(err);
  //     })
  // }



  checkedOrNot(province){
    console.log(this.user.provinces.length)
      for( var j = 0; j < this.user.provinces.length; j++){
        if ( this.user.provinces[j].name === province) { 
          console.log("hello mother fucker ",true)
          return true
        }
      }
     
  return false;
  }


  addedProvince(province){
    console.log("hello world",province)
    if(!this.checkedOrNot(province)){
    this.lrsServiceService.getProvinceByName(province).subscribe(
      (res)=>{
        console.warn(res)
        this.user.provinces.push(res);
        console.log(this.user.provinces)
      }
      ,err=>{
        console.log(err);
    })}


    if(this.checkedOrNot(province)){
      for( var i = 0; i < this.user.provinces.length; i++){ 
    
        if ( this.user.provinces[i].name === province) { 
    
          this.user.provinces.splice(i, 1); 
        }
    
    }
    }

    
  }



}
