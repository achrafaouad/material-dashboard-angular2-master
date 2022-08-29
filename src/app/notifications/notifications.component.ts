import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { LrsServiceService } from 'app/lrs-service.service';
import VectorSource from 'ol/source/Vector';
import olVectorLayer from "ol/layer/Vector";
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

import LayerTile from "ol/layer/Tile";
 
import Text from "ol/style/Text";
import Map from "ol/Map";
import View from "ol/View";
import OSM from 'ol/source/OSM';
import GeoJSON from "ol/format/GeoJSON";
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { ColorLike } from 'ol/colorlike';
import XYZ from 'ol/source/XYZ';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'app/notification.service';

declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  isLinear = false;
  dataLinePrev: String[] = [];
  colorPoint1
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectedTypeData = "ponctuel";
  selectedTypeData2 = "ponctuel";
  selectedTh
  selectedTh2
  operateurs = []
  operateur
  haloRadius
  labelColor
  sorttype
  haloColor
  grille = false
  numberOfLines:number
  thematique: string[];
  title:string = "achraf";
  title_bold: string;
  title_color:string="#c4ffe9";
  title_bgcolor: string = "#c4ffe9";
  gras: string = "false";
  fillOpacity
  pointRadius
  boldTitle:string= "bold";
  provinces: string[];
  province:string;
  fond:string;
  verificationCard = false;
  province_color:string = "red";
  strokeWidthP:number = 4;
  format = new GeoJSON();
  trait: string;
  lenged_color: string;




  traits: Object[] = [{name:'dash', value:"_ _ _ _"},{name:'dot', value:"........."},{name:'longdash', value:"______"}];
  trnasparence: Object[] = [{name:'Opaque', value:"Opaque"},{name:'Transparent', value:"transparent"}];
  coisillants: Object[] = [{name:'+ + + ', value:"POINTS"},{name:'--|--', value:"LINES"}];
  norths: Object[] = [{name:'north1.png', value:"../assets/img/north1.png"},{name:'north2.png', value:"../assets/img/north2.png"},{name:'north3.png', value:"../assets/img/north3.png"}];
  colonnes: Object[] = [{name:'éttiquette', value:1},{name:'Route', value:2},{name:"PK_début", value:3},{name:"PK_fin", value:4},{name:"pk_event", value:5},{name:"évenement", value:6},{name:"voie", value:7}];
 

  mesFonds :Object[] =
  [
    {name:"Google",value:"http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"},
    {name:"openstreetmap",value:"https://b.tile.openstreetmap.de/{z}/{x}/{y}.png"},
    {name:"thunderforest",value:"https://tile.thunderforest.com/transport/{z}/{x}/{y}.png"},
    {name:"stamen-tiles",value:"https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"},
    {name:"watercolor",value:"http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"},

]
  mediumLowAnnsrc: any;
  mediumLowAnn: olVectorLayer<any>;
  mapPrevLine: Map;
  dow: boolean = true;
  typeDashOl: number[] = [4,8];
  base: any;
  colonne

// ----polygin
  fillColorPol
  strock_colorPpl
  strokeWidthPol
  strokeLinecapPol
  strokeDashstylePol
  event1: any = "ponctuel";
  event2: any = "ponctuel";

  //params Event1
  //point
  colorPointEvent1
  fillOpacityPointEvent1
  pointRadiusPointEvent1
  //polygon
  fillColorPol1
  strock_colorPpl1
  strokeWidthPol1
  strokeLinecapPol1
  strokeDashstylePol1

  //
  //params Event2
  //point
  colorPointEvent2
  fillOpacityPointEvent2
  pointRadiusPointEvent2
  //polygon
  fillColorPol2
  strock_colorPpl2
  strokeWidthPol2
  strokeLinecapPol2
  strokeDashstylePol2

  //

  sendData = 
  {
      "layout": "A4 portrait",
      "attributes": {
          "title_bold":"true",
          "north":"north1.png",
           "title_color":"#141414",
           "title_bgcolor":"#ffe202",
          "firstLegendClass":"firstLegendClass",
          "secondLegendClass":"secondLegendClass",
          "lastLegendClass":"lastLegendClass",
          "project_compelte_color":"#ffffff",
          "project_medium_compelte_color":"#ea0808",
          "project_low_compelte_color":"#ea0808",
          "legend_opaque":"Opaque",
          "legend_background_color":"#ea0808",
        "description":"This is a list of online raster tile servers based on OpenStreetMap data. For the names of the physical servers",
         "title":"thematique carte" ,
        "map": {
           "bbox":[-770045.375191416, 4014796.19947468 ,-752682.673837305  ,4033884.88487833],
           "projection": "EPSG:3857",
          "rotation": 0,
          "longitudeFirst": true,
          "layers": [
      //         {
      //       "type": "grid",
      //       "gridType": "points",
      //       "numberOfLines": [5, 5],
      //       "renderAsSvg": true,
      //       "haloColor": "#CCFFCC",
      //       "labelColor": "black",
      //       "indent": 10,
      //       "haloRadius": 4,
      //       "font": {
      //         "name": [
      //           "Liberation Sans",
      //           "Helvetica",
      //           "Nimbus Sans L",
      //           "Liberation Sans",
      //           "FreeSans",
      //           "Sans-serif"
      //         ],
      //         "size": 8,
      //         "style": "BOLD"
      //       }
      //     },
      //         {
      //         "geojson":{
      //             "type": "FeatureCollection",
      //             "features": [
      //               {
      //                   "name":"achraf",
      //                 "type": "Feature",
      //                 "properties": { "_type": "join-miter", "_name":"achraf"},
      //                     "geometry": { "type": "Polygon", "coordinates": [ [ [-765153.762391686, 4027013.1754905], [-764893.398764089, 4027407.30391759], [-764960.281163839, 4027789.48905902], [-764996.111020848, 4028045.07537234], [-764988.945049446, 4028135.84434343], [-765000.95617843, 4028136.801394], [-765008.1220553, 4028046.03240782], [-765008.042024402, 4028043.38724307], [-764972.211906601, 4027787.80100469], [-764972.147641385, 4027787.39309645], [-764906.098054977, 4027409.9692712], [-765163.800614936, 4027019.86822355], [-765153.762391686, 4027013.1754905] ] ] }
      //                   }
      //             ]
      //           },
      //           "style":{
      //               "version": "2",
      //         "[_type = 'join-miter']": {
      //           "symbolizers": [
      //             {
      //    "type": "polygon",
      //    "fillColor": "#050101",
      //    "fillOpacity": 0,
      //    "strokeColor": "#ff0000",
      //    "strokeOpacity": 1,
      //    "strokeWidth": 5,
      //    "strokeLinecap": "square",
      //    "strokeDashstyle": "longdashdot"
      //  },{
      //    "type": "text",
      //    "fontColor": "#000000",
      //    "label": "[_name]",
      //    "goodnessOfFit": 0.1,
      //    "spaceAround": 10
      //  }
      //           ]
      //         }
      //           },
      //           "type": "geojson"
      //      },
      //     { 
      //     "baseURL": "http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
      //     "imageExtension": "png",  
      //     "type": "OSM"               
      //     }
          ],
          "scale": 100000000,
          "dpi": 200
      },
      "table": {
        "columns": ["id", "étiquette", "Route","PK_début","PK_fin","PK_Event","évenement","voie"],
        "data": [
       
        ]
      },
      "datasource": [
       
        
      ]
     
          
          
      }
  }
