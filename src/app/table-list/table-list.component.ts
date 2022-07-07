import { HttpErrorResponse, JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm ,Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LrsServiceService } from 'app/lrs-service.service';
import { Thematique } from 'app/Models/Thematique';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';
import FullScreen from 'ol/control/FullScreen';
import OverviewMap from 'ol/control/OverviewMap';
import ScaleLine from 'ol/control/ScaleLine';
import Zoom from 'ol/control/Zoom';
import olVectorLayer from "ol/layer/Vector";

import LayerGroup from 'ol/layer/Group';
import  DialogElementsExampleDialog  from './DialogContentExampleDialog';
import GeoJSON from "ol/format/GeoJSON";
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import CircleStyle from "ol/style/Circle";

import Fill from 'ol/style/Fill';
import Text from "ol/style/Text";
import Map from "ol/Map";
import View from "ol/View";
import LayerTile from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Stamen from "ol/source/Stamen";
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EtatStyle } from 'app/Models/EtatStyle';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { LineStyle } from 'app/Models/LineStyle';
import { LinearColor } from 'app/Models/LinearColor';
import { ColorLike } from 'ol/colorlike';
import { ACCIDENTStyle } from 'app/Models/AccidentStyle';
import { PointStyle } from 'app/Models/PointStyle';
import { of } from 'rxjs';
import { NotificationService } from 'app/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // csv
  csvRecords: any;
  header: boolean = false;
  headerTable: string[];
  dataLinePrev: String[] = [];
  dataPointPrev: String[] = [];
  verification: boolean;
  // csv
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }
  productForm: FormGroup;  

  fontStyleControl = new FormControl();
  fontStyleControlP = new FormControl();
  fontStyle?: string;
  dataLength: boolean = true;
  map:Map;

  osm = new LayerTile({
    visible: true,
    source: new OSM(),
  } );
  
   mapView = new View({
    center: [-5, 33],
    zoom: 8,
    projection: "EPSG:4326",
  });

  etatStyle= new EtatStyle("#f30707","#f30707","#f30707");
  SrcLinear_events: any;
  linear_events: any;
  reference:number;
  EtatRoute=new LineStyle(
    "Normal",
      "center",
      "middle",
      "0",
      "Arial",
      "Bold",
      "Point",
      "0.7853981633974483",
      true,
      "12px",
      "10",
      "0",
      "0",
      "#f30707",
      "#d9d9d9",
      "3",
      "38400"
  )
  
  accidentStyle= new PointStyle(
    10,"#f30707","#d9d9d9",5
  );

  linearColors = new LinearColor(
    "#d1df1e",
    "##539a59",
     3
  )
  openSansAdded: boolean;
  eventType: any;
  data: { eventType: any; LinearEvents: any; };
  saved;
  ThirdFormGroup: FormGroup;
  productFormP: any;
  AccidentLabeStyle=new LineStyle(
    "Normal",
      "center",
      "middle",
      "0",
      "Arial",
      "Bold",
      "Point",
      "0.7853981633974483",
      true,
      "12px",
      "10",
      "0",
      "0",
      "#f30707",
      "#d9d9d9",
      "3",
      "38400"
  )
  SrcPoint_events: any;
  PointEvent: any;
  mapPrevLine: Map;
  mapPrevPoint: Map;
  mediumLowAnnsrc: any;
  verificationCard = false;
  mediumLowAnn: any;
  verificationCard2 = false;
  verify = false;
  map144: Map;
  map125: any;
  mediumLowPointsrc: any;
  mediumLowPoint: olVectorLayer<any>;

  constructor(private lrsServiceService:LrsServiceService,private _formBuilder: FormBuilder,private ngxCsvParser: NgxCsvParser,public dialog: MatDialog,private fb:FormBuilder,    private notifyService : NotificationService, private spinner: NgxSpinnerService
    ) {
    this.getEtatLabelStyle();
    this.getAccidentLabelStyle();
   

  }

  //toggle button
  thmeatiqueName:string;
  thmeatiqueNameP:string;
  format = new GeoJSON();

    // csv
  @ViewChild('fileImportInput') fileImportInput: any;
  @ViewChild('fileImportInputP') fileImportInputP: any;
    // csv
   Animal = new Style({
      stroke: new Stroke({
        color: 'black',
    
        width: 1,
    
         lineDash: [4, 8]
      }),
    
      fill: new Fill({
        color: "#ff0000",
      }),
    })

 

  ngOnInit() {

    this.mediumLowAnnsrc = new VectorSource();

    this.mediumLowAnn = new olVectorLayer({
  
      source: this.mediumLowAnnsrc,

      style: this.Animal ,
    });


    this.mediumLowPointsrc = new VectorSource();
    
    this.mediumLowPoint = new olVectorLayer({
  
      source: this.mediumLowPointsrc,

      style: new Style({
           image: new CircleStyle({
             radius:this.accidentStyle.radius,
             fill: new Fill({color: <ColorLike>this.accidentStyle.color}),
             stroke: new Stroke({color: <ColorLike>this.accidentStyle.Ocolor, width: this.accidentStyle.strokWidht}),
           }),
         })
     
    
    })
 
    

  
  
  

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.ThirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrlP: ['', Validators.required],
      
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrlP: ['', Validators.required],
    });

    this.ThirdFormGroup = this._formBuilder.group({
      thirdCtrlP: ['', Validators.required],
    });


    this.productForm = this.fb.group({  
      name: '',  
      quantities: this.fb.array([]) ,  
    });  



    this.productFormP = this.fb.group({  
      name: '',  
      quantities: this.fb.array([]) ,  
    });  



    // this.initMap();
    // this.initMapP();

   

    setTimeout(() => {
      this.initMap();
      this.initMapP();
   
    //todo
      }, 500);




     
    

      


      

  }


  quantities() : FormArray {  
    return this.productForm.get("quantities") as FormArray  
  }  
  quantitiesP() : FormArray {  
    return this.productFormP.get("quantities") as FormArray  
  }  
     
  newQuantity(): FormGroup {  
    return this.fb.group({  
      attributes_table: '',  
      attributes_toSaveOnDataBase: '',  
    })  
  }  

  newQuantityLoaded(table:String,db:String): FormGroup {  
    return this.fb.group({  
      attributes_table: table,  
      attributes_toSaveOnDataBase: db,  
    })  
  }  
     
  addQuantity() {  
    if(this.productForm.value.quantities.length < this.headerTable.length)
    this.quantities().push(this.newQuantity());  
  }  

  addQuantityP() {  
    if(this.productFormP.value.quantities.length < this.headerTable.length)
    this.quantitiesP().push(this.newQuantity());  
  }  
     
  removeQuantity(i:number) {  
    this.quantities().removeAt(i);  
  }  
     
  removeQuantityP(i:number) {  
    this.quantitiesP().removeAt(i);  
  }  
     
  onSubmit() {  
    console.log(this.productForm.value);  
  }  


  verifyAttributes(){
    let val = false;

  
    for (var i = 0; i < this.productForm.value.quantities.length; i++) 
    {
        for (var j = 0; j < this.productForm.value.quantities.length; j++) 
        {
            if (i != j) 
            {
                if (this.productForm.value.quantities[i].attributes_table ==this.productForm.value.quantities[j].attributes_table ||this.productForm.value.quantities[j].attributes_table == '' ) 
                {
                    return false; // means there are duplicate values
                }
                if (this.productForm.value.quantities[i].attributes_toSaveOnDataBase ==this.productForm.value.quantities[j].attributes_toSaveOnDataBase || this.productForm.value.quantities[j].attributes_toSaveOnDataBase =='') 
                {
                    return false; // means there are duplicate values
                }
            }
        }
    }
    if(this.productForm.value.quantities.length ==0) return false;
    if(this.productForm.value.quantities.length != this.headerTable.length) return false;
    return true;

  }

  verifyAttributesP(){
    let val = false;

  
    for (var i = 0; i < this.productFormP.value.quantities.length; i++) 
    {
        for (var j = 0; j < this.productFormP.value.quantities.length; j++) 
        {
            if (i != j) 
            {
                if (this.productFormP.value.quantities[i].attributes_table ==this.productFormP.value.quantities[j].attributes_table ||this.productFormP.value.quantities[j].attributes_table == '' ) 
                {
                    return false; // means there are duplicate values
                }
                if (this.productFormP.value.quantities[i].attributes_toSaveOnDataBase ==this.productFormP.value.quantities[j].attributes_toSaveOnDataBase || this.productFormP.value.quantities[j].attributes_toSaveOnDataBase =='') 
                {
                    return false; // means there are duplicate values
                }
            }
        }
    }
    if(this.productFormP.value.quantities.length ==0) return false;
    if(this.productFormP.value.quantities.length != this.headerTable.length) return false;
    return true;

  }

  


  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.header = true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;

          this.headerTable = Object.keys(this.csvRecords[0])
          this.verification = true;
        
          if(this.headerTable.includes("route_name")&& this.headerTable.includes("pkd") && this.headerTable.includes("pkf") && this.headerTable.includes("voie")){
            this.verification = false;
          }
          

          this.lrsServiceService.addTableToView(this.csvRecords);
          

        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });
  }

  fileChangeListenerP($event: any): void {

    const files = $event.srcElement.files;
    this.header = true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;

          this.headerTable = Object.keys(this.csvRecords[0])
          this.verification = true;
        
          if(this.headerTable.includes("route_name")&& this.headerTable.includes("pkEvent") && this.headerTable.includes("voie")){
            this.verification = false;
          }
          

          this.lrsServiceService.addTableToView(this.csvRecords);
          

        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });
  }

  validatorw(value){
    console.log(value)
    if(value == "route_name" || value == "pkd" ||value == "pkf" ||value == "voie" ){
      return true;
    }
    return false;
  }



    
     
