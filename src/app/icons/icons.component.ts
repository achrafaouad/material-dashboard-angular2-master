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

import { of } from 'rxjs';
import { NotificationService } from 'app/notification.service';
 

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
  selected
  selectedTh
  selectedTh2
  selectedAttribute
  operateur
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
 
  constructor(private lrsServiceService: LrsServiceService,private notifyService : NotificationService) {

    this.getAllParams();
    
   }
/////////////////////////////
  columnDefs: ColDef[] = [];
  tempsDefs: Object = {};

rowData = [];

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
Animal1 = new Style({
  stroke: new Stroke({
    color: 'black',

    width: 1,

     lineDash: [4, 8]
  }),

  fill: new Fill({
    color: "#34dcee",
  }),
})
Animal2 = new Style({
  stroke: new Stroke({
    color: 'black',

    width: 1,

     lineDash: [4, 8]
  }),

  fill: new Fill({
    color: "#34dcee",
  }),
})
public defaultColDef: ColDef = {
  resizable: true,
};
/////////////////////////////


  ngOnInit() {

    this.mediumLowAnnsrcevent1 = new VectorSource();
    this.mediumLowAnnsrcevent2 = new VectorSource();

    this.mediumLowAnnsrcevent1 = new VectorSource();

    this.mediumLowAnn1 = new olVectorLayer({
  
      source: this.mediumLowAnnsrcevent1,

      style: this.Animal1 ,
    });
    this.mediumLowAnnsrcevent2 = new VectorSource();

    this.mediumLowAnn2 = new olVectorLayer({
  
      source: this.mediumLowAnnsrcevent2,

      style: this.Animal2 ,
    });


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
             radius:5,
             fill: new Fill({color: "#5ff300"}),
             stroke: new Stroke({color: "#fefefe", width: 2}),
           }),
         })
        });

    


    

    this.lrsServiceService.getAllEventType().subscribe(res=>{
      this.thematique = res;
    }, (err:HttpErrorResponse)=>{
      this.showToasterWarning('something goes wrong', err.message)
    })
    this.lrsServiceService.getEventypes().subscribe(res=>{
       this.idth = res;
    }, (err:HttpErrorResponse)=>{
      this.showToasterWarning('something goes wrong', err.message)
    })

    this.mediumLowPointsrc.on('addfeature', () =>{
      this.mapPrevLine.getView().fit(
          this.mediumLowPointsrc.getExtent(),
          { duration: 1000, size: this.mapPrevLine.getSize(), maxZoom: 18 }
      );
    });

    this.mediumLowAnnsrc.on('addfeature', () =>{
      this.mapPrevLine.getView().fit(
          this.mediumLowAnnsrc.getExtent(),
          { duration: 1000, size: this.mapPrevLine.getSize(), maxZoom: 18 }
      );
    });
    
  }

  onchange22(val){
    
 
      console.log(val)
      this.th = val
      this.lrsServiceService.getEventParams(val).subscribe(res=>{
        
        for(var i of res){

          this.currentthematiqueId2 = i['eventType'].id;
          console.log(this.currentthematiqueId)
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

        

       

      });
  }

  onchange(val){


      console.log(val)
      this.th = val
      this.lrsServiceService.getEventParams(val).subscribe(res=>{
        
        for(var i of res){
  
          this.attributes.push(i)
          this.currentthematiqueId = i['eventType'].id;
          console.log(this.currentthematiqueId)
        }
        this.requette = this.requette + "EVENT_TYPE_ID = " + this.currentthematiqueId ;
       
      });

    

    
    if(this.selectRequettype == "2"){
      if(this.selectedTypeData == this.selectedTypeData2){
        if(this.selectedTypeData == "ponctuel"){
          this.operateurs = [ "ont la meme PK" ] 
        }

      }
    }
    

  }


  onchangeDonne(val){
    this.attributes = []


    this.donnee = val;
    if(this.requette == "select * from "){
      if(val == "lineaire"){
        this.requette = this.requette + "Linear_Event where "
      }
      if(val == "ponctuel"){
        this.requette = this.requette + "ponctuel_Events where "
      }
    }
    if(val == "lineaire") this.attributes = [{champs_event:"pkd", champ_db_stock:"pkd"}, {champs_event:"pkf", champ_db_stock:"pkf"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"voie", champ_db_stock:"voie"}];
    if(val == "ponctuel") this.attributes = [{champs_event:"pkEvent", champ_db_stock:"pkEvent"},{champs_event:"route_name", champ_db_stock:"route_name"} ,{champs_event:"VOIE", champ_db_stock:"VOIE"}];

  }


  attribute(val){
    console.log(val)
    this.operateurs = []
    if(val.includes("d") || val == "pkd" || val == "pkf"|| val == "VOIE"|| val == "voie"|| val == "pkEvent"){
      this.operateurs = ['>','>=','<=','<','=','BETWEEN']; 
      
    }
    if(val.includes("c") || val == "route_name")
      this.operateurs = ['=','like'];


      this.requette = this.requette + " and " + val;
      console.log(this.requette);
  }


  bet(){

    if(this.operateur == 'BETWEEN' || this.operateur == "Existe Entre"){
return true 
    }
    return false
  }

  onSubmitReq(){

    if(this.selectRequettype == "1"){
      if(this.donnee == "lineaire"){
        this.lrsServiceService.QueryLinearData(this.requette).subscribe(res=>{
          this.showToasterSuccess('Opération bien effectué', 'selection a été effectué');

          this.data = res;
          console.log(this.data)

          this.columnDefs= [
            { field: "id" , sortable:true,filter:true , headerName:"id"},
            { field: "route_name" , sortable:true,filter:true , headerName:"nom de la route"},
            { field: "pkd" , sortable:true,filter:true , headerName:"PKf d'évenement"},
            { field: "pkf" , sortable:true,filter:true , headerName:"PKf d'évenement"},
            { field: "voie" , sortable:true,filter:true , headerName:"voie"}
         ];

         this.rowData=[];

         console.log("ba9i");


         for (let i = 0;i<this.data.length;i++){
        
          this.headers = Object.keys(res[i]);
      

          console.error(this.dataTypes);  


          if(!this.dataTypes.includes(this.data[i]['event_type'].name)){
            this.dataTypes.push(this.data[i]['event_type'].name);
            console.error('hana thawa 1');
            console.log(this.data);

            console.log(this.dataTypes);
            console.log(this.columnDefs);

            console.error('hana thawa');

                 for(var h of this.headers){

                  this.returnparamsName(this.data[i]['event_type'].id ,h );
     
                    }

                 }

          if(i == (this.data.length - 1)){
            for(var j of this.data){
              this.rowData.push(j);
            }
            console.log(this.columnDefs)
            console.log(this.rowData)
          }

      }


      this.list = []
      for(let i = 0; i<this.data.length;i++){
        this.list.push(this.data[i]["id"]);
      }

      this.lrsServiceService.getLineJson(this.list).subscribe(res=>{

        this.listLineJson = res;
      },(err:HttpErrorResponse)=>this.showToasterWarning('something goes wrong', err.message))

  
     
        },(err:HttpErrorResponse)=>this.showToasterWarning('something goes wrong', err.message))
      }
  
      else if(this.donnee == "ponctuel"){
  
        this.lrsServiceService.QueryPonctuelData(this.requette).subscribe(res=>{
          this.showToasterSuccess('Opération bien effectué', 'requete a été effectué');

          this.data = res;

          this.columnDefs= [
            { field: "id" , sortable:true,filter:true , headerName:"id"},
            { field: "route_name" , sortable:true,filter:true , headerName:"nom de la route"},
            { field: "pkEvent" , sortable:true,filter:true , headerName:"PK d'évenement"},
            { field: "voie" , sortable:true,filter:true , headerName:"voie"}
         ];

         this.rowData=[];

         console.log("ba9i")
         for (let i = 0;i<this.data.length;i++){
          
          this.headers = Object.keys(res[i]);
      

          console.error(this.dataTypes);  


          if(!this.dataTypes.includes(this.data[i]['event_type'].name)){
            this.dataTypes.push(this.data[i]['event_type'].name);
            console.error('hana thawa 1');
            console.log(this.data);

            console.log(this.dataTypes);
            console.log(this.columnDefs);

            console.error('hana thawa');

                 for(var h of this.headers){

                  this.returnparamsName(this.data[i]['event_type'].id ,h );
     
                    }

                 }

          if(i == (this.data.length - 1)){
            for(var j of this.data){
              this.rowData.push(j);
            }
            console.log(this.columnDefs)
            console.log(this.rowData)
          }

      }



        this.list = []
        for(let i = 0; i<this.data.length;i++){
          this.list.push(this.data[i]["id"]);
        }

        this.lrsServiceService.getPointJson(this.list).subscribe(res=>{
          this.showToasterSuccess('Opération bien effectué', 'les Geometries sont pré');

          this.listPointJson = res;
        },(err:HttpErrorResponse)=>this.showToasterWarning('something goes wrong', err.message)
)
     
        },(err:HttpErrorResponse)=>this.showToasterWarning('something goes wrong', err.message)
        )


      



       
  
      }
    }

    else if(this.selectRequettype == "2"){

      if(this.selectedTypeData == this.selectedTypeData2){
        if(this.selectedTypeData == "ponctuel"){

          console.log("ponctuel")
          
          this.object = {thematique1:this.currentthematiqueId,thematique2:this.currentthematiqueId2,pkEvent:this.val11}
          
          this.columnDefs= [
            { field: "ID" , sortable:true,filter:true , headerName:"Id"},
            { field: "NAME" , sortable:true,filter:true , headerName:"Thematique"},
            { field: "ROUTE_ID" , sortable:true,filter:true , headerName:"id de la route"},
            { field: "ROUTE_NAME" , sortable:true,filter:true , headerName:"Nom de la route"},
            { field: "PKEVENT" , sortable:true,filter:true , headerName:"PK d'évenement"},
            { field: "VOIE" , sortable:true,filter:true , headerName:"voie"},
        
         ];

          if(this.val11){
            this.lrsServiceService.MyIntersectionPOintToPointP(this.object).subscribe(res=>{
              this.showToasterSuccess('Opération bien effectué', 'selection a été effectué');

              this.rowData=[];
              this.data = res;

              console.log("ba9i");
 
              console.log(this.data[0]);
              console.log(this.data.length);
 
              if(!this.data.length){
               this.rowData.push(this.data);
              }
              else {
                for(let i = 0; i<this.data.length;i++){
                 this.rowData.push(this.data[i]);
 
                }
              }
             



            })
        }
        else{

          this.lrsServiceService.MyIntersectionPOintToPoint(this.object).subscribe(res=>{
            this.showToasterSuccess('Opération bien effectué', 'selection a été effectué');

            this.rowData=[];
            this.data = res;
            console.log("ba9i");

            console.log(this.data[0]);
            console.log(this.data.length);

            if(!this.data.length){
             this.rowData.push(this.data);
            }
            else {
              for(let i = 0; i<this.data.length;i++){
               this.rowData.push(this.data[i]);

              }
            }
          })
        
        }
      
        }

       else if(this.selectedTypeData == "lineaire"){

          this.requette = `select A.* from Linear_event  A ,Linear_event B  where SDO_RELATE ( A.route_geometry, B.route_geometry,
            'mask=anyinteract') = 'TRUE' and   ((B.Event_type_id = ${this.currentthematiqueId} and A.Event_type_id = ${this.currentthematiqueId2}) OR (B.Event_type_id = ${this.currentthematiqueId2} and A.Event_type_id = ${this.currentthematiqueId}))`;
          
            this.lrsServiceService.QueryLinearData2({thematique1:this.currentthematiqueId,thematique2:this.currentthematiqueId2}).subscribe(res=>{
              this.showToasterSuccess('Opération bien effectué', 'selection a été effectué');

              this.data = res;

              this.columnDefs= [
                { field: "ID" , sortable:true,filter:true , headerName:"Id"},
                { field: "ID_1" , sortable:true,filter:true , headerName:"Id 2"},
                { field: "ROUTE_NAME" , sortable:true,filter:true , headerName:"Nom de la route"},
                { field: "PKD" , sortable:true,filter:true , headerName:"PKD d'évenement 1"},
                { field: "PKF" , sortable:true,filter:true , headerName:"PKF d'évenement 1"},
                { field: "PKD_1" , sortable:true,filter:true , headerName:"PKD d'évenement 2"},
                { field: "PKF_1" , sortable:true,filter:true , headerName:"PKF d'évenement 2"},
                { field: "VOIE" , sortable:true,filter:true , headerName:"voie 1"},
                { field: "VOIE_1" , sortable:true,filter:true , headerName:"voie 2"}
             ];

             this.rowData=[];

             console.log("ba9i");

             console.log(this.data[0]);
             console.log(this.data.length);

             if(!this.data.length){
              this.rowData.push(this.data);
             }
             else {
               for(let i = 0; i<this.data.length;i++){
                this.rowData.push(this.data[i]);

               }
             }
            
          },(err:HttpErrorResponse)=>{
            this.showToasterWarning('something goes wrong', err.message);

          })

       }
      }

      if(this.selectedTypeData != this.selectedTypeData2){
        if(this.selectedTypeData == 'lineaire'){
          this.th1 = this.currentthematiqueId2;
          this.th2 = this.currentthematiqueId;
        }
        else{
          this.th1 = this.currentthematiqueId;
          this.th2 = this.currentthematiqueId2;
        }
          this.lrsServiceService.queryLinearAndPonctual({thematique1:this.th1,thematique2:this.th2}).subscribe(res=>{
            console.log(this.th1)
            console.log(this.th2)
            this.data = res;
            this.showToasterSuccess('Opération bien effectué', 'selection a été effectué');

            this.columnDefs= [
              { field: "ID" , sortable:true,filter:true , headerName:"Id"},
              { field: "ID_1" , sortable:true,filter:true , headerName:"Id 2"},
              { field: "ROUTE_NAME" , sortable:true,filter:true , headerName:"Nom de la route"},
              { field: "PKEVENT" , sortable:true,filter:true , headerName:"PKD d'évenement"},
              { field: "PKD" , sortable:true,filter:true , headerName:"PKD d'évenement 2"},
              { field: "PKF" , sortable:true,filter:true , headerName:"PKF d'évenement 2"},
              { field: "VOIE" , sortable:true,filter:true , headerName:"voie 1"}
           ];


           this.rowData=[];

           console.log("ba9i");

           console.log(this.data[0]);
           console.log(this.data.length);

           if(!this.data.length){
            this.rowData.push(this.data);
           }
           else {
             for(let i = 0; i<this.data.length;i++){
              this.rowData.push(this.data[i]);

             }
           }


          },(err:HttpErrorResponse)=>{
            this.showToasterWarning('something goes wrong', err.message);

          })
        

      
      }


    }

    
   

  console.log(this.requette);

  }

  add(){
    this.added = true;
    this.requette =  this.requette 
    this.val11 = '';
    this.operateur = null;
    this.selectedAttribute = null;
    this.requettes.push({attribute:this.selectedAttribute,operateur:this.operateur,value:this.selectedAttribute});
  }
  Opp(val){

    if(val != "BETWEEN"){
      this.requette = this.requette + " " + val;
      console.log(this.requette) 
    }
    if(val == "BETWEEN"){
      this.operation = "BETWEEN";
    }
    if(val == "intersect"){
      this.verificationVal = false;
    }
    else this.verificationVal = true;
   
  }

  val1(val){
    console.log("like")
    console.log(this.operation)
    console.log(val)
    if(this.operation != "BETWEEN"){
    if(this.selectedAttribute.includes("c") || this.selectedAttribute =='route_name'){
      if(this.requette.includes("like")){

        this.requette = this.requette +" " + `'${this.val11}%'` 
      }else
      this.requette = this.requette +" " + `'${this.val11}'`
    }
    else{
      this.requette = this.requette +" " + this.val11;
    }
    
  }
  
  console.log(this.requette);
  this.showToasterInfo(this.requette,"La requette executé");
  }

  val2(val){
    console.log(val)
    if(this.operation == "BETWEEN"){
   this.requette = this.requette + " BETWEEN " + this.val11 + " AND " + this.val12; 
    console.log(this.requette);
  }
  }

  reinitialiser(){
    this.alrigth = true;
    this.mediumLowAnnsrc.clear();
    this.mediumLowPointsrc.clear();
    this.mediumLowAnnsrcevent1.clear();
    this.mediumLowAnnsrcevent2.clear();
    this.columnDefs=[];
    this.rowData=[]
    this.requette = "select * from ";
    this.val11 = '';
    this.val12 = '';
    this.operateur = null;
    this.selectedAttribute = null;
    this.selectedTypeData = null;
    this.selectedTypeData2 = null;
    this.selectedTh = null;
    this.selectedTh2 = null;
    this.headerNames = [];
    this.data = [];
    this.dataTypes = []
  }


  onSubmitReqTest(){
    if(this.donnee == "lineaire"){

      this.lrsServiceService.QueryLinearData(this.requette).subscribe(res=>{
        console.log(res)
        this.showToasterSuccess('Opération bien effectué', 'selection a été effectué');

      },(err:HttpErrorResponse)=> this.showToasterWarning('something goes wrong', err.message)
      );
      
    }
    else if(this.donnee == "ponctuel"){

      this.lrsServiceService.QueryPonctuelData(this.requette).subscribe(res=>{
        console.log(res)
        this.showToasterSuccess('Opération bien effectué', 'selection a été effectué');

      },(err:HttpErrorResponse)=> this.showToasterWarning('something goes wrong', err.message)
      );
      
    
      }
  }  


  requetteType(){
    if(this.selectRequettype == "1"){
      return true
    }
    return false
  }



  getAllParams(){
    this.lrsServiceService.getAllEventParams().subscribe(res=>{
      this.params = res

   console.error(res)
    },(err:HttpErrorResponse)=> 
    this.showToasterWarning('something goes wrong', err.message))
  }


  returnparamsName(thematique_id ,db_stock ){
   
    for(var i of this.params){
      if(i['eventType'].id == thematique_id && i['champ_db_stock'] == db_stock && !this.headerNames.includes(i['champs_event']) ){
        this.columnDefs.push({ field: db_stock , sortable:true,filter:true , headerName:i['champs_event'] });
        this.headerNames.push(i['champs_event']);
      }
    }

  }


  previewLineData(){
    this.alrigth = false;
    this.dota=[];
    this.mediumLowAnnsrc.clear();
    this.mediumLowPointsrc.clear();
    this.mediumLowAnnsrcevent1.clear();
    this.mediumLowAnnsrcevent2.clear();
    
    
    if(this.data){
      
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
          this.mapPrevLine.addLayer(this.mediumLowAnn1);
          this.mapPrevLine.addLayer(this.mediumLowAnn2);
          this.mapPrevLine.addLayer(this.mediumLowAnn);
          this.mapPrevLine.addLayer(this.mediumLowPoint);
          
        },1000)
        this.verificationCard =true;
      }

      if(this.selectRequettype == "1"){
        if(this.donnee == "ponctuel"){

          setTimeout(()=>{
            for(let i=0;i<this.listPointJson.length;i++){
            
          
              this.mediumLowPointsrc.addFeatures(
                this.format.readFeatures(JSON.parse(this.listPointJson[i]), { featureProjection: "EPSG:4326" })
              );


            }

            var features = this.mediumLowPointsrc.getFeatures();
            this.kmldata= this.formatKML.writeFeatures(features, {featureProjection: 'EPSG:4326'})
            this.jsonData= this.format.writeFeatures(features, {featureProjection: 'EPSG:4326'})
          console.log(this.kmldata)
          console.log(this.jsonData)
          
          
            // this.mediumLowPointsrc.on('addfeature', () =>{
            //   this.mapPrevLine.getView().fit(
            //       this.mediumLowPointsrc.getExtent(),
            //       { duration: 1000, size: this.mapPrevLine.getSize(), maxZoom: 24 }
            //   );
            // });
          
          
           },1200)



        }else{

          setTimeout(()=>{
            for(let i=0;i<this.listLineJson.length;i++){
             
          
              this.mediumLowAnnsrc.addFeatures(
                this.format.readFeatures(JSON.parse(this.listLineJson[i]), { featureProjection: "EPSG:4326" })
              );
          

              var features = this.mediumLowAnnsrc.getFeatures();
            this.kmldata= this.formatKML.writeFeatures(features, {featureProjection: 'EPSG:4326'})
            this.jsonData= this.format.writeFeatures(features, {featureProjection: 'EPSG:4326'})
          console.log(this.kmldata)
          console.log(this.jsonData)


            }
          
          
          
            // this.mediumLowAnnsrc.on('addfeature', () =>{
            //   this.mapPrevLine.getView().fit(
            //       this.mediumLowAnnsrc.getExtent(),
            //       { duration: 1000, size: this.mapPrevLine.getSize(), maxZoom: 24 }
            //   );
            // });
          
          
           },1200)



        }
      }
      if(this.selectRequettype == "2"){

        if(this.selectedTypeData == this.selectedTypeData2){
      if(this.selectedTypeData == "lineaire"){
 setTimeout(()=>{
  for(let i=0;i<this.data.length;i++){
    console.log(this.data[i])
    // console.log(this.data[i])
    // console.log(this.data[i])

    this.mediumLowAnnsrc.addFeatures(
      this.format.readFeatures(JSON.parse(this.data[i]['INTERSECTION']), { featureProjection: "EPSG:4326" })
    );
    this.mediumLowAnnsrcevent1.addFeatures(
      this.format.readFeatures(JSON.parse(this.data[i]['ROUTE_GEOMETRY']), { featureProjection: "EPSG:4326" })
    );
    this.mediumLowAnnsrcevent2.addFeatures(
      this.format.readFeatures(JSON.parse(this.data[i]['ROUTE_GEOMETRY_1']), { featureProjection: "EPSG:4326" })
    );

  }

  var features = this.mediumLowAnnsrc.getFeatures();
  this.kmldata= this.formatKML.writeFeatures(features, {featureProjection: 'EPSG:4326'})
  this.jsonData= this.format.writeFeatures(features, {featureProjection: 'EPSG:4326'})
 console.log(this.kmldata)
 console.log(this.jsonData)



  // this.mediumLowAnnsrc.on('addfeature', () =>{
  //   this.mapPrevLine.getView().fit(
  //       this.mediumLowAnnsrc.getExtent(),
  //       { duration: 1000, size: this.mapPrevLine.getSize(), maxZoom: 24 }
  //   );
  // });


 },1200)






      }


      if(this.selectedTypeData == "ponctuel"){
   console.log("dowdow")
        setTimeout(()=>{
          for(let i=0;i<this.data.length;i++){
      
            this.mediumLowPointsrc.addFeatures(
              this.format.readFeatures(JSON.parse(this.data[i]['ROUTE_GEOMETRY']), { featureProjection: "EPSG:4326" })
            );
          }

          var features = this.mediumLowPointsrc.getFeatures();
         console.log('achraf');
         console.log(features);
          this.kmldata= this.formatKML.writeFeatures(features, {featureProjection: 'EPSG:4326'})
          this.jsonData= this.format.writeFeatures(features, {featureProjection: 'EPSG:4326'})
          console.log(this.kmldata)
          console.log(this.jsonData)
        
        
          // this.mediumLowPointsrc.on('addfeature', () =>{
          //   this.mapPrevLine.getView().fit(
          //       this.mediumLowPointsrc.getExtent(),
          //       { duration: 2000, size: this.mapPrevLine.getSize(), maxZoom: 24 }
          //   );
          // });
        
        
         },1200)


         


      }

     

} if(this.selectedTypeData != this.selectedTypeData2){
  
        
  setTimeout(()=>{
    for(let i=0;i<this.data.length;i++){

      this.mediumLowAnnsrc.addFeatures(
        this.format.readFeatures(JSON.parse(this.data[i]['ROUTE_GEOMETRY_1']), { featureProjection: "EPSG:4326" })
      );
    }
    for(let i=0;i<this.data.length;i++){

      this.mediumLowPointsrc.addFeatures(
        this.format.readFeatures(JSON.parse(this.data[i]['ROUTE_GEOMETRY']), { featureProjection: "EPSG:4326" })
      );
    }

    var featuresf = this.mediumLowPointsrc.getFeatures();

    var features = this.mediumLowAnnsrc.getFeatures();
   console.warn(features)
    for(let i=0;i< featuresf.length;i++){
      features.push(featuresf[i])
    }
    
    this.kmldata= this.formatKML.writeFeatures(features, {featureProjection: 'EPSG:4326'})
    this.jsonData= this.format.writeFeatures(features, {featureProjection: 'EPSG:4326'})
   console.log(this.kmldata)
   console.log(this.jsonData)


  
    // this.mediumLowAnnsrc.on('addfeature', () =>{
    //   this.mapPrevLine.getView().fit(
    //       this.mediumLowAnnsrc.getExtent(),
    //       { duration: 1000, size: this.mapPrevLine.getSize(), maxZoom: 24 }
    //   );
    // });
  
  
   },1200)
  
  
  
        }
  
       
  
}
}
  }


  KMLDataExport() {
    return of(
      this.kmldata);
    }
  jsonDataEport() {
    return of(
      JSON.parse(this.jsonData));
    }
    
    async dynamicDownloadTxt() {
     await  this.previewLineData();

      this.KMLDataExport().subscribe((res) => {
        this.dyanmicDownloadByHtmlTag({
          fileName: 'My Report.kml',
          text: JSON.stringify(res)
        });
      });
  
    }

    async dynamicDownloadJson() {
      await this.previewLineData()
      this.jsonDataEport().subscribe((res) => {
        this.dyanmicDownloadByHtmlTag({
          fileName: 'My Report.geojson',
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
      const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
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