data1: Object [] = [];
  data2: Object [] = [];
  transparenceLegendre: any;
  gridType: any;
  bbox: number[];
  provinceSelect: string;
  thematique1: any;
  thematique2: any;
  provincesSelect: any;
  length: number;
  description: string = "lorem";
  north: any;
  id: number = 0;
  dataTable: Array<Object> = [];
  dataPoint1: any;
  dataLine1: any;
  dataPoint2: any;
  dataLine2: any;
  table: boolean = false;
  sorter: boolean = false;
  verificationVal: boolean;
  filtre: boolean = false;
  object: { thematique1: any; thematique2: any; pkEvent: any; };
  currentthematiqueId: any;
  currentthematiqueId2: any;
  events: any;
  val11: any;
  rapport: string;
  requette: string;
  inter: any;
  cordInter: any[][];
  rt_geom: any;
  cord0: any[][];
  cord1: any[][];
  rt_geom1: any;
  th1: any;
  th2: any;
  line: any;
  point: any;
  firstEvent: boolean = false;
  secondEvent: boolean = false;
  secondEventActivatedStatus: any = "désactivé";
  firstEventActivatedStatus: any = "désactivé";
  firstEventActivatedStatusColor: any = "red"
  secondEventActivatedStatusColor: any="red"
  attributes: Object[] = [];
  valueTO: any;
  thmValuesOf: any;
  object144;
  selectedAttribute: any;
  valueTOs: string[];
  object123: {};
  selectedTypeData144: any;
  selectedTh144: any;
  themtiqueTree :Boolean;
  val1: any;
  operateur1: any;
  selectedAttribute1: any;
  operateur2: any;
  selectedAttribute2: any;
  val2: any;
  val3: any;
  operateur3: any;
  selectedAttribute3: any;
  singlethematique : Object[]= [];
  datas: Object[]= [];
  incriment = 0;
  selected: any;
  verify: boolean = false;
  constructor(private _formBuilder: FormBuilder,private lrsServiceService: LrsServiceService,private notifyService : NotificationService) { 
    this.getProvinces();
    this.getThematiques();
    this.getAllEvents();
  }
  Animal = new Style({
    stroke: new Stroke({
      color:<ColorLike> this.province_color,
  
      width: this.strokeWidthP,
  
       lineDash: this.typeDashOl
    }),

  })

      
  ngOnInit() {
    // console.error(this.sendData['layout']);
    this.mediumLowAnnsrc = new VectorSource();

    this.mediumLowAnn = new olVectorLayer({
  
      source: this.mediumLowAnnsrc,

      style: this.Animal ,
    });



    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });


    this.mediumLowAnnsrc.on('addfeature', () =>{
      this.mapPrevLine.getView().fit(
          this.mediumLowAnnsrc.getExtent(),
          { duration: 200, size: this.mapPrevLine.getSize(), maxZoom: 24 }
      );
  });
  }

  title_bgcolorF(val){
  
    this.title_bgcolor = val.target.value
  }
  title_colorF(val){

    this.title_color = val.target.value
  }
  strokeWidthF(val){
    // console.log(val.target.value)
    this.strokeWidthP = val.target.value
    this.Animal.getStroke().setMiterLimit(this.strokeWidthP)
  }
  titleF(val){
    // console.log(val.target.value)/
    this.title = val.target.value
  }
  provinceColor(val){
    // console.log(val.target.value)
    this.province_color = val.target.value

    this.Animal.getStroke().setColor( <ColorLike> this.province_color)
  }
  changedGras(){
    this.gras = this.gras == 'true'? 'false':"true";
    this.boldTitle = this.gras == 'true'? 'bold':"normal";

    // console.log(this.gras);
  }
  changedGrille(){
    this.grille = this.grille == true? false:true;
    

    // console.log(this.grille);
  }
  firstEventActivated(){
   
    this.firstEvent = this.firstEvent == false? true:false;
    this.firstEventActivatedStatus = this.firstEvent == true ?"activé":"désactivé"
    this.firstEventActivatedStatusColor = this.firstEvent == true?"green":"red"
    console.log(this.firstEvent);
    console.log(this.firstEventActivatedStatus);
    console.log(this.firstEventActivatedStatusColor);
  }
  secondEventActivated(){
    this.secondEvent = this.secondEvent == false? true:false;
    this.secondEventActivatedStatus = this.secondEvent == true?"activé":"désactivé"
    this.secondEventActivatedStatusColor = this.secondEvent == true?"red":"green"
    console.log(this.secondEvent);
    console.log(this.secondEventActivatedStatus);
    console.log(this.firstEventActivatedStatusColor);
  }

  AfficherTable(){
    this.table = this.table == true? false:true;
    

    // console.log(this.table);
  }
  SorterTable(){
    this.sorter = this.sorter == true? false:true;
    // console.log(this.sorter);
  }

  onchangeP(value){
    // console.log(value)
    this.provincesSelect  = value;
    this.lrsServiceService.getBBox(value).subscribe(
      res=>{
       this.bbox = res
      //  console.log(this.bbox)
      },err=>{console.log(err)})


      this.lrsServiceService.getProvinceJson(this.province).subscribe(
        (res)=>{
          console.warn("hello", typeof res)
          this.provinceSelect  = <string> res;
          // console.log(res);
        }
        ,err=>{
          console.log(err);
      })
  }

  onchangeFond(value){
    this.verify = true;
    this.base = value
    if(this.mapPrevLine){
    this.mapPrevLine.getLayers().getArray()[0] = new LayerTile({
      visible: true,
        source: new OSM({
          url: value
        }),
      })
    }
  }


  getProvinces(){
    this.lrsServiceService.getProvinces().subscribe(res=>{
      this.provinces = res 
    },err=>{
      console.log(err)
    })
  }

  onchangeTrait(vv){
    // console.log(vv)
    this.trait = vv;
    if(vv == "dash")
    this.typeDashOl = [4, 8]
    else if(vv == "trait"){
      this.typeDashOl = null
    }
    else this.typeDashOl = [2, 4]


    this.Animal.getStroke().setLineDash(this.typeDashOl)
  }



  previewLineData(){
  
     this.mediumLowAnnsrc.clear();
      
      if(!this.verificationCard){
       
        setTimeout(()=>{
          this.mapPrevLine = new Map({
            target: "mapPrev",
            layers: [  ],
            controls: [
            
            ],
            view: new View({
              center: [-638567.839310722, 4275965.65926095],
              zoom: 5,
              projection: "EPSG:3857",
            }),
          });

          if(this.verify){
            this.mapPrevLine.addLayer(new LayerTile({
              visible: true,
                source: new OSM({
                  url: this.base
                }),
              } ))
          }
          else{
            this.mapPrevLine.addLayer(new LayerTile({
         
            } ))
          }
          

          
          this.mapPrevLine.addLayer(this.mediumLowAnn);
        },500)
        this.verificationCard =true;
      }
      
 setTimeout(()=>{
  this.dataLinePrev = [];
    this.lrsServiceService.getProvinceJson(this.province).subscribe((res)=>{
      console.warn(res)
 
        this.dataLinePrev.push(res);

      

      // console.error(this.dataLinePrev)

      this.dataLinePrev.forEach((item:any) => {
        
        console.warn(item);
       this.mediumLowAnnsrc.addFeatures(
         this.format.readFeatures(item)
       );

      
    
     }) 

    



    })
  





 },1200)

  }



  getThematiques(){
    this.lrsServiceService.getAllEventType().subscribe(res=>{
      this.thematique = res;
   console.log("thhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
   console.log(this.thematique)
    }, (err:HttpErrorResponse)=>{
      console.log(err
      )
    })
  }


  onchangeDonne1(val){ 
    // console.log(val)
    if(val == "lineaire") this.attributes = [{champs_event:"pkd", champ_db_stock:"pkd"}, {champs_event:"pkf", champ_db_stock:"pkf"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"voie", champ_db_stock:"voie"}];
    if(val == "ponctuel") this.attributes = [{champs_event:"pkEvent", champ_db_stock:"pkEvent"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"VOIE", champ_db_stock:"VOIE"}];


  this.event1 = val;


  if(this.selectedTypeData == this.selectedTypeData2){
    if(this.selectedTypeData == "ponctuel"){
      this.operateurs = [ "ont la meme PK" ] 
    }

    if(this.selectedTypeData == "lineaire"){
      this.operateurs = [ "intersect" ] 
    }


  }

  if(this.selectedTypeData != this.selectedTypeData2){

      this.operateurs = [ "Existe Entre" ] 
    
  }


  }

  verifyEvent1(){
    if(this.event1 == "ponctuel")
    return true
    else return false
  }
  verifyEvent2(){
    if(this.event2 == "ponctuel")
    return false
    else return true;
  }
 
  onchangeDonne2(val){
    if(val == "lineaire") this.attributes = [{champs_event:"pkd", champ_db_stock:"pkd"}, {champs_event:"pkf", champ_db_stock:"pkf"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"voie", champ_db_stock:"voie"}];
    if(val == "ponctuel") this.attributes = [{champs_event:"pkEvent", champ_db_stock:"pkEvent"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"VOIE", champ_db_stock:"VOIE"}];
     console.log(val)
     this.event2 = val



     if(this.selectedTypeData == this.selectedTypeData2){
      if(this.selectedTypeData == "ponctuel"){
        this.operateurs = [ "ont la meme PK" ] 
      }

      if(this.selectedTypeData == "lineaire"){
        this.operateurs = [ "intersect" ] 
      }


    }

    if(this.selectedTypeData != this.selectedTypeData2){

        this.operateurs = [ "Existe Entre" ] 
      
    }

    }

  onchange22(val){ 

   

    if(this.firstEvent==false && this.secondEvent ==true ){
      this.getParamsToAttribute(this.selectedTh)
      if(this.selectedTypeData2 == "lineaire") this.attributes = [{champs_event:"pkd", champ_db_stock:"pkd"}, {champs_event:"pkf", champ_db_stock:"pkf"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"voie", champ_db_stock:"voie"}];
      if(this.selectedTypeData2 == "ponctuel") this.attributes = [{champs_event:"pkEvent", champ_db_stock:"pkEvent"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"VOIE", champ_db_stock:"VOIE"}];
  
    }
    this.thematique2 = this.selectedTh2;

    // console.error(this.selectedTypeData2)

    if(this.selectedTypeData2 == "ponctuel" ){

      this.lrsServiceService.getDtatapoint(this.selectedTh2).subscribe(res=>{
        this.dataPoint2  = res;
        // console.log(res.length)
        
      },err=>{console.log(err)})


      this.lrsServiceService.getPointEventJson(this.selectedTh2).subscribe(res=>{
        for(var i of res){
          // console.log(i)
          this.data2.push(JSON.parse(i))
        }
      }, (err:HttpErrorResponse)=>{
        console.log(err)
      })
    }

    if(this.selectedTypeData2 == "lineaire" ){

      this.lrsServiceService.getDtataLine(this.selectedTh2).subscribe(res=>{
        this.dataLine2  = res;
         
         
        
      },err=>{console.log(err)})


      this.lrsServiceService.getLineEventJson(this.selectedTh2).subscribe(res=>{
        console.log(res)
        for(var i of res){
          this.data2.push(JSON.parse(i))
        }
      }, (err:HttpErrorResponse)=>{
        console.log(err)
      })
    }

    if(this.selectedTypeData == this.selectedTypeData2){
      if(this.selectedTypeData == "ponctuel"){
        this.operateurs = [ "ont la meme PK" ] 
      }

      if(this.selectedTypeData == "lineaire"){
        this.operateurs = [ "intersect" ] 
      }


    }

    if(this.selectedTypeData != this.selectedTypeData2){

        this.operateurs = [ "Existe Entre" ] 
      
    }

  }
  onchange11(val){

    this.thematique1 = this.selectedTh;
      console.log(this.selectedTypeData)
      this.data1= []

    if(this.firstEvent==true && this.secondEvent ==false){
      this.attributes = []
      if(this.selectedTypeData == "lineaire") this.attributes = [{champs_event:"pkd", champ_db_stock:"pkd"}, {champs_event:"pkf", champ_db_stock:"pkf"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"voie", champ_db_stock:"voie"}];
      if(this.selectedTypeData == "ponctuel") this.attributes = [{champs_event:"pkEvent", champ_db_stock:"pkEvent"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"VOIE", champ_db_stock:"VOIE"}];
  
      this.getParamsToAttribute(this.selectedTh)

      
    }
     

     console.log("asdfg")
    
    if(this.selectedTypeData == "ponctuel"){
      this.lrsServiceService.getDtatapoint(this.selectedTh).subscribe(res=>{
        this.dataPoint1  = res;
       console.log(this.dataPoint1);
        //todo
      },err=>{console.log(err)})

      this.lrsServiceService.getPointEventJson(this.selectedTh).subscribe(res=>{
        
        for(var i of res){
          this.data1.push(JSON.parse(i))
        }
        console.log(this.data1)
       
      }, (err:HttpErrorResponse)=>{
        console.log(err)
      })
    }

    if(this.selectedTypeData == "lineaire" ){

      this.lrsServiceService.getDtataLine(this.selectedTh).subscribe(res=>{
        this.dataLine1  = res;
        
         console.error(res)
        
      },err=>{console.log(err)})


      this.lrsServiceService.getLineEventJson(this.selectedTh).subscribe(res=>{
        console.log(res)
        for(var i of res){
          this.data1.push(JSON.parse(i))
          console.log("hahia kat3mer")
        }
      }, (err:HttpErrorResponse)=>{
        console.log(err)
      })
    }



    if(this.selectedTypeData == this.selectedTypeData2){
      if(this.selectedTypeData == "ponctuel"){
        this.operateurs = [ "ont la meme PK" ] 
      }

      if(this.selectedTypeData == "lineaire"){
        this.operateurs = [ "intersect" ] 
      }


    }

    if(this.selectedTypeData != this.selectedTypeData2){

        this.operateurs = [ "Existe Entre" ] 
      
    }

  
  
  }



LegendreTransparence(val){
  console.log(val)
    this.transparenceLegendre = val;
    if(val = "transparent"){
      this.lenged_color = 'white'
    }

}

lenged_colorF(event){

  this.lenged_color = event.target.value;

}

//todo
NorthF(event){
  console.log(event)
  this.north = event.value;
} 
//nbrof lines

typeOfCroi(val){
  this.gridType = val;
}
haloRadiusF(val){
  console.log(val)
  this.haloRadius = val.target.value;
}


labelColorF(event){
  this.labelColor = event.target.value;
}
haloColorrF(event){
  this.haloColor = event.target.value;
}





async prepareAndPrint() {

  this.dataTable = [];
  
  this.length = 0;
  console.log("printed")
  console.log(this.data1)


  this.sendData['attributes'].title =  this.title;
  this.sendData['attributes'].north =  this.north;
  this.sendData['attributes'].description =  this.description;
  this.sendData['attributes'].title_color =  this.title_color;
  this.sendData['attributes'].title_bgcolor =  this.title_bgcolor;
  this.sendData['attributes'].title_bold =  this.gras;
  this.sendData['attributes'].firstLegendClass =  this.thematique1;
  this.sendData['attributes'].secondLegendClass =  this.thematique2;
  this.sendData['attributes'].lastLegendClass =  this.provincesSelect;
  this.sendData['attributes'].project_low_compelte_color =  this.province_color;

  var second  = this.selectedTypeData2 == "ponctuel" ? this.colorPointEvent2: this.strock_colorPpl2;

  this.sendData['attributes'].project_medium_compelte_color =  second;
  var second1  = this.selectedTypeData == "ponctuel" ? this.colorPointEvent1: this.strock_colorPpl1;

  this.sendData['attributes'].project_compelte_color =  second1;

  // province
  this.sendData['attributes'].map.bbox = this.bbox;
  this.sendData['attributes'].map.layers = [];
  if(this.grille){
    this.sendData['attributes'].map.layers.push(
      {
        type: "grid",
        gridType: this.gridType,
        numberOfLines: [this.numberOfLines, this.numberOfLines],
        renderAsSvg: true,
        haloColor: this.haloColor,
        labelColor: this.labelColor,
        indent: 10,
        haloRadius: this.haloRadius,
        font: {
          name: [
            "Liberation Sans",
            "Helvetica",
            "Nimbus Sans L",
            "Liberation Sans",
            "FreeSans",
            "Sans-serif"
          ],
          size: 8,
          style: "BOLD"
        }
      }
    );
  }else{

    this.sendData['attributes'].map.layers.push(
    {
      "type": "grid",
      "gridType": "POINTS",
      "numberOfLines": [0, 0],
      "renderAsSvg": true,
      "haloColor": "#CCFFCC",
      "labelColor": "black",
      "indent": 10,
      "haloRadius": 4,
      "font": {
        "name": [
          "Liberation Sans",
          "Helvetica",
          "Nimbus Sans L",
          "Liberation Sans",
          "FreeSans",
          "Sans-serif"
        ],
        "size": 8,
        "style": "BOLD"
      }
    })

  }

  
  this.sendData['attributes'].map.layers.push(

               {
              "geojson":{
                  type: "FeatureCollection",
                  "features": []
                },
                "style":{
                  "version":"2"
                  
                },
                "type": "geojson"
              }

  )


 if(this.filtre){

          if(this.firstEvent==true && this.secondEvent ==false || this.firstEvent==false && this.secondEvent ==true ){
            if(this.firstEvent==true && this.secondEvent ==false){
              if(this.selectedTypeData == "ponctuel"){
                if(this.themtiqueTree){
                   console.log('achraf aouad');
                   console.log('achraf aouad');
                   console.log('achraf aouad');
                   this.sendData.attributes.table.columns= ["id","évenement","PK_event","Route_id","Route","voie"];
                   
                   for(let i= 0;i<this.datas.length;i++){
                   for(let j= 0;j<this.datas[i]['data'].length;j++){
                   this.sendData['attributes'].map.layers[1].geojson.features.push(
                      {
                      "name":"achraf",
                      "type": "Feature",
                      "properties": { "_type":`${this.datas[i]["id"]}` , "_name":`${this.datas[i]["data"][j]['id']}`},
                      "geometry": this.datas[i]["data"][j]["ROUTE_GEOMETRY"]
                        }
            
                    );
                    
                    
// -------------------------
          this.dataTable.push([this.datas[i]["data"][j]['id'],this.datas[i]["data"][j]['event_name'],((this.datas[i]["data"][j]['pkEvent'])/1000).toFixed(3).toString(),this.datas[i]["data"][j]['route_id'].toString(),this.datas[i]["data"][j]['route_name'],this.datas[i]["data"][j]['voie']])
          
        
          if(this.datas[i]["id"] == 1) {this.pointRadiusPointEvent1 = 1;this.colorPointEvent1='red'};
          if(this.datas[i]["id"] == 2) {this.pointRadiusPointEvent1 = 2;this.colorPointEvent1='green'};
          if(this.datas[i]["id"] == 3) {this.pointRadiusPointEvent1 = 3;this.colorPointEvent1='blue'};

          this.sendData['attributes'].map.layers[1].style[`[_type = ${this.datas[i]["id"]}]`] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                "type": "point",
                "fillColor": this.colorPointEvent1,
                "fillOpacity": this.fillOpacityPointEvent1,
                "strokeColor": this.colorPointEvent1,
                "strokeOpacity": 1,
                "pointRadius": this.pointRadiusPointEvent1,
                "strokeWidth": 5,
                "strokeLinecap": "square",
                "strokeDashstyle": "longdashdot"
              },{
                "type": "text",
                "fontColor": "#000000",
                "fontSize": "10px",
                "label": "[_name]",
                "goodnessOfFit": 0,
                "spaceAround": 0,
                "haloColor": "#ffffff",
             "haloOpacity": "0.7",
             "haloRadius": "0.5",
              }
          ]
          }

                   }
                   }

                   console.log(this.sendData)
                }
                else{
                  this.rapport = 'point';
                this.sendData.attributes.table.columns= ["id","évenement","PK_event","Route_id","Route","voie"];
                console.log("this is done filter");
                for(let i= 0;i< this.data1.length ; i++){
                  this.sendData['attributes'].map.layers[1].geojson.features.push(
                    {
                      "name":"achraf",
                    "type": "Feature",
                    "properties": { "_type": "pointy", "_name":`${this.data1[i]["id"]}`},
                    "geometry": this.data1[i]["ROUTE_GEOMETRY"]
                      }
          
                  )
                  
            this.dataTable.push([this.data1[i]['id'],this.data1[i]['event_name'],((this.data1[i]['pkEvent'])/1000).toFixed(3).toString(),this.data1[i]['route_id'].toString(),this.data1[i]['route_name'],this.data1[i]['voie']])
          
                    }
            this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                  "type": "point",
                  "fillColor": this.colorPointEvent1,
                  "fillOpacity": this.fillOpacityPointEvent1,
                  "strokeColor": this.colorPointEvent1,
                  "strokeOpacity": 1,
                  "pointRadius": this.pointRadiusPointEvent1,
                  "strokeWidth": 5,
                  "strokeLinecap": "square",
                  "strokeDashstyle": "longdashdot"
                },{
                  "type": "text",
                  "fontColor": "#000000",
                  "fontSize": "10px",
                  "label": "[_name]",
                  "goodnessOfFit": 0,
                  "spaceAround": 0,
                  "haloColor": "#ffffff",
               "haloOpacity": "0.7",
               "haloRadius": "0.5",
                }
            ]
            }

               console.log(this.sendData)
                }
                
      }else if(this.selectedTypeData == "lineaire"){

        if(this.themtiqueTree){
          console.log('achraf aouad');
          console.log('achraf aouad');
          console.log('achraf aouad');
          console.error(this.datas)
          this.rapport = 'lineaire';
          this.sendData.attributes.table.columns= ["id","évenement","Pkd","Pkf","Route_id","Route","voie"]
          
          for(let i= 0;i<this.datas.length;i++){
            for(let j= 0;j<this.datas[i]['data'].length;j++){ 
              console.log("heho " , this.datas[i]["id"])
            this.sendData['attributes'].map.layers[1].geojson.features.push(
              {
              "name":"achraf",
              "type": "Feature",
              "properties": { "_type": `${this.datas[i]["id"]}`, "_name":`${this.datas[i]["data"][j]['id']}`},  
              "geometry": this.datas[i]["data"][j]["ROUTE_GEOMETRY"]
                }
            )

            this.dataTable.push([this.datas[i]["data"][j]['id'],this.datas[i]["data"][j]['event_name'],((this.datas[i]["data"][j]['pkd'])/1000).toFixed(3).toString(),((this.datas[i]["data"][j]['pkf'])/1000).toFixed(3).toString(),this.datas[i]["data"][j]['route_id'],this.datas[i]["data"][j]['route_name'],this.datas[i]["data"][j]['voie']])
            if(this.datas[i]["id"] == 1) {this.strokeWidthPol1 = 1 , this.strock_colorPpl1 = 'red'}  ;
            if(this.datas[i]["id"] == 2) {this.strokeWidthPol1 = 2 , this.strock_colorPpl1 = 'blue'};
            if(this.datas[i]["id"] == 3) {this.strokeWidthPol1 = 3, this.strock_colorPpl1 = 'green'};
            this.sendData['attributes'].map.layers[1].style[`[_type = ${this.datas[i]["id"]}]`] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                    type: "polygon",
                    fillColor: this.fillColorPol1,
                    "fillOpacity": 1,
                    "strokeColor": this.strock_colorPpl1,
                    "strokeOpacity": 1,
                    "strokeWidth": this.strokeWidthPol1,
                    "strokeLinecap": this.strokeLinecapPol1,
                    "strokeDashstyle": this.strokeDashstylePol1
                    },{
                      "type": "text",
                      "fontColor": "#000000",
                      "fontSize": "10px",
                      "label": "[_name]",
                      "goodnessOfFit": 0,
                      "spaceAround": 0,
                      "haloColor": "#ffffff",
                   "haloOpacity": "0.7",
                   "haloRadius": "0.5",
                    }
                          ]
            }
  
          }

          console.log('line')
          console.log(this.sendData)
          }
     
        }else{
        this.rapport = 'lineaire';
        this.sendData.attributes.table.columns= ["id","évenement","Pkd","Pkf","Route_id","Route","voie"]
        for(let i= 0;i< this.data1.length ; i++){
          this.sendData['attributes'].map.layers[1].geojson.features.push(
            {
            "name":"achraf",
            "type": "Feature",
            "properties": { "_type": "join-miter", "_name":`${this.data1[i]["id"]}`},  
            "geometry": this.data1[i]["ROUTE_GEOMETRY"]
              }
  
          )
          this.dataTable.push([this.data1[i]['id'],this.data1[i]['event_name'],((this.data1[i]['pkd'])/1000).toFixed(3).toString(),((this.data1[i]['pkf'])/1000).toFixed(3).toString(),this.data1[i]['route_id'],this.data1[i]['route_name'],this.data1[i]['voie']])
          this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                  type: "polygon",
                  fillColor: this.fillColorPol1,
                  "fillOpacity": 1,
                  "strokeColor": this.strock_colorPpl1,
                  "strokeOpacity": 1,
                  "strokeWidth": this.strokeWidthPol1,
                  "strokeLinecap": this.strokeLinecapPol1,
                  "strokeDashstyle": this.strokeDashstylePol1
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                    "fontSize": "10px",
                    "label": "[_name]",
                    "goodnessOfFit": 0,
                    "spaceAround": 0,
                    "haloColor": "#ffffff",
                 "haloOpacity": "0.7",
                 "haloRadius": "0.5",
                  }
                        ]
          }

        }

      }
        }
        
    }



    if(this.firstEvent==false && this.secondEvent ==true){
      if(this.selectedTypeData == "ponctuel"){
        if(this.themtiqueTree){
                  //todo
                  console.log('achraf aouad');
        }
        this.rapport = 'point';
        this.sendData.attributes.table.columns= ["id","évenement","PK_event","Route_id","Route","voie"];
        console.log("this is done filter");
        for(let i= 0;i< this.data2.length ; i++){
          this.sendData['attributes'].map.layers[1].geojson.features.push(
            {
              "name":"achraf",
            "type": "Feature",
            "properties": { "_type": "pointy", "_name":`${this.data2[i]["id"]}`},
            "geometry": this.data2[i]["ROUTE_GEOMETRY"]
              }
  
          )
          
          this.dataTable.push([this.data2[i]['id'],this.data2[i]['event_name'],((this.data2[i]['pkEvent'])/1000).toFixed(3).toString(),this.data2[i]['route_id'].toString(),this.data2[i]['route_name'],this.data2[i]['voie']])
  
            }
            this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                  "type": "point",
                  "fillColor": this.colorPointEvent2,
                  "fillOpacity": this.fillOpacityPointEvent2,
                  "strokeColor": this.colorPointEvent2,
                  "strokeOpacity": 1,
                  "pointRadius": this.pointRadiusPointEvent2,
                  "strokeWidth": 5,
                  "strokeLinecap": "square",
                  "strokeDashstyle": "longdashdot"
                },{
                  "type": "text",
                  "fontColor": "#000000",
                  "fontSize": "10px",
                  "label": "[_name]",
                  "goodnessOfFit": 0,
                  "spaceAround": 0,
                  "haloColor": "#ffffff",
               "haloOpacity": "0.7",
               "haloRadius": "0.5",
                }
            ]
            }

               console.log(this.sendData)
      }else if(this.selectedTypeData == "lineaire"){
        if(this.themtiqueTree){

          this.rapport = 'lineaire';
          this.sendData.attributes.table.columns= ["id","évenement","Pkd","Pkf","Route_id","Route","voie"]
          console.log(this.datas.length);
          console.log(this.datas.length);
          for(let i= 0;i<this.datas.length;i++){
            for(let j= 0;j<this.datas[i]['data'].length;j++){

            this.sendData['attributes'].map.layers[1].geojson.features.push(
              {
              "name":"achraf",
              "type": "Feature",
              "properties": { "_type": `${this.datas[i]["id"]}`, "_name":`${this.datas[i]["data"][j]['id']}`},  
              "geometry": this.datas[i]["data"][j]["ROUTE_GEOMETRY"]
                }
            )

            this.dataTable.push([this.datas[i]["data"][j]['id'],this.datas[i]["data"][j]['event_name'],((this.datas[i]["data"][j]['pkd'])/1000).toFixed(3).toString(),((this.datas[i]["data"][j]['pkf'])/1000).toFixed(3).toString(),this.datas[i]["data"][j]['route_id'],this.datas[i]["data"][j]['route_name'],this.datas[i]["data"][j]['voie']])
            if(this.datas[i]["id"] == 1) {this.strokeWidthPol2 = this.strokeWidthPol2, this.strock_colorPpl2= 'red'}  ;
            if(this.datas[i]["id"] == 2) {this.strokeWidthPol2 = this.strokeWidthPol2 * 1.2 , this.strock_colorPpl2 = 'blue'};
            if(this.datas[i]["id"] == 3) {this.strokeWidthPol2 = this.strokeWidthPol2 * 1.3, this.strock_colorPpl2 = 'green'};
            this.sendData['attributes'].map.layers[1].style[`[_type = ${this.datas[i]["id"]}]`] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                    type: "polygon",
                    fillColor: this.fillColorPol2,
                    "fillOpacity": 1,
                    "strokeColor": this.strock_colorPpl2,
                    "strokeOpacity": 1,
                    "strokeWidth": this.strokeWidthPol2,
                    "strokeLinecap": this.strokeLinecapPol2,
                    "strokeDashstyle": this.strokeDashstylePol2
                    },{
                      "type": "text",
                      "fontColor": "#000000",
                      "fontSize": "10px",
                      "label": "[_name]",
                      "goodnessOfFit": 0,
                      "spaceAround": 0,
                      "haloColor": "#ffffff",
                   "haloOpacity": "0.7",
                   "haloRadius": "0.5",
                    }
                          ]
            }
  
          }

          console.log('line')
          console.log(this.sendData)
          }
     
        }
        this.rapport = 'lineaire';
        this.sendData.attributes.table.columns= ["id","évenement","Pkd","Pkf","Route_id","Route","voie"]
        for(let i= 0;i< this.data2.length ; i++){
          this.sendData['attributes'].map.layers[1].geojson.features.push(
            {
            "name":"achraf",
            "type": "Feature",
            "properties": { "_type": "join-miter", "_name":`${this.data2[i]["id"]}`},  
            "geometry": this.data2[i]["ROUTE_GEOMETRY"]
              }
  
          )
          this.dataTable.push([this.data2[i]['id'],this.data2[i]['event_name'],((this.data2[i]['pkd'])/1000).toFixed(3).toString(),((this.data2[i]['pkf'])/1000).toFixed(3).toString(),this.data2[i]['route_id'],this.data2[i]['route_name'],this.data2[i]['voie']])
          this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                  type: "polygon",
                  fillColor: this.fillColorPol2,
                  "fillOpacity": 1,
                  "strokeColor": this.strock_colorPpl2,
                  "strokeOpacity": 1,
                  "strokeWidth": this.strokeWidthPol2,
                  "strokeLinecap": this.strokeLinecapPol2,
                  "strokeDashstyle": this.strokeDashstylePol2
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                    "fontSize": "10px",
                    "label": "[_name]",
                    "goodnessOfFit": 0,
                    "spaceAround": 0,
                    "haloColor": "#ffffff",
                 "haloOpacity": "0.7",
                 "haloRadius": "0.5",
                  }
                        ]
          }

        }

      }
    }


  }





   if(this.firstEvent == true && this.secondEvent == true){

 
          console.log("ponctuel events")
          console.log(this.data1)
          if(this.selectedTypeData == this.selectedTypeData2){
            if(this.selectedTypeData == "ponctuel"){
              this.rapport = 'pointPoint';

  
      
      
        this.sendData.attributes.table.columns= ["id","évenement","PK_event","Route_id","Route","voie"]
       console.log("this is done filter");
        for(let i= 0;i< this.data1.length ; i++){
        this.sendData['attributes'].map.layers[1].geojson.features.push(
          {
            "name":"achraf",
          "type": "Feature",
          "properties": { "_type": "pointy", "_name":`${this.data1[i]["ID"]}`},
          "geometry": this.data1[i]["ROUTE_GEOMETRY"]
            }

        )
        
        this.dataTable.push([this.data1[i]['ID'],this.data1[i]['NAME'],((this.data1[i]['PKEVENT'])/1000).toFixed(3).toString(),this.data1[i]['ROUTE_ID'].toString(),this.data1[i]['ROUTE_NAME'],this.data1[i]['VOIE']])

          }

          this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                "type": "point",
                "fillColor": this.colorPointEvent1,
                "fillOpacity": this.fillOpacityPointEvent1,
                "strokeColor": this.colorPointEvent1,
                "strokeOpacity": 1,
                "pointRadius": this.pointRadiusPointEvent1,
                "strokeWidth": 5,
                "strokeLinecap": "square",
                "strokeDashstyle": "longdashdot"
              },{
                "type": "text",
                "fontColor": "#000000",
                "fontSize": "10px",
                "label": "[_name]",
                "goodnessOfFit": 0,
                "spaceAround": 0,
                "haloColor": "#ffffff",
             "haloOpacity": "0.7",
             "haloRadius": "0.5",
              }
          ]
          }


          console.log(this.sendData)

      


      

    }else if(this.selectedTypeData == "lineaire"){
      this.sendData.attributes.table.columns= ["id","évenement1","évenement2","PKD","PKD_1","PKF","PKF_1","route","voie"]
        for(let i= 0;i< this.data1.length ; i++){
            this.sendData['attributes'].map.layers[1].geojson.features.push(
              {
              "name":"achraf",
              "type": "Feature",
              "properties": { "_type": "join-miter_red", "_name":`${this.data1[i]["ID"]}`},
              "geometry": this.data1[i]["INTERSECTION"]
                }
    
            )
          }
      for(let i= 0;i< this.data1.length ; i++){
       
        this.sendData['attributes'].map.layers[1].geojson.features.push(
          {
          "name":"achraf",
          "type": "Feature",
          "properties": { "_type": "join-miter", "_name":`${this.data1[i]["ID"]}`},
          "geometry": this.data1[i]["ROUTE_GEOMETRY"]
            }

        )
        this.sendData['attributes'].map.layers[1].geojson.features.push(
          {
          "name":"achraf",
          "type": "Feature",
          "properties": { "_type": "join-miter2", "_name":`${this.data1[i]["ID"]}`},
          "geometry": this.data1[i]["ROUTE_GEOMETRY_1"]
            }

        )

        
        this.dataTable.push([this.data1[i]['ID'],this.data1[i]['EVENT_TYPE_ID'],this.data1[i]['EVENT_TYPE_ID_1'],((this.data1[i]['PKD'])/1000).toFixed(3).toString(),((this.data1[i]['PKD_1'])/1000).toFixed(3).toString(),((this.data1[i]['PKF'])/1000).toFixed(3).toString(),((this.data1[i]['PKF_1'])/1000).toFixed(3).toString(),this.data1[i]['ROUTE_NAME'],this.data1[i]['VOIE']])

          }


        

          this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter_red']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                  type: "polygon",
                  fillColor: "red",
                  "fillOpacity": 1,
                  "strokeColor": "red",
                  "strokeOpacity": 1, 
                  "strokeWidth": 1,
                  "strokeLinecap": this.strokeLinecapPol1,
                  "strokeDashstyle": this.strokeDashstylePol1
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                    "fontSize": "10px",
                    "label": "[_name]",
                    "goodnessOfFit": 0,
                    "spaceAround": 0,
                    "haloColor": "#ffffff",
                 "haloOpacity": "0.7",
                 "haloRadius": "0.5",
                  }
                        ]
          }


          this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                  type: "polygon",
                  fillColor: this.fillColorPol1,
                  "fillOpacity": 1,
                  "strokeColor": this.strock_colorPpl1,
                  "strokeOpacity": 1,
                  "strokeWidth": this.strokeWidthPol1,
                  "strokeLinecap": this.strokeLinecapPol1,
                  "strokeDashstyle": this.strokeDashstylePol1
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                    "fontSize": "10px",
                    "label": "[_name]",
                    "goodnessOfFit": 0,
                    "spaceAround": 0,
                    "haloColor": "#ffffff",
                 "haloOpacity": "0.7",
                 "haloRadius": "0.5",
                  }
                        ]
          }


          this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter2']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                  "type": "polygon",
                  "fillColor": this.fillColorPol2,
                  "fillOpacity": 1,
                  "strokeColor": this.strock_colorPpl2,
                  "strokeOpacity": 1,
                  "strokeWidth": this.strokeWidthPol2,
                  "strokeLinecap": this.strokeLinecapPol2,
                  "strokeDashstyle": this.strokeDashstylePol2
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                    "label": "[_name]",
                    "fontSize": "10px",
                    "goodnessOfFit": 0,
                    "spaceAround": 0,
                    "haloColor": "#ffffff",
                 "haloOpacity": "0.7",
                 "haloRadius": "0.5",
                  }
                        ]
          }







    }
  }else if(this.selectedTypeData != this.selectedTypeData2){
    console.log(" achraf aouad ")
    console.error(this.sendData.attributes.table.columns)
    this.sendData.attributes.table.columns = ["id","évenement1","évenement2","PkEvent","PKD","PKF","route","voie"];


    console.error(this.sendData.attributes.table.columns)
    for(let i= 0;i< this.data1.length ; i++){
      this.sendData['attributes'].map.layers[1].geojson.features.push(
        {
        "name":"achraf",
        "type": "Feature",
        "properties": { "_type": "pointy", "_name":`${this.data1[i]["ID"]}`},
        "geometry": this.data1[i]["ROUTE_GEOMETRY"]
          }

      )
    }

    for(let i= 0;i< this.data1.length ; i++){

    this.sendData['attributes'].map.layers[1].geojson.features.push(
      {
      "name":"achraf",
      "type": "Feature",
      "properties": { "_type": "join-miter2", "_name":`${this.data1[i]["ID"]}`},
      "geometry": this.data1[i]["ROUTE_GEOMETRY_1"]
        }



    )

    this.dataTable.push([this.data1[i]['ID'],this.data1[i]['EVENT_TYPE_ID'],this.data1[i]['EVENT_TYPE_ID_1'],((this.data1[i]['PKEVENT'])/1000).toFixed(3).toString(),((this.data1[i]['PKD'])/1000).toFixed(3).toString(),((this.data1[i]['PKF'])/1000).toFixed(3).toString(),this.data1[i]['ROUTE_NAME'],this.data1[i]['VOIE']])

      }


      if(this.selectedTypeData == 'ponctuel'){
            this.sendData['attributes'].secondLegendClass = this.selectedTh;
            this.sendData['attributes'].project_medium_compelte_color = this.colorPointEvent1;

            this.sendData['attributes'].secondLegendClass = this.selectedTh2;
            this.sendData['attributes'].project_compelte_color = this.strock_colorPpl2;

            this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                  "type": "point",
                  "fillColor": this.colorPointEvent1,
                  "fillOpacity": this.fillOpacityPointEvent1,
                  "strokeColor": this.colorPointEvent1,
                  "strokeOpacity": 1,
                  "pointRadius": this.pointRadiusPointEvent1,
                  "strokeWidth": 5,
                  "strokeLinecap": "square",
                  "strokeDashstyle": "longdashdot"
                },{
                  "type": "text",
                  "fontColor": "#000000",
                  "fontSize": "10px",
                  "label": "[_name]",
                  "goodnessOfFit": 0,
                  "spaceAround": 0,
                  "haloColor": "#ffffff",
              "haloOpacity": "0.7",
              "haloRadius": "0.5",
                }
            ]
            }


            this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter2']"] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                    "type": "polygon",
                    "fillColor": this.fillColorPol2,
                    "fillOpacity": 1,
                    "strokeColor": this.strock_colorPpl2,
                    "strokeOpacity": 1,
                  "strokeWidth": this.strokeWidthPol2,
                  "strokeLinecap": this.strokeLinecapPol2,
                  "strokeDashstyle": this.strokeDashstylePol2
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                      "label": "[_name]",
                      "fontSize": "10px",
                      "goodnessOfFit": 0,
                      "spaceAround": 0,
                      "haloColor": "#ffffff",
                  "haloOpacity": "0.7",
                "haloRadius": "0.5",
                  }
                        ]
          }


    
    
    
      }else{
        this.sendData['attributes'].secondLegendClass = this.selectedTh2;
        this.sendData['attributes'].project_medium_compelte_color = this.colorPointEvent2;

        this.sendData['attributes'].secondLegendClass = this.selectedTh;
        this.sendData['attributes'].project_compelte_color = this.strock_colorPpl1;
        
        this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
          // values defined in symbolizer will override defaults
          symbolizers: [
            {
              "type": "point",
              "fillColor": this.colorPointEvent2,
              "fillOpacity": this.fillOpacityPointEvent2,
              "strokeColor": this.colorPointEvent2,
              "strokeOpacity": 1,
              "pointRadius": this.pointRadiusPointEvent2,
              "strokeWidth": 5,
              "strokeLinecap": "square",
              "strokeDashstyle": "longdashdot"
            },{
              "type": "text",
              "fontColor": "#000000",
              "fontSize": "10px",
              "label": "[_name]",
              "goodnessOfFit": 0,
              "spaceAround": 0,
              "haloColor": "#ffffff",
           "haloOpacity": "0.7",
           "haloRadius": "0.5",
            }
        ]
        }


        this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter2']"] = {
          // values defined in symbolizer will override defaults
          symbolizers: [
            {
                "type": "polygon",
                "fillColor": this.fillColorPol1,
                "fillOpacity": 1,
                "strokeColor": this.strock_colorPpl1,
                "strokeOpacity": 1,
                "strokeWidth": this.strokeWidthPol1,
                "strokeLinecap": this.strokeLinecapPol1,
                "strokeDashstyle": this.strokeDashstylePol1
                },{
                  "type": "text",
                  "fontColor": "#000000",
                  "label": "[_name]",
                      "fontSize": "10px",
                      "goodnessOfFit": 0,
                      "spaceAround": 0,
                      "haloColor": "#ffffff",
                  "haloOpacity": "0.7",
                  "haloRadius": "0.5",
                    }
                          ]
            }



          }
        
        }
        }
   

      }

   

 if(!this.filtre){
console.log("achdert a rebbi")
console.log(this.data1)
  if(this.firstEvent==true && this.secondEvent ==false || this.firstEvent==false && this.secondEvent ==true ){
    if(this.firstEvent==true && this.secondEvent ==false){
      if(this.selectedTypeData == "ponctuel"){
        this.rapport = 'point';
        this.sendData.attributes.table.columns= ["id","évenement","PK_event","Route_id","Route","voie"];
        console.log("mohammed o brahim");
        for(let i= 0;i< this.data1.length ; i++){
          console.log(i)
          this.sendData['attributes'].map.layers[1].geojson.features.push(
            {
              "name":"achraf",
            "type": "Feature",
            "properties": { "_type": "pointy", "_name":`${this.dataPoint1[i]["id"]}`},
            "geometry": this.data1[i]
              }
  
          )
          // this.dataTable.push([this.data1[i]["id"],this.dataPoint1[i]['event_type'].name.toString(),this.dataPoint1[i].route_name,'----','----',((this.dataPoint1[i].pkEvent)/1000).toFixed(3).toString(),this.selectedTh,this.dataPoint1[i].voie])

          this.dataTable.push([this.dataPoint1[i]["id"],this.dataPoint1[i]['event_type'].name.toString(),((this.dataPoint1[i]['pkEvent'])/1000).toFixed(3).toString(),this.dataPoint1[i]['route'].route_id.toString(),this.dataPoint1[i]['route_name'],this.dataPoint1[i]['voie']])
  
            }
            this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                  "type": "point",
                  "fillColor": this.colorPointEvent1,
                  "fillOpacity": this.fillOpacityPointEvent1,
                  "strokeColor": this.colorPointEvent1,
                  "strokeOpacity": 1,
                  "pointRadius": this.pointRadiusPointEvent1,
                  "strokeWidth": 5,
                  "strokeLinecap": "square",
                  "strokeDashstyle": "longdashdot"
                },{
                  "type": "text",
                  "fontColor": "#000000",
                  "fontSize": "10px",
                  "label": "[_name]",
                  "goodnessOfFit": 0,
                  "spaceAround": 0,
                  "haloColor": "#ffffff",
               "haloOpacity": "0.7",
               "haloRadius": "0.5",
                }
            ]
            }

               console.log(this.sendData)
      }else if(this.selectedTypeData == "lineaire"){
        this.rapport = 'lineaire';
        this.sendData.attributes.table.columns= ["id","évenement","Pkd","Pkf","Route_id","Route","voie"]
        for(let i= 0;i< this.data1.length ; i++){
          this.sendData['attributes'].map.layers[1].geojson.features.push(
            {
            "name":"achraf",
            "type": "Feature",
            "properties": { "_type": "join-miter", "_name":`${this.dataLine1[i]["id"]}`},  
            "geometry": this.data1[i]
              }
  
          )
          //do u do u
          // this.dataTable.push([this.data1[i]['id'],this.data1[i]['event_name'],((this.data1[i]['pkd'])/1000).toFixed(3).toString(),((this.data1[i]['pkf'])/1000).toFixed(3).toString(),this.data1[i]['route_id'],this.data1[i]['route_name'],this.data1[i]['voie']])
          this.dataTable.push([this.dataLine1[i]["id"],this.dataLine1[i]['event_type'].name.toString(),((this.dataLine1[i]['pkd'])/1000).toFixed(3).toString(),((this.dataLine1[i]['pkf'])/1000).toFixed(3).toString(),this.dataLine1[i]['lrs_routes'].route_id,this.dataLine1[i]['route_name'],this.dataLine1[i]['voie']])

        
          this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                  type: "polygon",
                  fillColor: this.fillColorPol1,
                  "fillOpacity": 1,
                  "strokeColor": this.strock_colorPpl1,
                  "strokeOpacity": 1,
                  "strokeWidth": this.strokeWidthPol1,
                  "strokeLinecap": this.strokeLinecapPol1,
                  "strokeDashstyle": this.strokeDashstylePol1
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                    "fontSize": "10px",
                    "label": "[_name]",
                    "goodnessOfFit": 0,
                    "spaceAround": 0,
                    "haloColor": "#ffffff",
                 "haloOpacity": "0.7",
                 "haloRadius": "0.5",
                  }
                        ]
          }

        }

      }
    }



    if(this.firstEvent==false && this.secondEvent ==true){
      if(this.selectedTypeData == "ponctuel"){
        this.rapport = 'point';
        this.sendData.attributes.table.columns= ["id","évenement","PK_event","Route_id","Route","voie"];
        console.log("this is done");
        for(let i= 0;i< this.data2.length ; i++){
          this.sendData['attributes'].map.layers[1].geojson.features.push(
            {
              "name":"achraf",
            "type": "Feature",
            "properties": { "_type": "pointy", "_name":`${this.dataPoint2[i]["id"]}`},
            "geometry": this.data2[i]
              }
  
          )
          this.dataTable.push([this.dataPoint2[i]["id"],this.dataPoint2[i]['event_type'].name.toString(),((this.dataPoint2[i]['pkEvent'])/1000).toFixed(3).toString(),this.dataPoint2[i]['route'].route_id.toString(),this.dataPoint2[i]['route_name'],this.dataPoint2[i]['voie']])

          // this.dataTable.push([this.data2[i]['id'],this.data2[i]['event_name'],((this.data2[i]['pkEvent'])/1000).toFixed(3).toString(),this.data2[i]['route_id'].toString(),this.data2[i]['route_name'],this.data2[i]['voie']])
  
            }
            this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
              // values defined in symbolizer will override defaults
              symbolizers: [
                {
                  "type": "point",
                  "fillColor": this.colorPointEvent2,
                  "fillOpacity": this.fillOpacityPointEvent2,
                  "strokeColor": this.colorPointEvent2,
                  "strokeOpacity": 1,
                  "pointRadius": this.pointRadiusPointEvent2,
                  "strokeWidth": 5,
                  "strokeLinecap": "square",
                  "strokeDashstyle": "longdashdot"
                },{
                  "type": "text",
                  "fontColor": "#000000",
                  "fontSize": "10px",
                  "label": "[_name]",
                  "goodnessOfFit": 0,
                  "spaceAround": 0,
                  "haloColor": "#ffffff",
               "haloOpacity": "0.7",
               "haloRadius": "0.5",
                }
            ]
            }

               console.log(this.sendData)
      }else if(this.selectedTypeData == "lineaire"){
        this.rapport = 'lineaire';
        this.sendData.attributes.table.columns= ["id","évenement","Pkd","Pkf","Route_id","Route","voie"]
        for(let i= 0;i< this.data2.length ; i++){
          this.sendData['attributes'].map.layers[1].geojson.features.push(
            {
            "name":"achraf",
            "type": "Feature",
            "properties": { "_type": "join-miter", "_name":`${this.data2[i]["id"]}`},  
            "geometry": this.data2[i]
              }
  
          )
          this.dataTable.push([this.data2[i]['id'],this.dataLine2[i]['event_type'].name.toString(),((this.dataLine2[i]['pkEvent'])/1000).toFixed(3).toString(),this.dataLine2[i]['route'].route_id.toString(),this.dataLine2[i]['route_name'],this.dataLine2[i]['voie']])

          // this.dataTable.push([this.data2[i]['id'],this.data2[i]['event_name'],((this.data2[i]['pkd'])/1000).toFixed(3).toString(),((this.data2[i]['pkf'])/1000).toFixed(3).toString(),this.data2[i]['route_id'],this.data2[i]['route_name'],this.data2[i]['voie']])
          this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter']"] = {
            // values defined in symbolizer will override defaults
            symbolizers: [
              {
                  type: "polygon",
                  fillColor: this.fillColorPol2,
                  "fillOpacity": 1,
                  "strokeColor": this.strock_colorPpl2,
                  "strokeOpacity": 1,
                  "strokeWidth": this.strokeWidthPol2,
                  "strokeLinecap": this.strokeLinecapPol2,
                  "strokeDashstyle": this.strokeDashstylePol2
                  },{
                    "type": "text",
                    "fontColor": "#000000",
                    "fontSize": "10px",
                    "label": "[_name]",
                    "goodnessOfFit": 0,
                    "spaceAround": 0,
                    "haloColor": "#ffffff",
                 "haloOpacity": "0.7",
                 "haloRadius": "0.5",
                  }
                        ]
          }

        }

      }
    }


  }
  else{

  

  if(this.selectedTypeData == "ponctuel" ){
    for(let i= 0;i< this.data1.length ; i++){
      this.sendData['attributes'].map.layers[1].geojson.features.push(
        {
          "name":"achraf",
        "type": "Feature",
        "properties": { "_type": "pointy", "_name":`${this.length}`},
            "geometry": this.data1[i]
          }
      )
      this.length ++;
      this.id ++;
      //todo
      this.dataTable.push([this.id,this.length.toString(),this.dataPoint1[i].route_name,'----','----',((this.dataPoint1[i].pkEvent)/1000).toFixed(3).toString(),this.selectedTh,this.dataPoint1[i].voie])
    }

    this.sendData['attributes'].map.layers[1].style["[_type = 'pointy']"] = {
      // values defined in symbolizer will override defaults
      symbolizers: [
        {
          "type": "point",
          "fillColor": this.colorPointEvent1,
          "fillOpacity": this.fillOpacityPointEvent1,
          "strokeColor": this.colorPointEvent1,
          "strokeOpacity": 1,
          "pointRadius": this.pointRadiusPointEvent1,
          "strokeWidth": 5,
          "strokeLinecap": "square",
          "strokeDashstyle": "longdashdot"
        },{
          "type": "text",
          "fontColor": "#000000",
          "fontSize": "10px",
          "label": "[_name]",
          "goodnessOfFit": 0,
          "spaceAround": 0,
          "haloColor": "#ffffff",
       "haloOpacity": "0.7",
       "haloRadius": "0.5",
        }
    ]
    }
   
  }
  if(this.selectedTypeData == "lineaire" ){
    console.log("zemla d zeb");
   
    for(let i= 0;i<this.data1.length;i++){
      console.log(i)
      this.sendData['attributes'].map.layers[1].geojson.features.push(
        {
     
        "type": "Feature",
        "properties": { "_type": "join-miter", "_name":`${this.length}`},
            "geometry": this.data1[i]
          }
      )
      this.length ++;

      this.id ++;
       this.dataTable.push([this.id,this.length.toString(),this.dataLine1[i].route_name,((this.dataLine1[i].pkd)/1000).toFixed(3).toString(),((this.dataLine1[i].pkf)/1000).toFixed(3).toString(),"---------",this.selectedTh,this.dataLine1[i].voie])

    }

    this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter']"] = {
      // values defined in symbolizer will override defaults
      symbolizers: [
        {
            type: "polygon",
            fillColor: this.fillColorPol1,
            "fillOpacity": 1,
            "strokeColor": this.strock_colorPpl1,
            "strokeOpacity": 1,
            "strokeWidth": this.strokeWidthPol1,
            "strokeLinecap": this.strokeLinecapPol1,
            "strokeDashstyle": this.strokeDashstylePol1
            },{
              "type": "text",
              "fontColor": "#000000",
              "fontSize": "10px",
              "label": "[_name]",
              "goodnessOfFit": 0,
              "spaceAround": 0,
              "haloColor": "#ffffff",
           "haloOpacity": "0.7",
           "haloRadius": "0.5",
            }
                  ]
    }
   
  }



  if(this.selectedTypeData2 == "ponctuel" ){
   
    for(let i= 0;i<this.data2.length;i++){
      this.sendData['attributes'].map.layers[1].geojson.features.push(
        {
         
        "type": "Feature",
        "properties": { "_type": "pointy1", "_name":`${this.length}`},
            "geometry": this.data2[i]
          }
      )
      this.length ++;

      this.id ++;
      this.dataTable.push([this.id,this.length.toString(),this.dataPoint2[i].route_name,'----','----',((this.dataPoint2[i].pkEvent)/1000).toFixed(3).toString(),this.selectedTh2,this.dataPoint2[i].voie])

    }

    this.sendData['attributes'].map.layers[1].style["[_type = 'pointy1']"] = {
      // values defined in symbolizer will override defaults
      symbolizers: [
        {
          "type": "point",
          "fillColor": this.colorPointEvent2,
          "fillOpacity": this.fillOpacityPointEvent2,
          "strokeColor": this.colorPointEvent2,
          "strokeOpacity": 1,
          "pointRadius": this.pointRadiusPointEvent2,
          "strokeWidth": 5,
          "strokeLinecap": "square",
          "strokeDashstyle": "longdashdot"
        },
          {
            "type": "text",
            "fontColor": "#000000",
            "label": "[_name]",
            "goodnessOfFit": 0,
            "spaceAround": 0,
            "fontSize": "10px",
            "haloColor": "#ffffff",
         "haloOpacity": "0.7",
         "haloRadius": "0.5",
          }
        
    
    ]
    }
   
  }
  if(this.selectedTypeData2 == "lineaire" ){
      console.log("second")
    for(let i= 0;i<this.data2.length;i++){
      this.sendData['attributes'].map.layers[1].geojson.features.push(
        {
        "type": "Feature",
        "properties": { "_type": "join-miter2", "_name":`${this.length}`},
            "geometry": this.data2[i]
          }
      )

      this.id ++;
      this.length ++;
       this.dataTable.push([this.id,this.length.toString(),this.dataLine2[i].route_name,((this.dataLine2[i].pkd)/1000).toFixed(3).toString(),((this.dataLine2[i].pkf)/1000).toFixed(3).toString(),"-------------",this.selectedTh2,this.dataLine2[i].voie])

    }

    this.sendData['attributes'].map.layers[1].style["[_type = 'join-miter2']"] = {
      // values defined in symbolizer will override defaults
      symbolizers: [
        {
            "type": "polygon",
            "fillColor": this.fillColorPol2,
            "fillOpacity": 1,
            "strokeColor": this.strock_colorPpl2,
            "strokeOpacity": 1,
            "strokeWidth": this.strokeWidthPol2,
            "strokeLinecap": this.strokeLinecapPol2,
            "strokeDashstyle": this.strokeDashstylePol2
            },{
              "type": "text",
              "fontColor": "#000000",
              "label": "[_name]",
              "fontSize": "10px",
              "goodnessOfFit": 0,
              "spaceAround": 0,
              "haloColor": "#ffffff",
           "haloOpacity": "0.7",
           "haloRadius": "0.5",
            }
                  ]
    }
   
  }}
 }

