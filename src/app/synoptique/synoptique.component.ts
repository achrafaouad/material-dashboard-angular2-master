import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import Map from "ol/Map";
import LayerTile from "ol/layer/Tile";
import { LrsServiceService } from 'app/lrs-service.service';
import olVectorLayer from "ol/layer/Vector";
import Text from "ol/style/Text";
import { format } from "ol/coordinate";
import GeoJSON from "ol/format/GeoJSON";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexDataLabels
} from "ng-apexcharts";
import { View } from 'ol';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { FeatureLike } from 'ol/Feature';
import { LineStyle } from 'app/Models/LineStyle';
import { AutoScaleAxis } from 'chartist';
import { NotificationService } from 'app/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};
export type ChartOptionsS = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};

export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptions3 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};





@Component({
  selector: 'app-synoptique',
  templateUrl: './synoptique.component.html',
  styleUrls: ['./synoptique.component.scss']
})



export class SynoptiqueComponent implements OnInit,OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chartsyno", { static: false }) chartest: ChartComponent;
  public chartOptionsS: Partial<ChartOptions>;
  

  type?: string;

  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions2>;

  @ViewChild("chart3") chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions3>;



  mediumLowPoint: olVectorLayer<any>;
year = []
openSansAdded: boolean = false;
routes
format = new GeoJSON();
pkd
lines = new LineStyle(
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
  "40",
  "18",
  "2",
  "#f30707",
  "#d9d9d9",
  "3",
  "38400"
);
mesure: any;
  data: any;
  labels: any = []
  values: any = []
  data10: any;
  object: { route_name: any; voie: any; };
  event: any;
  thematique: string[];
  selectedEvent: any;
  mapPrevLine: Map
  mediumLowPointsrc: any;
  verificationCard: boolean = false;
  vid: HTMLVideoElement;
  refreshIntervalId;
  vitess: number;
  pkfV: any;
  pkdV: any;
  object12: { pkEvent: any; voie: number; route_name: string; };
  object1: { route_name: any; voie: any; };
  videos: any;
  videoPath: string;
  visibleVideo: boolean;
  voie: any;
  series: any[] = [];
  ddfrichty: boolean = true;
  constructor(private cdr: ChangeDetectorRef,private lrsServiceService: LrsServiceService,private spinner: NgxSpinnerService
    ) {
    this.getRoutesName();
    this.getThematiques();

    this.chartOptions2 = {
      series: [100],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["achraf"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


    


    this.chartOptions3 = {
      series: [
        {
          name: "basic",
          data: [400]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "South Korea"
        ]
      }
    };




    this.chartOptions = {
      series: [
        {
          name: "Validation",
          data: [
            
            {
              x: "Validation",
              y: [
                30,
                500
              ],goals:[{name: 'Expected', value: 52, strokeColor: '#775DD0'}]
            },
            {
              x: "Validation",
              y: [
                70,
                444
              ]
              ,goals:[{name: 'Expected', value: 77, strokeColor: '#775DD0'}]
            },

            
          ]
        },
        {
          name: "Design",
          data: [
            {
              x: "Design",
              y: [
                10,
                40
              ]
            },
            {
              x: "Design",
              y: [
                70,
                144
              ]
            },
            
          ]
        }
       
      ],
      chart: {
        height: 450,
        
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%"
        }
      },
      xaxis: {
        type: "numeric"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      legend: {
        position: "right",
        horizontalAlign: "left"
      }
    };
    this.chartOptionsS = {
      series: [
        {
          name: "Validation",
          data: [
            
            {
              x: "Validation",
              y: [
                30,
                500
              ]
              ,goals: [
                {
                  name: 'Expected',
                  value: 14,
                  strokeWidth: 2,
                  strokeDashArray: 2,
                  strokeColor: '#775DD0'
                }
              ]
            },
            {
              x: "Validation",
              y: [
                70,
                444
              ]
            },

            
          ]
        },
        {
          name: "Design",
          data: [
            {
              x: "Design",
              y: [
                10,
                40
              ]
            },
            {
              x: "Design",
              y: [
                70,
                144
              ]
            },
            
          ]
        }
       
      ],
      chart: {
        height: 450,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%"
        }
      },
      xaxis: {
        type: "numeric"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      legend: {
        position: "right",
        horizontalAlign: "left"
      }
    };
   }

   selectedRoute
   selectedAnnee
   selectedVoie
   value1
   value2
   valueTOs1=[]
   valueTOs2=[]


  

  ngOnInit(): void {
    this.mediumLowPointsrc = new VectorSource();
    
    this.mediumLowPoint = new olVectorLayer({
  
      source: this.mediumLowPointsrc,

      style: (feature, resolution) => { 
        return new Style({
           image: new CircleStyle({
             radius:5,
             fill: new Fill({color: "#5ff300"}),
             stroke: new Stroke({color: "#fefefe", width: 4}),
           }),
           text: this.createTextStyle(
            feature,
            resolution,
            this.lines,
            "video"
          ),
         })}
        });


    for(var i = 1990; i <= 2040; i++){
    this.year.push(i)

    }

  }


  async onchangeyr(evv){
    this.selectedAnnee = evv;
    if(this.type == "analyse"){
      await this.updateAdvanced();
      this.updatePieChart();
      this.getDAtapkdpkf();
     }else{
      await  this.update();
      this.updatePieChart();
      this.getDAtapkdpkf();
     }
 
    
  }
  async onchange(evv){
    this.selectedRoute = evv
    if(this.type == "analyse"){
      await this.updateAdvanced();
      this.updatePieChart();
      this.getDAtapkdpkf();
     }else if(this.type == "advanced"){
      console.log("achraf");
      console.log(this.type);
 
     this.object1 = {
         route_name:this.selectedRoute,
         voie:this.selectedVoie
     }
 
     this.lrsServiceService.getVideosList(this.object1).subscribe(
       res=>this.videos = res,err=>console.log(err)
     );
     this.update();
     }
     
     else{
      await  this.update();
      this.updatePieChart();
    this.getDAtapkdpkf();
     }
    
    
    
  }
  async onchangeVoie(evv){

    this.selectedVoie = evv
    

   if(this.type == "analyse"){
    await this.updateAdvanced();
    this.updatePieChart();
    this.getDAtapkdpkf();
   }else if(this.type == "advanced"){
     console.log("achraf");
     console.log(this.type);

    this.object1 = {
        route_name:this.selectedRoute,
        voie:evv
    }

    this.lrsServiceService.getVideosList(this.object1).subscribe(
      res=>{this.videos = res; console.log(res)}  ,err=>console.log(err)
    );
    this.update();
   }
   else{
    await  this.update();
    this.updatePieChart();
    this.getDAtapkdpkf();
   }
    
  }

  update(){
    if(this.type == "advanced"){

      this.lrsServiceService.createSynoptique({pkd:this.pkdV,pkf:this.pkfV,routeName:this.selectedRoute,voie:this.selectedVoie}).subscribe((res)=>{
        console.error("3adia")
        console.error(res)
  
        this.data = res;
        this.chartOptionsS.series = []
        this.chartOptionsS.series = <ApexAxisChartSeries> <unknown>res
       
      }
      
      
      ,(err)=>{console.log(err)})
    }else{
    this.lrsServiceService.createSynoptique({pkd:this.value1,pkf:this.value2,routeName:this.selectedRoute,voie:this.selectedVoie}).subscribe((res)=>{
      this.spinner.show(); 
       

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 5000);

      this.data = res;
      this.chartOptions.series = []
      this.chartOptions.series = <ApexAxisChartSeries> <unknown>res
    }
    
    
    ,(err)=>{console.log(err)})

    this.lrsServiceService.createSynoptiqueLast10({year:this.selectedAnnee,routeName:this.selectedRoute,voie:this.selectedVoie}).subscribe((res)=>{
     
      this.data10 = res;
      console.error("tania")
      console.error(res)
     
    }

    
    ,(err)=>{console.log(err)})


  }
  }

  updateAdvanced(){
    this.lrsServiceService.createAdvancedSynoptique({pkd:this.value1,pkf:this.value2,routeName:this.selectedRoute,voie:this.selectedVoie,event:this.selectedEvent}).subscribe((res)=>{
      console.error("3adia")
      console.error(res)
      this.spinner.show(); 
       

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 5000);
      this.data = res;
      this.chartOptions.series = []
      this.chartOptions.series = <ApexAxisChartSeries> <unknown>res
    }
    
    
    ,(err)=>{console.log(err)})

    this.lrsServiceService.createSynoptiqueLast10({year:this.selectedAnnee,routeName:this.selectedRoute,voie:this.selectedVoie}).subscribe((res)=>{
     
      this.data10 = res;
      console.error("tania")
      console.error(res)
     
    }
    
    
    ,(err)=>{console.log(err)})



  }

  getRoutesName(){
    this.lrsServiceService.getRouteNames().subscribe(
      res=>{
      this.routes = res;
      
      }
      ,err=>{console.log(err)})
  }



  updatePieChart(){
    setTimeout(()=>{
      this.labels = []
      this.values = []
  
      var total = 0;
      var currentName = ''
      console.log(this.data);
     if(this.data){
  
     
      for(let i = 0;i<this.data.length;i++){
        total = 0
       
        currentName = this.data[i].name;
        for(let j = 0;j<this.data[i].data.length;j++){
  
          if(this.data[i].data[j].y){
          if(this.data[i].data[j].y[1]){
             console.log(this.data[i].data[j].y[0])
             console.log(this.data[i].data[j].y[1])
            total=total + (this.data[i].data[j].y[1]-this.data[i].data[j].y[0])
          }
          }
        
        }
  
        this.labels.push(currentName);
        this.values.push(total);
      }
      this.chartOptions2.labels = this.labels
      this.chartOptions2.series = this.values
      this.chartOptions3.series[0].data = [22 ,222 ,22 ]
      console.log(this.chartOptions3.series = [{
        name: "basic",
        data: this.values
      }]);
      this.chartOptions3.xaxis = {
        categories:this.labels
      }
    
      console.log(this.values)
  
  
    }

    },1000)

    setTimeout(()=>{
      this.labels = []
      this.values = []
  
      var total = 0;
      var currentName = ''
      console.log(this.data);
     if(this.data10){
  
     
      for(let i = 0;i<this.data10.length;i++){
        total = 0
    
        currentName = this.data10[i].name;
        for(let j = 0;j<this.data10[i].data.length;j++){
  
          if(this.data10[i].data[j].y){
          if(this.data10[i].data[j].y[1]){
             console.log(this.data10[i].data[j].y[0])
             console.log(this.data10[i].data[j].y[1])
            total=total + (this.data10[i].data[j].y[1]-this.data10[i].data[j].y[0])
          }
          }
        }
  
        this.labels.push(currentName);
        this.values.push(total);
      }
     
      this.chartOptions3.series = [{
        name: "basic",
        data: this.values
      }];

   
      this.chartOptions3.xaxis = {
        categories:this.labels
      }
  
  
    }

    },1200)

    
    // for(var a of this.data){
    //   total = 0;
    //   console.log(a.name)
    //   console.log(a.data)
    //   for(var i of a.data)

    // }
    
  }
  val1(val){
    console.log(val)
    this.pkd = val
  }


  getDAtapkdpkf(){
    this.object={
      route_name:this.selectedRoute,
      voie:this.selectedVoie
    }
        console.error(this.object)
    this.lrsServiceService.getdistinctAttributeValD(this.object).subscribe(res=>{
      this.valueTOs1 = res
      console.log(res)
    },err=>{
      console.log(err);
      
    })


    this.lrsServiceService.getdistinctAttributeValF(this.object).subscribe(res=>{
      this.valueTOs2 = res
      console.log(res)
},err=>{
  console.log(err);
})

if(this.type == "advanced"){
  this.lrsServiceService.getdistinctAttributeValDV(this.object).subscribe(res=>{
    this.valueTOs1 = res
    console.log(res)
  },err=>{
    console.log(err);
    
  })


  this.lrsServiceService.getdistinctAttributeValFV(this.object).subscribe(res=>{
    this.valueTOs2 = res
    console.log(res)
},err=>{
console.log(err);
})
}


  }

  async valueRequette1(val){
    this.value1 = val;
    this.updatePieChart();
    if(this.type == "analyse"){
      await this.updateAdvanced();
     }else{
      await  this.update();
     }
   
  }

  async valueRequette2(val){
    this.value2 = val;
    this.updatePieChart();
    if(this.type == "analyse"){
      await this.updateAdvanced();
     }else{
      await  this.update();
     };
  }


  isAnalyse(){
    if(this.type == "analyse"){
      return true;
    }
    return false;
  }


  getThematiques(){
    this.lrsServiceService.getAllEventType().subscribe(res=>{
      this.thematique = res;

   console.log(this.thematique)
    }, (err:HttpErrorResponse)=>{
      console.log(err
      )
    })
  }

  selectedEventF(val){
     this.selectedEvent = val;
     console.log(this.selectedEvent)
  }

  valueEvent(val){
    console.log(val);
    this.event = val
  }

  advancedIshere(){
    if(this.type == "advanced"){
      return false;
    }
    return true;
  }




  previewLineData(){


    this.lrsServiceService.createSynoptique({pkd:this.pkdV,pkf:this.pkfV,routeName:this.selectedRoute,voie:this.selectedVoie}).subscribe((res)=>{
      console.error("3adia")
      console.error(res)
      this.spinner.show(); 
       

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 200);
      this.data = res;
      this.chartOptionsS.series = []
      this.chartOptionsS.series = <ApexAxisChartSeries> <unknown>res
    }
    
    
    ,(err)=>{console.log(err)})


    console.log("88888888888888888888888888")
    this.mediumLowPointsrc.clear();
    
   
      
      if(!this.verificationCard){
        console.log("88888888888888888888888888")
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
          this.mapPrevLine.addLayer(this.mediumLowPoint);
       
        this.verificationCard =true;
      

    
}





  }



  createTextStyle(feature, resolution, dom, type) {
    if (feature) {
      const align = dom?.align;
      const baseline = dom?.baseline;
      const size = dom.size;
      const height = dom?.height;
      const offsetX = parseInt(dom?.offsetX, 10);
      const offsetY = parseInt(dom?.offsetY, 10);
      const weight = dom?.weight;
      const placement = dom?.placement ? dom?.placement : undefined;
      const maxAngle = dom?.maxangle ? parseFloat(dom?.maxangle) : undefined;
      const overflow = dom?.overflow ? dom?.overflow == "true" : undefined;
      const rotation = parseFloat(dom?.rotation);
      if (dom?.font == "'Open Sans'" && !this.openSansAdded) {
        const openSans = document.createElement("link");
        openSans.href = "https://fonts.googleapis.com/css?family=Open+Sans";
        openSans.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(openSans);
        this.openSansAdded = true;
      }
      const font = weight + " " + size + "/" + height + " " + dom?.font;
      const fillColor = dom?.color;
      const outlineColor = dom?.outline;
      const outlineWidth = parseInt(dom?.outlineWidth, 10);
      return new Text({
        textAlign: align == "" ? undefined : align,
        textBaseline: baseline,
        font: font,
        text: this.getText(feature, resolution, dom, type),
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: outlineColor, width: outlineWidth }),
        offsetX: offsetX,
        offsetY: offsetY,
        placement: placement,
        maxAngle: maxAngle,
        overflow: overflow,
        rotation: rotation,
      });
    }
  }


  

  getText(feature, resolution, dom, typeLayer) {
    const type = dom?.text.value;
    const maxResolution = dom?.maxreso.value;
    let text;

    if (typeLayer == "lrsRoute") text = feature.get("ROUTE_NAME");
    else if (typeLayer == "etatRoute") text = feature.get("CLASSEMENT");
    else if(typeLayer == "video") text = this.mesure.toFixed(3) + " m";
    if (resolution > maxResolution) {
      text = "";
    } else if (type == "hide") {
      text = "";
    } else if (type == "shorten") {
      text = text.trunc(12);
    } else if (
      type == "wrap" &&
      (!dom?.placement || dom?.placement.value != "line")
    ) {
      text = this.stringDivider(text, 16, "\n");
    }

    return text;
  }

  stringDivider(str, width, spaceReplacer) {
    if (str.length > width) {
      let p = width;
      while (p > 0 && str[p] != " " && str[p] != "-") {
        p--;
      }
      if (p > 0) {
        let left;
        if (str.substring(p, p + 1) == "-") {
          left = str.substring(0, p + 1);
        } else {
          left = str.substring(0, p);
        }
        const right = str.substring(p + 1);
        return (
          left + spaceReplacer + this.stringDivider(right, width, spaceReplacer)
        );
      }
    }
    return str;
  }



  ee(ee){
    this.vid = <HTMLVideoElement> document.getElementById("myvideo1");
     console.log(this.vid.currentTime)
   this.refreshIntervalId = setInterval(
    ()=>{ 
      console.log(this.vid.currentTime)
      // this.vitess = (this.pkfV - this.pkdV) / (this.vid.duration);
      this.vitess = (this.pkfV -this.pkdV) / (this.vid.duration);
      console.log("this.vitess",this.vitess)
      this.mesure = this.pkdV + this.vitess * this.vid.currentTime
      console.log("this.mesure",this.mesure)
      this.object12 ={
        pkEvent: this.mesure,
        voie:this.voie,
        route_name:this.selectedRoute,
      }
      this.lrsServiceService.getPositionfeature(this.object12).subscribe((res)=>{
           this.mediumLowPointsrc.clear();
            this.mediumLowPointsrc.addFeatures(
                this.format.readFeatures(res, { featureProjection: "EPSG:4326" })
              );
      

      this.mediumLowPointsrc.on('addfeature', () =>{
        this.mapPrevLine.getView().fit(
            this.mediumLowPointsrc.getExtent(),
            { duration: 300, size: this.mapPrevLine.getSize(), maxZoom: 16 }
        );
      });

      //hna fin kayn lblan

      for(let i =0 ;i<this.chartOptionsS.series.length;i++){
        for(let j =0;j<this.chartOptionsS.series[i].data.length;j++){
       
          this.chartOptionsS.series[i].data[j]['goals'] = [

            {
              name: 'Expected',
              value: this.mesure,
              strokeColor: 'red'
            }
              ]
              
        }
      }
      this.chartOptionsS.series = [...this.chartOptionsS.series];
      
      }, err=>{
        console.log(err);
      })
    }
  
   , 1000);

  }
  
  pp(ee){
    clearInterval(this.refreshIntervalId);
  }

  ngOnChanges(){
  console.log("fuck");
  }

  

  getMyvideo(v){
    console.log(v);
    var index
    for(let i=0;i<this.videos.length;i++){
      if(this.videos[i].name == v){
        index = i;
        break;
      }
    }
    this.pkfV = this.videos[index].pkf;
    this.voie = this.videos[index].voie;
    this.pkdV = this.videos[index].pkd;
    console.log(this.pkfV);
    console.log(this.voie);
    console.log(this.pkdV);
    this.videoPath  = "http://localhost:8091/LrsEvent/" +  this.videos[index].path;
    this.visibleVideo = true;
    console.log(this.videoPath)
    this.vid = <HTMLVideoElement> document.getElementById("myvideo1");
    
     
  }



  updatable(){
    window.ApexCharts.exec("chartsynoed", "updateSeries", 
      this.chartOptionsS);
  }
  


}