print(){
 console.warn(this.firstFormGroup.value) 
}  
print2(){
 console.warn(this.secondFormGroup.value) 
}  
 

openDialog() {
  this.dialog.open(DialogElementsExampleDialog);
  
}

verificaionImportTh(){
  if(this.fontStyleControl.value == 'non' || this.fontStyleControl.value == '' || !this.productForm.value['name']) return true

}

verificaionImportThP(){
  if(this.fontStyleControlP.value == 'non' || this.fontStyleControlP.value == '' || !this.productFormP.value['name']) return true

}

loadConfigration(){
  if(this.thmeatiqueName != ""){
    this.lrsServiceService.getEventParams(this.thmeatiqueName).subscribe(data=>{
      this.showToasterSuccess('loading Events Successfully', 'Opération bien efectuée');

    
      this.spinner.show(); 
       

setTimeout(() => {
  /** spinner ends after 5 seconds */
  this.spinner.hide();
}, 5000);
       this.dataLength = false;
      if(data.length>0){
        for(let i=0;i<(this.headerTable.length - data.length) ;i++){
          this.addQuantity();
        }
        for(let i = 0;i<data.length ; i++){
          this.quantities().push(this.newQuantityLoaded(data[i]['champs_event'],data[i]['champ_db_stock']));  
        }
      }


      //todo
      if(data[0]['eventType'].style){

        this.linearColors = new LinearColor(JSON.parse(data[0]['eventType'].style).remplissageC,JSON.parse(data[0]['eventType'].style).colorBor,JSON.parse(data[0]['eventType'].style).strock)
      }
      console.log("hahowa zamel", this.linearColors)
    

 

       
    
     },(err: HttpErrorResponse) => {
       this.dataLength = true;
          console.log(err);
    } )
  }
}