this.sendData.attributes.legend_opaque = this.transparenceLegendre;
this.sendData.attributes.legend_background_color = this.lenged_color;


//province

this.sendData['attributes'].map.layers[1].geojson.features.push(
  {
      "type": "Feature",
    "properties": { "_type": "province", "_name":"achraf2"},
      "geometry": this.provinceSelect
  }
)

this.sendData['attributes'].map.layers[1].style["[_type = 'province']"] = {
  //values defined in symbolizer will override defaults

  symbolizers: [
    {
        "type": "polygon",
        "fillOpacity": 0,
        "strokeColor": this.province_color,
        "strokeOpacity": 1,
        "strokeWidth": this.strokeWidthP,
        "strokeLinecap": "square",
        "strokeDashstyle": this.trait
        }
              ]
}


if(this.base){
  this.sendData['attributes'].map.layers.push(
    { 
      "baseURL": this.base,
      "imageExtension": "png",  
      "type": "OSM"               
      }
  )
}


console.log(this.dataTable)

if(this.sorter){
 
 if(this.sorttype=="Asc"|| this.sorttype=="Desc"){
   if(this.sorttype=="Asc"){
    this.dataTable.sort((a, b)=> {
      const nameA = a[this.colonne].toUpperCase(); // ignore upper and lowercase
      const nameB = b[this.colonne].toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
   }
   if(this.sorttype=="Desc"){
    this.dataTable.sort((a, b)=> {
      const nameA = a[this.colonne].toUpperCase(); // ignore upper and lowercase
      const nameB = b[this.colonne].toUpperCase(); // ignore upper and lowercase
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
   }


 
 }
 


}

console.log(this.dataTable);



if(this.table){
  this.sendData.attributes.table.data = this.dataTable;
}else{
  this.sendData.attributes.table.columns = []
  this.sendData.attributes.table.data = []
}


var startTime = new Date().getTime();


console.log(this.dataTable.length);


if(this.filtre){


  if(this.firstEvent==true && this.secondEvent ==false || this.firstEvent==false && this.secondEvent ==true ){
    delete this.sendData['attributes'].secondLegendClass;
    delete this.sendData['attributes'].project_medium_compelte_color;

    if(this.firstEvent==true && this.secondEvent ==false){

      this.sendData['attributes'].firstLegendClass =this.thematique1 ;

      if(this.selectedTypeData == "ponctuel" ){
        if(this.themtiqueTree){
          this.sendData['attributes'].project_compelte_color ='red' ;
          this.sendData['attributes'].firstLegendClass = this.singlethematique[0]['attr'] +this.singlethematique[0]['opp']+this.singlethematique[0]['value']  ;
          this.sendData['attributes'].secondLegendClass = this.singlethematique[1]['attr'] +this.singlethematique[1]['opp']+this.singlethematique[1]['value']  ;
          this.sendData['attributes']['secondLegendClass2'] = this.singlethematique[2]['attr'] +this.singlethematique[2]['opp']+this.singlethematique[2]['value']  ;

          this.sendData['attributes'].project_medium_compelte_color ='green' ;
          this.sendData['attributes']['project_medium_compelte_color2'] ='blue' ;
          await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle2PointReport/report.pdf",{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify(this.sendData)
          }).then(response =>{
          if(response.ok){
           return response.json();
          }
          throw new Error('request failed');}, networkError => console.log("chi le3ba") )
          .then(responseJson =>{
            console.log(responseJson)
            this.downloadWhenReady(startTime, responseJson);
            
          })

        }
        else{
          this.sendData['attributes'].project_compelte_color =this.colorPointEvent1 ;
          await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3singlepoint/report.pdf",{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify(this.sendData)
          }).then(response =>{
          if(response.ok){
           return response.json();
          }
          throw new Error('request failed');}, networkError => console.log("chi le3ba") )
          .then(responseJson =>{
            console.log(responseJson)
            this.downloadWhenReady(startTime, responseJson);
            
          })
        }

        

      }
      else if(this.selectedTypeData == "lineaire"){
        if(this.themtiqueTree){
          console.log('print print line')
          this.sendData['attributes'].project_compelte_color ='red' ;
          this.sendData['attributes'].firstLegendClass = this.singlethematique[0]['attr'] +this.singlethematique[0]['opp']+this.singlethematique[0]['value']  ;
          this.sendData['attributes'].secondLegendClass = this.singlethematique[1]['attr'] +this.singlethematique[1]['opp']+this.singlethematique[1]['value']  ;
          this.sendData['attributes']['secondLegendClass2'] = this.singlethematique[2]['attr'] +this.singlethematique[2]['opp']+this.singlethematique[2]['value']  ;

          this.sendData['attributes'].project_medium_compelte_color ='green' ;
          this.sendData['attributes']['project_medium_compelte_color2'] ='blue' ;
          await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle2LineReport/report.pdf",{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify(this.sendData)
          }).then(response =>{
          if(response.ok){
           return response.json();
          }
          throw new Error('request failed');}, networkError => console.log("chi le3ba") )
          .then(responseJson =>{
            console.log(responseJson)
            this.downloadWhenReady(startTime, responseJson);
            
          })

        }
        else{
          this.sendData['attributes'].project_compelte_color =this.strock_colorPpl1 ;
          console.log(this.sendData);
     await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3line/report.pdf",{
       method:'POST',
       headers:{'Content-Type':"application/json"},
       body: JSON.stringify(this.sendData)
     }).then(response =>{
     if(response.ok){
      return response.json();
     }
     throw new Error('request failed');}, networkError => console.log("chi le3ba") )
     .then(responseJson =>{
       console.log(responseJson)
       this.downloadWhenReady(startTime, responseJson);
       
     })
        }
      }
    
    }else if(this.firstEvent==false && this.secondEvent ==true){

      this.sendData['attributes'].firstLegendClass =this.thematique2;
      if(this.selectedTypeData == "ponctuel" ){
        if(this.themtiqueTree){
          this.sendData['attributes'].project_compelte_color ='red' ;
          this.sendData['attributes'].firstLegendClass = this.singlethematique[0]['attr'] +this.singlethematique[0]['opp']+this.singlethematique[0]['value']  ;
          this.sendData['attributes'].secondLegendClass = this.singlethematique[1]['attr'] +this.singlethematique[1]['opp']+this.singlethematique[1]['value']  ;
          this.sendData['attributes']['secondLegendClass2'] = this.singlethematique[2]['attr'] +this.singlethematique[2]['opp']+this.singlethematique[2]['value']  ;

          this.sendData['attributes'].project_medium_compelte_color ='green' ;
          this.sendData['attributes']['project_medium_compelte_color2'] ='blue' ;
          await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle2PointReport/report.pdf",{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify(this.sendData)
          }).then(response =>{
          if(response.ok){
           return response.json();
          }
          throw new Error('request failed');}, networkError => console.log("chi le3ba") )
          .then(responseJson =>{
            console.log(responseJson)
            this.downloadWhenReady(startTime, responseJson);
            
          })

        }
        else{

          this.sendData['attributes'].project_compelte_color =this.colorPointEvent2;
          await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3singlepoint/report.pdf",{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify(this.sendData)
          }).then(response =>{
          if(response.ok){
           return response.json();
          }
          throw new Error('request failed');}, networkError => console.log("chi le3ba") )
          .then(responseJson =>{
            console.log(responseJson)
            this.downloadWhenReady(startTime, responseJson);
            
          })
        }

        
        
      }
      else if(this.selectedTypeData == "lineaire"){
        if(this.themtiqueTree){
          this.sendData['attributes'].project_compelte_color ='red' ;
          this.sendData['attributes'].firstLegendClass = this.singlethematique[0]['attr'] +this.singlethematique[0]['opp']+this.singlethematique[0]['value']  ;
          this.sendData['attributes'].secondLegendClass = this.singlethematique[1]['attr'] +this.singlethematique[1]['opp']+this.singlethematique[1]['value']  ;
          this.sendData['attributes']['secondLegendClass2'] = this.singlethematique[2]['attr'] +this.singlethematique[2]['opp']+this.singlethematique[2]['value']  ;

          this.sendData['attributes'].project_medium_compelte_color ='green' ;
          this.sendData['attributes']['project_medium_compelte_color2'] ='blue' ;
          await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle2LineReport/report.pdf",{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify(this.sendData)
          }).then(response =>{
          if(response.ok){
           return response.json();
          }
          throw new Error('request failed');}, networkError => console.log("chi le3ba") )
          .then(responseJson =>{
            console.log(responseJson)
            this.downloadWhenReady(startTime, responseJson);
            
          })

        }else{
          this.sendData['attributes'].project_compelte_color =this.strock_colorPpl2 ;

          await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3line/report.pdf",{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify(this.sendData)
          }).then(response =>{
          if(response.ok){
           return response.json();
          }
          throw new Error('request failed');}, networkError => console.log("chi le3ba") )
          .then(responseJson =>{
            console.log(responseJson)
            this.downloadWhenReady(startTime, responseJson);
            
          })
        }
        

      }
    }


  }else if(this.firstEvent==true && this.secondEvent ==true){

    console.log(this.filtre ,this.selectedTypeData,this.selectedTypeData2 )
    if(this.selectedTypeData == this.selectedTypeData2){
      if(this.selectedTypeData == "ponctuel"){
      console.log("this.data1")
      console.log(this.data1)
    await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3/report.pdf",{
    method:'POST',
    headers:{'Content-Type':"application/json"},
    body: JSON.stringify(this.sendData)
  }).then(response =>{
  if(response.ok){
   return response.json();
  }
  throw new Error('request failed');}, networkError => console.log("chi le3ba") )
  .then(responseJson =>{
    console.log(responseJson)
    this.downloadWhenReady(startTime, responseJson);
    
  })
  
  }
  if(this.selectedTypeData == "lineaire"){
  
    this.sendData.attributes['intersection'] = "intersection";
    this.sendData.attributes['intersection_color'] = "red";
    console.log(this.sendData)
    await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle4_Line_Line/report.pdf",{
      method:'POST',
      headers:{'Content-Type':"application/json"},
      body: JSON.stringify(this.sendData)
    }).then(response =>{
    if(response.ok){
     return response.json();
    }
    throw new Error('request failed');}, networkError => console.log("chi le3ba") )
    .then(responseJson =>{
      console.log(responseJson)
      this.downloadWhenReady(startTime, responseJson);
      
    })
  }
  } else if(this.selectedTypeData != this.selectedTypeData2){
    this.sendData.attributes.table.columns = ["id","évenement1","évenement2","PkEvent","PKD","PKF","route","voie"];
    this.sendData.attributes.table.data = this.dataTable;
  
     console.log(this.sendData)
  
     await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle4_Line_Linepoint/report.pdf",{
      method:'POST',
      headers:{'Content-Type':"application/json"},
      body: JSON.stringify(this.sendData)
    }).then(response =>{
    if(response.ok){
     return response.json();
    }
    throw new Error('request failed');}, networkError => console.log("chi le3ba") )
    .then(responseJson =>{
      console.log(responseJson)
      this.downloadWhenReady(startTime, responseJson);
      
    })
  
  
  }


  }

 

}

