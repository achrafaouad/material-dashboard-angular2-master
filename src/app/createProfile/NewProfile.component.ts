import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LrsServiceService } from 'app/lrs-service.service';
import { ColDef } from 'ag-grid-community';
import VectorSource from 'ol/source/Vector';
import olVectorLayer from "ol/layer/Vector";
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { View } from 'ol';
import Map from "ol/Map";
import LayerTile from "ol/layer/Tile";
import OSM from 'ol/source/OSM';
import GeoJSON from "ol/format/GeoJSON";
import KML from "ol/format/KML";
import CircleStyle from 'ol/style/Circle';
import {FormBuilder, Validators} from '@angular/forms';
import { of } from 'rxjs';
import { NotificationService } from 'app/notification.service';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})

export class NewProfile implements OnInit {
  selected
  selectedTh
  selectedTh2
  selectedAttribute
  selectedTypeData
  selectedTypeData2
  format = new GeoJSON();
  formatKML = new KML();
  operateurs:string[] = [];
  selectRequettype = "1";
  thematique: string[];
  attributes: Object[] = [];
  requettes=[];
  val12: any;
  val11: any;
  th: any;
  donnee: any;
  description:string
  name:string

  requette = "select * from ";
  idth: Object[];
  currentthematiqueId: any;
  added: boolean = false;
  eventDataParams: Object[] = [];
  data: Object[];
  operation: string;
  currentthematiqueId2: any;
  verificationVal: boolean = true;
  headers: string[];
  prevEventName: any;
  dataTypes: string[] = [];
  myHeders: string[] = [];
  params: Object[];
  champs_event: string;
  headerNames: string[] = [];
  mediumLowAnnsrc: any;
  mediumLowAnn: any;
  verificationCard = false;
  this: any;
  mapPrevLine: Map;
  mediumLowPointsrc: any;
  mediumLowPoint: olVectorLayer<any>;
  th1: any;
  th2: any;
  object: Object;
  dataJson: any;
  list: number[];
  listPointJson: string[];
  listLineJson: string[];
  operateur:string;
  provincesTOsubmit: any[] = [];
  ihm:string[]=[];
  fonctionality = ["Impression des cartes","Requête spatial/attributaire","Analyse du synoptique","chargement des données"];

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  dota: any[];
  kmldata: any;
  jsonData: any;
  alrigth: boolean = true;
  mediumLowAnnsrcevent1: any;
  mediumLowAnnsrcevent2: any;
  mediumLowAnn1: olVectorLayer<any>;
  mediumLowAnn2: olVectorLayer<any>;
  provinces: string[];
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private lrsServiceService: LrsServiceService,private notifyService : NotificationService,private _formBuilder: FormBuilder,private _router: Router) {
    this.getProvinces()
   }

  ngOnInit(){}

  getProvinces(){
    this.lrsServiceService.getProvinces().subscribe(res=>{
      this.provinces = res 
    },err=>{
      console.log(err)
    })
  }

  changeName(eve){
    console.log(eve.target.value);
    this.name =eve.target.value 
  }
  changeDescription(eve){
    console.log(eve.target.value);
    this.description =eve.target.value 
  }


  checkedOrNot(province){
    console.log(this.provincesTOsubmit.length)
      for( var j = 0; j < this.provincesTOsubmit.length; j++){
        if ( this.provincesTOsubmit[j].name === province) { 
          console.log("hello mother fucker ",true)
          return true
        }
      }
     
  return false;
  }

  checkedOrNotFunc(province){
    console.log("achraf")
    console.log(this.ihm.length)
      for( var j = 0; j < this.ihm.length; j++){
        if ( this.ihm[j] === province) { 
          console.log("hello mother fucker ",true)
          return true
        }
      }
      console.log("hello mother fucker ",false)
  return false;
  }

  addedProvince(province ){
    console.log("hello world",province)
    if(!this.checkedOrNot(province)){
    this.lrsServiceService.getProvinceByName(province).subscribe(
      (res)=>{
        console.warn(res)
        this.provincesTOsubmit.push(res);
        console.log(this.provincesTOsubmit)
      }
      ,err=>{
        console.log(err);
    })}


    if(this.checkedOrNot(province)){
      for( var i = 0; i < this.provincesTOsubmit.length; i++){ 
    
        if ( this.provincesTOsubmit[i].name === province) { 
    
          this.provincesTOsubmit.splice(i, 1); 
        }
    
    }
    }

    console.log(this.provincesTOsubmit)
  }


  addedihm(province:string){
    console.log("hello world",province)
   
     
    if(!this.checkedOrNotFunc(province)){
  
      this.ihm.push(province);
      
    }
    else{
      for( var i = 0; i < this.ihm.length; i++){ 
    
        if ( this.ihm[i] === province) { 
           console.log("splice")
          this.ihm.splice(i, 1); 
        }
    
    }
    }
    
    

    console.log(this.ihm)
  }




  submit(){
    this.object ={
      name:this.name,
      description:this.description,
      ihm:this.ihm,
      provinces:this.provincesTOsubmit
    }
    console.log(this.object)
    this.lrsServiceService.addProfil(this.object).subscribe((res)=>{
      console.log(res)
      this._router.navigate(['profile'])
    },(err:HttpErrorResponse)=> console.log(err))
  }

}