loadConfigrationP(){
  if(this.thmeatiqueNameP != ""){
    //a voir 
    this.lrsServiceService.getEventParams(this.thmeatiqueNameP).subscribe(data=>{
      this.spinner.show(); 
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 5000);
       this.dataLength = false;
      if(data.length>0 && this.productFormP.value['quantities'].length ==0 ){
        for(let i=0;i<(this.headerTable.length - data.length) ;i++){
          this.addQuantityP();
        }
        for(let i = 0;i<data.length ; i++){
          this.quantitiesP().push(this.newQuantityLoaded(data[i]['champs_event'],data[i]['champ_db_stock']));  
        }
      }


      console.warn(data[0]['eventType'].pointStyle)
      if(data[0]['eventType'].pointStyle){
        this.linearColors = JSON.parse(data[0]['eventType'].pointStyle)

        this.accidentStyle = new PointStyle(JSON.parse(data[0]['eventType'].pointStyle).radius,JSON.parse(data[0]['eventType'].pointStyle).color,JSON.parse(data[0]['eventType'].pointStyle).Ocolor,JSON.parse(data[0]['eventType'].pointStyle).strokWidht)

      }
    

 

       
    
     },(err: HttpErrorResponse) => {
       this.dataLength = true;
          console.log(err);
    } )
  }
}

fontStyleControlV(){
  if(this.fontStyleControl.value == 'oui' ){
    return true
  }
  return false;
}




onTabChange(event: MatTabChangeEvent) {
  if (event.tab.ariaLabel && event.tab.ariaLabel == 'myMapTab') {

      
      this.initMapP();
     
     
}
}