else{

if(this.firstEvent==true && this.secondEvent ==false || this.firstEvent==false && this.secondEvent ==true ){
  delete this.sendData['attributes'].secondLegendClass;
  delete this.sendData['attributes'].project_medium_compelte_color;

  if(this.firstEvent==true && this.secondEvent ==false){

    this.sendData['attributes'].firstLegendClass =this.thematique1 ;

    if(this.selectedTypeData == "ponctuel" ){

      this.sendData['attributes'].project_compelte_color =this.colorPointEvent1 ;
      await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3singlepoint/report.pdf",{
        method:'POST',
        headers:{'Content-Type':"application/json"},
        body: JSON.stringify(this.sendData)
      }).then(response =>{
      if(response.ok){
       return response.json();
      }
      throw new Error('request failed');}, networkError => console.log("chi le3ba") )
      .then(responseJson =>{
        console.log(responseJson)
        this.downloadWhenReady(startTime, responseJson);
        
      })

    }
    else if(this.selectedTypeData == "lineaire"){

      this.sendData['attributes'].project_compelte_color =this.strock_colorPpl1 ;
           console.log(this.sendData);
      await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3line/report.pdf",{
        method:'POST',
        headers:{'Content-Type':"application/json"},
        body: JSON.stringify(this.sendData)
      }).then(response =>{
      if(response.ok){
       return response.json();
      }
      throw new Error('request failed');}, networkError => console.log("chi le3ba") )
      .then(responseJson =>{
        console.log(responseJson)
        this.downloadWhenReady(startTime, responseJson);
        
      })

    }
  
  }else if(this.firstEvent==false && this.secondEvent ==true){

    this.sendData['attributes'].firstLegendClass =this.thematique2 ;

    if(this.selectedTypeData == "ponctuel" ){

      this.sendData['attributes'].project_compelte_color =this.colorPointEvent2;
      await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3singlepoint/report.pdf",{
        method:'POST',
        headers:{'Content-Type':"application/json"},
        body: JSON.stringify(this.sendData)
      }).then(response =>{
      if(response.ok){
       return response.json();
      }
      throw new Error('request failed');}, networkError => console.log("chi le3ba") )
      .then(responseJson =>{
        console.log(responseJson)
        this.downloadWhenReady(startTime, responseJson);
        
      })
      
    }
    else if(this.selectedTypeData == "lineaire"){

      this.sendData['attributes'].project_compelte_color =this.strock_colorPpl2 ;

      await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle3line/report.pdf",{
        method:'POST',
        headers:{'Content-Type':"application/json"},
        body: JSON.stringify(this.sendData)
      }).then(response =>{
      if(response.ok){
       return response.json();
      }
      throw new Error('request failed');}, networkError => console.log("chi le3ba") )
      .then(responseJson =>{
        console.log(responseJson)
        this.downloadWhenReady(startTime, responseJson);
        
      })

    }
  }


}
else{
    await fetch("http://localhost:8015/print-servlet-3.28.1/print/resource_bundle2/report.pdf",{
      method:'POST',
      headers:{'Content-Type':"application/json"},
      body: JSON.stringify(this.sendData)
    }).then(response =>{
    if(response.ok){
     return response.json();
    }
    throw new Error('request failed');}, networkError => console.log("chi le3ba") )
    .then(responseJson =>{
      console.log(responseJson)
      this.downloadWhenReady(startTime, responseJson);
      
    })
  }
 

}



  


  
}

 updateWaitingMsg(startTime, data) {
  var elapsed = Math.floor((new Date().getTime() - startTime) / 100);
  var time = '';
  if (elapsed > 5) {
      time = (elapsed / 10) +" sec";
  }
  // console.log('Waiting for report '+ time + ": " + data.ref );
  this.showToasterInfo(time, 'Waiting for report');

}


downloadWhenReady(startTime, data) {
  if ((new Date().getTime() - startTime) > 60000) {
    console.log('Gave up waiting after 60 seconds')
     // disableUI(false);
  } else {
      this.updateWaitingMsg(startTime, data);
      setTimeout( () =>{
          $.getJSON("http://localhost:8015" + data.statusURL,  (statusData)=> {
              if (!statusData.done) {
                  this.downloadWhenReady(startTime, data);
              } else {
                  console.log("zabzob22222222222")
                  window.open("http://localhost:8015" + statusData.downloadURL);
                  console.log('Downloading: '+data.ref);
                  this.showToasterSuccess('Opération bien effectué', 'carte a été crée');

                 // disableUI(false);

              }
          }, function error(data) {console.log('Error occurred requesting status');});
      }, 500);
  }
}


numberOfLinesF(val){
  console.log(val)
  this.numberOfLines = val.target.value
}
colorPointEvent2F(val){
  console.log(val)
  this.colorPointEvent2 = val.target.value
}
fillOpacityPointEvent2F(val){
  console.log(val)
  this.fillOpacityPointEvent2 = val.target.value
}
pointRadiusPointEvent2F(val){
  console.log(val)
  this.pointRadiusPointEvent2 = val.target.value
}
colorPointEvent1F(val){
  console.log(val)
  this.colorPointEvent1 = val.target.value
}
fillOpacityPointEvent1F(val){
  console.log(val)
  this.fillOpacityPointEvent1 = val.target.value
}
pointRadiusPointEvent1F(val){
  console.log(val)
  this.pointRadiusPointEvent1 = val.target.value
}