initMap(){
  this.map125 = new Map({
    target: "map1",
    layers: [new LayerTile({
      visible: true,
      source: new OSM(),
    } )],
    controls: [
      new FullScreen(),
      new Zoom(),
      new ScaleLine({ bar: true }),
    ],
    view:  new View({
      center: [-5, 33],
      zoom: 8,
      projection: "EPSG:4326",
    }),
  });

  this.getEtatLabelStyle();


  this.SrcLinear_events = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        'http://localhost:8081/geoserver/i2singineerie/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=2singineerie:LINEAR_EVENT&' +
        'outputFormat=application/json&srsname=EPSG:4326&'+
        'bbox=' +
        extent.join(',') +
        ',EPSG:4326'
      )},
      strategy: bboxStrategy,
      
      
  })

 
  this.linear_events = new VectorLayer({
   
    source: this.SrcLinear_events,
    style: (feature, resolution)=>{
      
        var colorToUse = "#fffff";
        
      return new Style({
        fill: new Fill({color:<ColorLike>this.linearColors.remplissageC}),
        stroke: new Stroke({
          color: <ColorLike> this.linearColors.colorBor,
          width: this.linearColors.strock,
        }),
        text: this.createTextStyle(feature, resolution, this.EtatRoute,"etatRoute"),

      });
    },
  });




  this.map125.addLayer(this.linear_events);
  
  this.linear_events.getSource().on('addfeature', () =>{
    this.map125.getView().fit(
        this.linear_events.getSource().getExtent(),
        { duration: 1500, size: this.map125.getSize(), maxZoom: 24 }
    );
});


}


initMapP(){
  if(!this.verify){
  this.map144 = new Map({
    target: "map2",
    layers: [new LayerTile({
      visible: true,
      source: new OSM(),
    } )],
    controls: [
    ],
    view:  new View({
      center: [-5, 33],
      zoom: 8,
      projection: "EPSG:4326",
    }),
  });

  this.getAccidentLabelStyle();


  this.SrcPoint_events = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        'http://localhost:8081/geoserver/i2singineerie/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=i2singineerie:PONCTUEL_EVENTS&' +
        'outputFormat=application/json&srsname=EPSG:4326&'+
        'bbox=' +
        extent.join(',') +
        ',EPSG:4326'
      )},
      strategy: bboxStrategy,
  })

 
  this.PointEvent = new VectorLayer({
    source: this.SrcPoint_events,
    style: (feature,resolution)=>{

     return  new Style({
        image: new CircleStyle({
          radius:this.accidentStyle.radius,
          fill: new Fill({color: <ColorLike>this.accidentStyle.color}),
          stroke: new Stroke({color: <ColorLike>this.accidentStyle.Ocolor, width: this.accidentStyle.strokWidht}),
        }),
        text: this.createTextStyle(feature, resolution, this.AccidentLabeStyle,"etatRoute"),
      });
  },
});




  this.map144.addLayer(this.PointEvent);
  
  this.PointEvent.getSource().on('addfeature', () =>{
    this.map144.getView().fit(
        this.linear_events.getSource().getExtent(),
        { duration: 200, size: this.map144.getSize(), maxZoom: 24 }
    );
});



}}



initMapEventP(){
  if(!this.verify){
    setTimeout(()=>{
      this.mapPrevPoint = new Map({
        target: "mapPrevPoint",
        layers: [],
        controls: [
          new FullScreen(),
          new Zoom(),
          new ScaleLine({ bar: true }),
        ],
        view:  new View({
          center: [-5, 33],
          zoom: 8,
          projection: "EPSG:4326",
        }),
      });


      this.mapPrevPoint.addLayer(new LayerTile({
        visible: true,
        source: new OSM(),
      } ));
      
      this.mapPrevPoint.addLayer(this.mediumLowPoint);

      this.verify = true;

    },1000)
   
  

}}