descriptionF(event){
this.description = event.target.value;
}


comlonne(event){
this.colonne = event.value;
console.log(this.colonne);

}
onchangetypeSort(val){
this.sorttype = val;
console.log(this.sorttype);

}


Opp(val){
if(val == "intersect"){
    this.verificationVal = false;
  }
  else this.verificationVal = true;
 
}


ApplyFilte(){
  this.filtre = this.filtre == true ? false:true;
  for(let i= 0;i<this.events.length;i++){
    if(this.events[i].name == this.selectedTh) this.currentthematiqueId = this.events[i].id
    if(this.events[i].name == this.selectedTh2) this.currentthematiqueId2 = this.events[i].id
  }

  if(this.firstEvent==true && this.secondEvent ==false || this.firstEvent==false && this.secondEvent ==true ){
    if(this.firstEvent==true && this.secondEvent ==false){
      if(this.selectedTypeData == "ponctuel"){
        this.selectedTypeData144 =  "ponctuel"
        this.selectedTh144 =  this.selectedTh
      }else{
        this.selectedTypeData144 =  "lineaire"
        this.selectedTh144 =  this.selectedTh
      }
    }
    if(this.firstEvent==false && this.secondEvent ==true){
      if(this.selectedTypeData == "ponctuel"){
        this.selectedTypeData144 =  "ponctuel"
        this.selectedTh144 =  this.selectedTh2
      }else{
        this.selectedTypeData144 =  "lineaire"
        this.selectedTh144 =  this.selectedTh2
      }
    }
  }
  if(this.firstEvent == true && this.secondEvent == true){

    console.error("error")
    console.log(this.object)
  this.object = {thematique1:this.currentthematiqueId,thematique2:this.currentthematiqueId2,pkEvent:this.val11}

    this.data1=[]
  //achraf aouad
  

  console.log("this.filtre",this.filtre)
  if(this.selectedTypeData == this.selectedTypeData2){
    if(this.selectedTypeData == "ponctuel"){
      this.rapport = 'pointPoint';
      this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PK_event", value:3},{name:"Route_id", value:4},{name:"nom de la route", value:5},{name:"voie", value:6}];

  this.lrsServiceService.MyIntersectionPOintToPoint(this.object).subscribe(res=>{
    
     console.log(res)
     for(let i= 0;i<res.length;i++){
       res[i]["ROUTE_GEOMETRY"] = { "type": "Point", "coordinates": new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['ROUTE_GEOMETRY'])).getGeometry()['flatCoordinates']}
       this.data1.push(res[i])
     }
     console.error("this.hahia");
     console.log(this.data1);

  },err=>{
   console.log(err)
  })


}
if(this.selectedTypeData == "lineaire")
{
 
    this.lrsServiceService.QueryLinearData2({thematique1:this.currentthematiqueId,thematique2:this.currentthematiqueId2}).subscribe(res=>{
      this.colonnes =  [{name:'id', value:1},{name:'évenement1', value:2},{name:'évenement2', value:3},{name:"PKD", value:4},{name:"PKD_1", value:5},{name:"PKF", value:6},{name:"PKF_1", value:7},{name:"route", value:8},{name:"voie", value:9}];


      console.log(res);
      for(let i= 0;i<res.length;i++){
        this.inter = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['INTERSECTION'])).getGeometry()['flatCoordinates']
        
      this.cordInter = [[]]
      this.cord0 = [[]]
      this.cord1 = [[]]
      let v = 0
      let j = 0
      let m = 0
      console.warn(this.inter)
      console.warn(this.inter[0])
      var validate = false;
   
    
    

      this.rt_geom = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['ROUTE_GEOMETRY'])).getGeometry()['flatCoordinates'];
     
      while(j<(this.rt_geom.length)){
     
        this.cord0[0].push([this.rt_geom[j],this.rt_geom[j+1]])
        j=j+2
       }


      res[i]['ROUTE_GEOMETRY'] =  { "type": "Polygon", "coordinates": this.cord0}

      this.rt_geom1 = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['ROUTE_GEOMETRY_1'])).getGeometry()['flatCoordinates']
      
      while(m<(this.rt_geom1.length)){
        this.cord1[0].push([this.rt_geom1[m],this.rt_geom1[m+1]]);
        m=m+2;
      }
     



      res[i]['ROUTE_GEOMETRY_1'] =  { "type": "Polygon", "coordinates": this.cord1}


      console.warn(this.inter[this.inter.length-2])
      if(this.inter.length >4&& this.inter[0] == this.inter[this.inter.length-2] ){
        while(v<(this.inter.length)){
          this.cordInter[0].push([this.inter[v],this.inter[v+1]])
          v=v+2
        }
        
        res[i]['INTERSECTION'] = { "type": "Polygon", "coordinates": this.cordInter}
      
      }else{
        res.splice(i,1)
        i--;
        validate = true
      }

      if(!validate){
        for(let j= 0;j<this.events.length;j++){
          if(this.events[j].id == res[i]["EVENT_TYPE_ID"]) res[i]["EVENT_TYPE_ID"] = this.events[j].name
          if(this.events[j].id == res[i]["EVENT_TYPE_ID_1"]) res[i]["EVENT_TYPE_ID_1"] = this.events[j].name
        }
        this.data1.push(res[i])
      }
      
    }
    console.error(this.data1)
    },(err)=>console.log(err))

}  
}
else if(this.selectedTypeData != this.selectedTypeData2){
  this.colonnes =  [{name:'id', value:1},{name:'évenement1', value:2},{name:'évenement2', value:3},{name:"PkEvent", value:4},{name:"PKD", value:5},{name:"PKF", value:6},{name:"route", value:7},{name:"voie", value:8}];



  if(this.selectedTypeData == 'lineaire'){
    this.th1 = this.currentthematiqueId2;
    this.th2 = this.currentthematiqueId;
  }
  else{
    this.th1 = this.currentthematiqueId;
    this.th2 = this.currentthematiqueId2;
  }
  console.log(this.th1,this.th2);

  this.lrsServiceService.queryLinearAndPonctual({thematique1:this.th1,thematique2:this.th2}).subscribe(res=>{
    // console.error(res)
    // console.log("achraf")
    this.cord0 = [[]]
    this.cord1 = [[]]
    let v = 0
    let j = 0


    for(let i= 0;i<res.length;i++){

    this.line = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['ROUTE_GEOMETRY_1'])).getGeometry()['flatCoordinates'];
    while(j<(this.line.length)){
      console.log(2)
      this.cord0[0].push([this.line[j],this.line[j+1]])
      j=j+2
     }
     res[i]['ROUTE_GEOMETRY_1'] =  { "type": "Polygon", "coordinates": this.cord0}

     this.point = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['ROUTE_GEOMETRY'])).getGeometry()['flatCoordinates'];

     res[i]['ROUTE_GEOMETRY'] =  { "type": "Point", "coordinates": this.point}

     for(let j= 0;j<this.events.length;j++){
      if(this.events[j].id == res[i]["EVENT_TYPE_ID"]) res[i]["EVENT_TYPE_ID"] = this.events[j].name
      if(this.events[j].id == res[i]["EVENT_TYPE_ID_1"]) res[i]["EVENT_TYPE_ID_1"] = this.events[j].name
    }

     this.data1.push(res[i]);
    }

  console.error(res)
  
  },err=>console.log(err))

}

  }

}

getAllEvents(){
  this.lrsServiceService.getEventypes().subscribe(res=>{this.events = res;console.log(res)},err=>{console.log(err)})
}

attribute(val){
  console.log(val)
  this.operateurs = []
  if(val.includes("d") || val == "pkd" || val == "pkf"|| val == "VOIE"|| val == "voie"|| val == "pkEvent"){
    this.operateurs = ['>','>=','<=','<','=']; 
    
  }
  if(val.includes("c") || val == "route_name")
    this.operateurs = ['=','like'];

this.selectedAttribute=val
    this.requette = this.requette + " and " + val;
    console.log(this.requette);



    this.getValues();
}


getParamsToAttribute(val){
  console.log(val)
  this.lrsServiceService.getEventParams(val).subscribe(res=>{
      console.log(res);
    for(var i of res){

      this.attributes.push(i)
      this.currentthematiqueId = i['eventType'].id;
      console.log(this.currentthematiqueId)
    }
    this.requette = this.requette + "EVENT_TYPE_ID = " + this.currentthematiqueId ;
   
  });
}


whatToshowIntheFilter(){
  if(this.firstEvent==true && this.secondEvent ==false || this.firstEvent==false && this.secondEvent ==true ){
    return false;
  }
  return true;
}

valueRequette(val){
  console.log(val)
  this.valueTO = val
}