createTextStyle (feature, resolution, dom,type) {

  if(feature){
    const align = dom?.align;
    const baseline = dom?.baseline;
    const size = dom.size;
    const height = dom?.height;
    const offsetX = parseInt(dom?.offsetX, 10);
    const offsetY = parseInt(dom?.offsetY, 10);
    const weight = dom?.weight;
    const placement = dom?.placement ? dom?.placement: undefined;
    const maxAngle = dom?.maxangle ? parseFloat(dom?.maxangle) : undefined;
    const overflow = dom?.overflow ? dom?.overflow == 'true' : undefined;
    const rotation = parseFloat(dom?.rotation);
    if (dom?.font == "'Open Sans'" && !this.openSansAdded) {
      const openSans = document.createElement('link');
      openSans.href = 'https://fonts.googleapis.com/css?family=Open+Sans';
      openSans.rel = 'stylesheet';
      document.getElementsByTagName('head')[0].appendChild(openSans);
      this.openSansAdded = true;
    }
    const font = weight + ' ' + size + '/' + height + ' ' + dom?.font;
    const fillColor = dom?.color;
    const outlineColor = dom?.outline;
    const outlineWidth = parseInt(dom?.outlineWidth, 10);
    return new Text({
       textAlign: align == '' ? undefined : align,
       textBaseline: baseline,
       font: font,
      text: this.getText(feature, resolution, dom,type),
      fill: new Fill({color: fillColor}),
      stroke: new Stroke({color: outlineColor, width: outlineWidth}),
       offsetX: offsetX,
       offsetY: offsetY,
       placement: placement,
       maxAngle: maxAngle,
       overflow: overflow,
       rotation: rotation,
    });
  }
       
    };


    getText(feature, resolution, dom,typeLayer) {
      const type = dom?.text.value;
      const maxResolution = dom?.maxreso.value;
      let text;
  
      if(typeLayer == "lrsRoute") text = feature.get('ROUTE_NAME');
      else if(typeLayer == "etatRoute") text = feature.get('ROUTE_NAME');
      else text = feature.get('nom');
      if (resolution > maxResolution) {
        text = '';
      } else if (type == 'hide') {
        text = '';
      } else if (type == 'shorten') {
        text = text.trunc(12);
      } else if (
        type == 'wrap' &&
        (!dom?.placement || dom?.placement.value != 'line')
      ) {
        text = this.stringDivider(text, 16, '\n');
      }
    
      return text;
    };

    stringDivider(str, width, spaceReplacer) {
      if (str.length > width) {
        let p = width;
        while (p > 0 && str[p] != ' ' && str[p] != '-') {
          p--;
        }
        if (p > 0) {
          let left;
          if (str.substring(p, p + 1) == '-') {
            left = str.substring(0, p + 1);
          } else {
            left = str.substring(0, p);
          }
          const right = str.substring(p + 1);
          return left + spaceReplacer + this.stringDivider(right, width, spaceReplacer);
        }
      }
      return str;
    }


    onUpdateStyleColors(){


      console.warn(this.linearColors)
      console.warn("zobob")
      console.error(this.linearColors);
      var data = {
        eventType:this.productForm.value['name'],
        colors:JSON.stringify(this.linearColors.getObjStyle)
       }
       this.lrsServiceService.onUpdateStyleColors(data).subscribe((res) => {
         console.warn("data jdida");
        
        this.getEtatLabelStyle();
     },
     (err:HttpErrorResponse)=>{ console.log(err)})

    }


    onUpdateStyleColorsP(){

      var data = {
        eventType:this.productFormP.value['name'],
        colors:JSON.stringify(this.accidentStyle.getObjStyle)
       }

       console.warn(data);

       this.lrsServiceService.onUpdateStyleColorsP(data).subscribe((res) => {

        // this.getEtatLabelStyle();
     },
     (err:HttpErrorResponse)=>{ console.log(err)})



    }



    onLabelEtatEdit(){
     
      var data = {
       symbology_id:9,
       symbology:JSON.stringify(this.EtatRoute.getObjStyle)
      }
 
     this.lrsServiceService.updateStyle(data).subscribe((res) => {
       
       
        this.getEtatLabelStyle();
 
 
     
     },
     (err:HttpErrorResponse)=>{ console.log(err)})
 
 
   }

   onAccidentEtatEdit(){
     
    var data = {
     symbology_id:11,
     symbology:JSON.stringify(this.AccidentLabeStyle.getObjStyle)
    }

   this.lrsServiceService.updateStyle(data).subscribe((res) => {
     
     
     this.getAccidentLabelStyle();


   
   },
   (err:HttpErrorResponse)=>{ console.log(err)})


 }



  


   getEtatLabelStyle(){
    this.lrsServiceService.getStyleById(9).subscribe(
    (res) => {
      
      this.EtatRoute = new LineStyle(
        res.text,
        res.align,
        res.baseline,
        res.rotation,
        res.font,
        res.weight,
        res.placement,
        res.maxangle,
        res.overflow,
        res.size,
        res.height,
        res.offsetX,
        res.offsetY,
        res.color,
        res.outline,
        res.outlineWidth,
        res.maxreso
      );

      console.warn(this.EtatRoute);
    
    },
    (err:HttpErrorResponse)=>{ console.log(err)}
  )
}
getAccidentLabelStyle(){
  this.lrsServiceService.getStyleById(11).subscribe(
  (res) => {
    
    this.AccidentLabeStyle = new LineStyle(
      res.text,
      res.align,
      res.baseline,
      res.rotation,
      res.font,
      res.weight,
      res.placement,
      res.maxangle,
      res.overflow,
      res.size,
      res.height,
      res.offsetX,
      res.offsetY,
      res.color,
      res.outline,
      res.outlineWidth,
      res.maxreso
    );

  
  },
  (err:HttpErrorResponse)=>{ console.log(err)}
)
}





   onSubmitAddLayer(){
     
       for(let i =0;i<this.csvRecords.length;i++){
         console.log(this.csvRecords[i])
         for(let j= 0;j<this.headerTable.length;j++){
           if(this.csvRecords[i][`${this.productForm.value['quantities'][j]['attributes_toSaveOnDataBase']}`]  != this.csvRecords[i][`${this.productForm.value['quantities'][j]['attributes_table']}`]){
            this.csvRecords[i][`${this.productForm.value['quantities'][j]['attributes_toSaveOnDataBase']}`] = this.csvRecords[i][`${this.productForm.value['quantities'][j]['attributes_table']}`]
            delete this.csvRecords[i][`${this.productForm.value['quantities'][j]['attributes_table']}`];
           }

         }
          
       }


       
     


      //  for(let i=0;i<this.csvRecords.length;i++){
         let myDb =["Actif","route_name","pkd","pkf","voie","c1","c2","c3","d1","d2","d3","t1","t2","t3"]
         
         console.warn(Object.keys(this.csvRecords[0]));
        var keysToADd = myDb.filter(world =>{
          if(Object.keys(this.csvRecords[0]).includes(world)){
            return false 
          }
          return true
        })
        for(let i =0;i<this.csvRecords.length;i++){
          for(let j=0;j<keysToADd.length;j++){
            this.csvRecords[i][keysToADd[j]] =''
            this.csvRecords[i]['eventType'] = this.productForm.value['name'];
          }
        }

        console.log(this.csvRecords);
     
         
       
       console.log(this.csvRecords);

       
      

       if(this.fontStyleControl.value == 'oui' ){
      
      this.lrsServiceService.addExistantEventoRoutes(this.csvRecords).subscribe(res=>{
        this.onLabelEtatEdit();

        this.spinner.show(); 
       

        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 5000);

        this.showToasterSuccess('Opération bien effectué', 'Section a été ajouté');

       //
       this.onUpdateStyleColors();
        console.log(res)
      }, (err:HttpErrorResponse)=>{this.showToasterWarning('something goes wrong', err.message)})
    }

    if(this.fontStyleControl.value == 'non' || !this.fontStyleControl.value){
      if(this.verifyAttributes()){
        if(this.productForm.value['name']){
          var verification = ["Actif","route_name","pkd","pkf","voie"];

          this.lrsServiceService.saveEventType(this.productForm.value['name']).subscribe(res=>{
             
            for(let i=0;i<this.productForm.value['quantities'].length;i++){
              if(!verification.includes(this.productForm.value['quantities'][i]['attributes_toSaveOnDataBase'])){

                this.saved={
                  champ_db_stock:this.productForm.value['quantities'][i]['attributes_toSaveOnDataBase'],
                  champs_event:this.productForm.value['quantities'][i]['attributes_table'],
                  id_event:res
                }
                this.lrsServiceService.addParams(this.saved).subscribe(res=>{

                  this.lrsServiceService.addExistantEventoRoutes(this.csvRecords).subscribe(res=>{
                    this.onLabelEtatEdit();
                    this.spinner.show(); 
       

                  setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.spinner.hide();
                  }, 5000);
                    this.showToasterSuccess('Opération bien effectué', 'Section a été ajouté');

                   //
                   this.onUpdateStyleColors();
                    console.log(res)
                  }, (err:HttpErrorResponse)=>{this.showToasterWarning('something goes wrong', err.message);})


                },(err:HttpErrorResponse)=>{console.log(err)})
              }
            }
          },(err:HttpErrorResponse)=>{console.log(err)})

        }
      }

    }



     
   }






   onSubmitAddPointLayer(){




      for(let i =0;i<this.csvRecords.length;i++){
        console.log(this.csvRecords[i])
        for(let j= 0;j<this.headerTable.length;j++){
          if(this.csvRecords[i][`${this.productFormP.value['quantities'][j]['attributes_toSaveOnDataBase']}`]  != this.csvRecords[i][`${this.productFormP.value['quantities'][j]['attributes_table']}`]){
           this.csvRecords[i][`${this.productFormP.value['quantities'][j]['attributes_toSaveOnDataBase']}`] = this.csvRecords[i][`${this.productFormP.value['quantities'][j]['attributes_table']}`]
           delete this.csvRecords[i][`${this.productFormP.value['quantities'][j]['attributes_table']}`];
          }

        }
         
      }
 

      
   


     //  for(let i=0;i<this.csvRecords.length;i++){
        let myDb =["Actif","route_name","pkEvent","voie","c1","c2","c3","d1","d2","d3","t1","t2","t3"]
        
        console.warn(Object.keys(this.csvRecords[0]));
       var keysToADd = myDb.filter(world =>{
         if(Object.keys(this.csvRecords[0]).includes(world)){
           return false 
         }
         return true
       })
       for(let i =0;i<this.csvRecords.length;i++){
         for(let j=0;j<keysToADd.length;j++){
           this.csvRecords[i][keysToADd[j]] =''
           this.csvRecords[i]['eventType'] = this.productFormP.value['name'];
         }
       }

       console.log(this.csvRecords);
    
        
      
      console.log(this.csvRecords);

      
     

      if(this.fontStyleControlP.value == 'oui' ){
     
     this.lrsServiceService.addExistantPointEventoRoutes(this.csvRecords).subscribe(res=>{
       this.onAccidentEtatEdit();
       this.showToasterSuccess('Opération bien effectué', 'Section a été ajouté');
       this.spinner.show(); 
       

setTimeout(() => {
  /** spinner ends after 5 seconds */
  this.spinner.hide();
}, 5000);
      //todo
      this.onUpdateStyleColorsP();
       console.log(res)
     }, (err:HttpErrorResponse)=>{
      this.showToasterWarning('something goes wrong', err.message);

    })
   }

   if(this.fontStyleControlP.value == 'non' || !this.fontStyleControlP.value){
     console.warn("1111111111111111111")
     console.warn(this.fontStyleControlP.value)

     if(this.verifyAttributesP()){
      console.warn("222222222222222222")
      console.warn(this.verifyAttributesP())

       if(this.productFormP.value['name']){
        console.warn("333333333333333333333")
         var verification = ["Actif","route_name","PkEvent","voie"];

         this.lrsServiceService.saveEventType(this.productFormP.value['name']).subscribe(res=>{
            
           for(let i=0;i<this.productFormP.value['quantities'].length;i++){
             if(!verification.includes(this.productFormP.value['quantities'][i]['attributes_toSaveOnDataBase'])){

               this.saved={
                 champ_db_stock:this.productFormP.value['quantities'][i]['attributes_toSaveOnDataBase'],
                 champs_event:this.productFormP.value['quantities'][i]['attributes_table'],
                 id_event:res
               }
               this.lrsServiceService.addParams(this.saved).subscribe(res=>{

                this.lrsServiceService.addExistantPointEventoRoutes(this.csvRecords).subscribe(res=>{
                  this.onAccidentEtatEdit();
                  this.showToasterSuccess('Opération bien effectué', 'Section a été ajouté');
                  this.spinner.show(); 
       

                  setTimeout(() => {
                    /** spinner ends after 5 seconds */
                    this.spinner.hide();
                  }, 5000);
                 //todo
                 this.onUpdateStyleColorsP();
                  console.log(res)
                }, (err:HttpErrorResponse)=>{this.showToasterWarning('something goes wrong', err.message);this.showToasterWarning('something goes wrong', err.message);})


               },(err:HttpErrorResponse)=>{console.log(err)})
             }
           }
         },(err:HttpErrorResponse)=>{console.log(err)})

       }
     }

   }



    
  }


  previewLineData(){
    this.mediumLowAnnsrc.clear();
    if(this.csvRecords){
      
      if(!this.verificationCard){
        setTimeout(()=>{
          this.mapPrevLine = new Map({
            target: "mapPrevLine",
            layers: [  ],
            controls: [
            
            ],
            view: new View({
              center: [-5, 33],
              zoom: 8,
              projection: "EPSG:4326",
            }),
          });

          this.mapPrevLine.addLayer(new LayerTile({
            visible: true,
            source: new OSM(),
          } ));
          this.mapPrevLine.addLayer(this.mediumLowAnn);
        },1000)
        this.verificationCard =true;
      }
      
 setTimeout(()=>{
  for(let i=0;i<this.csvRecords.length;i++){
    console.log(this.csvRecords.length)
    console.log(this.csvRecords.length)
    console.log(this.csvRecords)
    this.lrsServiceService.previewLineResult(this.csvRecords[i]).subscribe((res)=>{ 
      console.warn(res)
      for(let i =0;i<res.length;i++){
        this.dataLinePrev.push(res[i]);

      }

      console.error(this.dataLinePrev)

      this.dataLinePrev.forEach((item:any) => {
        
        console.warn(item);
       this.mediumLowAnnsrc.addFeatures(
         this.format.readFeatures(JSON.parse(item), { featureProjection: "EPSG:4326" })
       );

      
    
     }) 

     this.mediumLowAnnsrc.on('addfeature', () =>{
      this.mapPrevLine.getView().fit(
          this.mediumLowAnnsrc.getExtent(),
          { duration: 200, size: this.mapPrevLine.getSize(), maxZoom: 24 }
      );
  });



    })
  }





 },1200)
}
  }


  previewPointData(){
    this.mediumLowPointsrc.clear();
    if(this.csvRecords){
      
      if(!this.verify){

        this.initMapEventP();
      }
   setTimeout(()=>{
    for(let i=0;i<this.csvRecords.length;i++){
      console.log(this.csvRecords.length)
      console.log(this.csvRecords.length)
      console.log(this.csvRecords)
      this.lrsServiceService.previewPointResult(this.csvRecords[i]).subscribe((res)=>{
        console.warn(res)
        console.warn("fffffffffffffffffff")
        
        for(let i =0;i<res.length;i++){
          this.dataPointPrev.push(res[i]);

        }

        

        console.error(this.dataPointPrev)

        this.dataPointPrev.forEach((item:any) => {
          console.log("zobob");
          console.warn(item);
         this.mediumLowPointsrc.addFeatures(
           this.format.readFeatures(JSON.parse(item), { dataProjection: "EPSG:4326",featureProjection: this.mapPrevPoint.getView().getProjection() })
         );
          
         console.warn('zomah');
         console.warn(this.mediumLowPointsrc);

        
       }) 

      

        this.mediumLowPointsrc.on('addfeature', () =>{
          this.mapPrevPoint.getView().fit(
              this.mediumLowPointsrc.getExtent(),
              { duration: 1000, size: this.mapPrevPoint.getSize(), maxZoom: 24 }
          );
      });
       
       



      })
    }

  console.warn(this.mediumLowPointsrc);

  console.warn(this.mediumLowPointsrc.getFeatures());

   },1200)
        
     
      

      

   
    
  
  }
  }
   ff:string = "route_name,pkd,pkf,voie" + "\n" + " majd,0,700,1"
   ff2:string = "route_name,pkEvent,voie" + "\n" + "Route,10,1"
  jsonDataEport() {
    return of(
      this.ff
      
      );
    }
  jsonDataEport1() {
    return of(
      this.ff2
      
      );
    }

  async dynamicDownloadJson() {
    await this.previewLineData()
    this.jsonDataEport().subscribe((res) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'My Report.csv',
        text: JSON.stringify(res)
      });
    });
  }
  async dynamicDownloadJson1() {
    await this.previewLineData()
    this.jsonDataEport1().subscribe((res) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'My Report.csv',
        text: JSON.stringify(res)
      });
    });
  }

 private dyanmicDownloadByHtmlTag(arg: {
      fileName: string,
      text: string
    }) {
      if (!this.setting.element.dynamicDownload) {
        this.setting.element.dynamicDownload = document.createElement('a');
      }
      const element = this.setting.element.dynamicDownload;
      const fileType = arg.fileName.indexOf('.csv') > -1 ? 'text/csv' : 'text/plain';
      element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
      element.setAttribute('download', arg.fileName);
  
      var event = new MouseEvent("click");
      element.dispatchEvent(event);
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