getValues(){

    if(this.firstEvent==true && this.secondEvent ==false){
      for(let j= 0;j<this.events.length;j++){
         if(this.events[j]['name'] == this.selectedTh){
           console.log('this is the one');
           this.thmValuesOf = this.events[j]['id']
           console.log(this.thmValuesOf)
         }
      }
   
        this.object144={
          thematqueId:this.thmValuesOf,
          data:this.selectedTypeData,
          attribute:this.selectedAttribute
        }
       console.log(this.object144);
        this.lrsServiceService.getdistinctValues(this.object144).subscribe(res=>{
          this.valueTOs = res;
          console.log(res)
        },err=>console.log(err)
        )
      }
    if(this.firstEvent==false && this.secondEvent ==true ){
      for(let j= 0;j<this.events.length;j++){
         if(this.events[j]['name'] == this.selectedTh){
           console.log('this is the one');
           this.thmValuesOf = this.events[j]['id']
           console.log(this.thmValuesOf)
         }
      }

      this.object144={
        thematqueId:this.thmValuesOf,
        data:this.selectedTypeData2,
        attribute:this.selectedAttribute
      }
      this.lrsServiceService.getdistinctValues(this.object144).subscribe(res=>{
        this.valueTOs = res;
      },err=>console.log(err)
      )
    }
    


  

//   this.lrsServiceService.getDistinctValue()
}


applaySingleFiltre(){
if(!this.themtiqueTree){
  if(this.filtre == true){
   
  
  if(this.firstEvent==true && this.secondEvent ==false || this.firstEvent==false && this.secondEvent ==true ){
    this.data1=[]
    this.data2=[]
    if(this.firstEvent==true && this.secondEvent ==false){
      
      for(let j= 0;j<this.events.length;j++){
        if(this.events[j]['name'] == this.selectedTh){
          console.log('this is the one');
          this.thmValuesOf = this.events[j]['id']
          console.log(this.thmValuesOf)
        }
     }

      this.object123={
        thematiqueid:this.thmValuesOf,
        attribute:this.selectedAttribute,
        operateur:this.operateur,
        valeur:this.valueTO

      }
console.log(this.object123)
      if(this.selectedTypeData == "ponctuel"){
        this.selectedTypeData144 =  "ponctuel"
        this.selectedTh144 =  this.selectedTh
        console.log("ponctuel")
        this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PK_event", value:3},{name:"Route_id", value:4},{name:"nom de la route", value:5},{name:"voie", value:6}];
        //todo machi blastha
        console.log(this.object123)
        this.lrsServiceService.queryPonctuelDataForMap(this.object123).subscribe(res=>{
          for(let i= 0;i<res.length;i++){
            res[i]["ROUTE_GEOMETRY"] = { "type": "Point", "coordinates": new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates']}
            this.data1.push(res[i])
          }
          console.log(this.data1)
          console.log(res)
          
       },err=>{
        console.log(err)
       })

      }
      else if(this.selectedTypeData == "lineaire"){
        console.log("zomah1")
        this.selectedTypeData144 =  "lineaire"
        this.selectedTh144 =  this.selectedTh
      this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PKD", value:3},{name:"PKF", value:4},{name:"Route_id", value:5},{name:"nom de la route", value:6},{name:"voie", value:7}];
      this.lrsServiceService.queryLinearDataForMap(this.object123).subscribe(res=>{
        for(let i= 0;i<res.length;i++){
          let j = 0
          this.cord0 = [[]]
          this.rt_geom = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates'];
          while(j<(this.rt_geom.length)){
     
            this.cord0[0].push([this.rt_geom[j],this.rt_geom[j+1]])
            j=j+2
           }
    
    
          res[i]['ROUTE_GEOMETRY'] =  { "type": "Polygon", "coordinates": this.cord0}
          
          this.data1.push(res[i])


        }


      console.log(this.data1);
     },err=>{
      console.log(err)
     })

      }
    }

    if(this.firstEvent==false && this.secondEvent ==true){
      this.selectedAttribute
      for(let j= 0;j<this.events.length;j++){
        if(this.events[j]['name'] == this.selectedTh2){
          console.log('this is the one');
          this.thmValuesOf = this.events[j]['id']
          console.log(this.thmValuesOf)
        }
     }

      this.object123={
        thematiqueid:this.thmValuesOf,
        attribute:this.selectedAttribute,
        operateur:this.operateur,
        valeur:this.valueTO

      }
console.log(this.object123)
      if(this.selectedTypeData == "ponctuel"){
        this.selectedTypeData144 =  "ponctuel"
        this.selectedTh144 =  this.selectedTh2
        console.log("ponctuel")
        this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PK_event", value:3},{name:"Route_id", value:4},{name:"nom de la route", value:5},{name:"voie", value:6}];
        //todo machi blastha
        console.log(this.object123)
        this.lrsServiceService.queryPonctuelDataForMap(this.object123).subscribe(res=>{
          for(let i= 0;i<res.length;i++){
            res[i]["ROUTE_GEOMETRY"] = { "type": "Point", "coordinates": new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates']}
            this.data2.push(res[i])
          }
          console.log(this.data2)
          console.log(res)
       },err=>{
        console.log(err)
       })

      }
      else if(this.selectedTypeData == "lineaire"){
        this.selectedTypeData144 =  "lineaire"
        this.selectedTh144 =  this.selectedTh2
      this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PKD", value:3},{name:"PKF", value:4},{name:"Route_id", value:5},{name:"nom de la route", value:6},{name:"voie", value:7}];
      this.lrsServiceService.queryLinearDataForMap(this.object123).subscribe(res=>{
        for(let i= 0;i<res.length;i++){
          let j = 0
          this.cord0 = [[]]
          this.rt_geom = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates'];
          while(j<(this.rt_geom.length)){
     
            this.cord0[0].push([this.rt_geom[j],this.rt_geom[j+1]])
            j=j+2
           }
    
    
          res[i]['ROUTE_GEOMETRY'] =  { "type": "Polygon", "coordinates": this.cord0}
          
          this.data2.push(res[i])


        }


      console.log(this.data2);
     },err=>{
      console.log(err)
     })

      }
    }



  }
  }
}
  

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


addMore(){
  if(this.incriment > 3) this.incriment = 0;
  this.themtiqueTree = true;
  this.incriment ++;

if(this.singlethematique.length<3){
  if(this.firstEvent==true && this.secondEvent ==false){
      
    for(let j= 0;j<this.events.length;j++){
      if(this.events[j]['name'] == this.selectedTh){
        console.log('this is the one');
        this.thmValuesOf = this.events[j]['id']
        console.log(this.thmValuesOf)
      }
   }

    this.object123={
      thematiqueid:this.thmValuesOf,
      attribute:this.selectedAttribute,
      operateur:this.operateur,
      valeur:this.valueTO
    }

   console.log(this.object123)
    if(this.selectedTypeData == "ponctuel"){
      this.selectedTypeData144 =  "ponctuel"
      this.selectedTh144 =  this.selectedTh
      console.log("ponctuel")
      this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PK_event", value:3},{name:"Route_id", value:4},{name:"nom de la route", value:5},{name:"voie", value:6}];
      //todo machi blastha
      console.log(this.object123)
      this.lrsServiceService.queryPonctuelDataForMap(this.object123).subscribe(res=>{
        this.data1 = []
        for(let i= 0;i<res.length;i++){
          res[i]["ROUTE_GEOMETRY"] = { "type": "Point", "coordinates": new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates']}
          this.data1.push(res[i])
        }
        this.datas.push({id:this.incriment,data:this.data1})
        console.log(this.datas);
     },err=>{
      console.log(err)
     })

    }
    else if(this.selectedTypeData == "lineaire"){
      console.log("zomah")
      this.selectedTypeData144 =  "lineaire"
      this.selectedTh144 =  this.selectedTh
    this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PKD", value:3},{name:"PKF", value:4},{name:"Route_id", value:5},{name:"nom de la route", value:6},{name:"voie", value:7}];
    this.lrsServiceService.queryLinearDataForMap(this.object123).subscribe(res=>{
      this.data1 = []
      for(let i= 0;i<res.length;i++){
        let j = 0
        this.cord0 = [[]]
        this.rt_geom = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates'];
        while(j<(this.rt_geom.length)){
   
          this.cord0[0].push([this.rt_geom[j],this.rt_geom[j+1]])
          j=j+2
         }
  
  
        res[i]['ROUTE_GEOMETRY'] =  { "type": "Polygon", "coordinates": this.cord0}
        
        this.data1.push(res[i])


      }
      this.datas.push({id:this.incriment,data:this.data1})


    console.log(this.datas);
   },err=>{
    console.log(err)
   })

    }
  }
// ----------------------------------------------------------------------------------------------------------------------------------

  if(this.firstEvent==false && this.secondEvent ==true){
    this.selectedAttribute
    for(let j= 0;j<this.events.length;j++){
      if(this.events[j]['name'] == this.selectedTh2){
        console.log('this is the one');
        this.thmValuesOf = this.events[j]['id']
        console.log(this.thmValuesOf)
      }
   }

    this.object123={
      thematiqueid:this.thmValuesOf,
      attribute:this.selectedAttribute,
      operateur:this.operateur,
      valeur:this.valueTO

    }
 console.log(this.object123)
    if(this.selectedTypeData == "ponctuel"){
      this.selectedTypeData144 =  "ponctuel"
      this.selectedTh144 =  this.selectedTh2
      console.log("ponctuel")
      this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PK_event", value:3},{name:"Route_id", value:4},{name:"nom de la route", value:5},{name:"voie", value:6}];
      //todo machi blastha
      console.log(this.object123)
      this.lrsServiceService.queryPonctuelDataForMap(this.object123).subscribe(res=>{
        this.data2 = []
        for(let i= 0;i<res.length;i++){
          res[i]["ROUTE_GEOMETRY"] = { "type": "Point", "coordinates": new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates']}
          this.data2.push(res[i])
        }
        this.datas.push({id:this.incriment,data:this.data2})

        console.log(this.datas)
    
     },err=>{
      console.log(err)
     })

    }
    else if(this.selectedTypeData == "lineaire"){
      this.selectedTypeData144 =  "lineaire"
      this.selectedTh144 =  this.selectedTh2
    this.colonnes =  [{name:'id', value:1},{name:'évenement', value:2},{name:"PKD", value:3},{name:"PKF", value:4},{name:"Route_id", value:5},{name:"nom de la route", value:6},{name:"voie", value:7}];
    this.lrsServiceService.queryLinearDataForMap(this.object123).subscribe(res=>{
      this.data2 = []
      for(let i= 0;i<res.length;i++){
        let j = 0
        this.cord0 = [[]]
        this.rt_geom = new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeature(JSON.parse(res[i]['jsond'])).getGeometry()['flatCoordinates'];
        while(j<(this.rt_geom.length)){
   
          this.cord0[0].push([this.rt_geom[j],this.rt_geom[j+1]])
          j=j+2
         }
  
  
        res[i]['ROUTE_GEOMETRY'] =  { "type": "Polygon", "coordinates": this.cord0}
        
        this.data2.push(res[i]);
      }

      this.datas.push({id:this.incriment,data:this.data2})


    console.log(this.datas);
    console.log('linear');
   },err=>{
    console.log(err)
   })

    }
  }
}
 



  if(this.singlethematique.length<3){
    this.singlethematique.push({
      opp:this.operateur,
      value:this.valueTO,
      attr:this.selectedAttribute
    })
  }
  
   
    
  console.log(this.singlethematique);
}


}