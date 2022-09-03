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
  ApexDataLabels,
  ApexTooltip
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
  colors: string[];
  tooltip: ApexTooltip;
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



export class SynoptiqueMultiComponent implements OnInit,OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chartsyno", { static: false }) chartest: ChartComponent;
  public chartOptionsS: Partial<ChartOptionsS>;
  

  type?: string = "advanced"; 

  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions2>;

  @ViewChild("chart3") chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions3>;



  mediumLowPoint: olVectorLayer<any>;
year = []
openSansAdded: boolean = false;
routes
selectedEvent1
Attributes1: any[] = [];
selectedAttribute1
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
  selectedEvent2: any;
  verification: boolean = false;
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
        // George Washington
        {
          name: "George Washington",
          data: [
            {
              x: "President",
              y: [
                new Date(1789, 3, 30).getTime(),
                new Date(1797, 2, 4).getTime()
              ]
            }
          ]
        },
        // John Adams
        {
          name: "John Adams",
          data: [
            {
              x: "President",
              y: [
                new Date(1797, 2, 4).getTime(),
                new Date(1801, 2, 4).getTime()
              ]
            },
            {
              x: "Vice President",
              y: [
                new Date(1789, 3, 21).getTime(),
                new Date(1797, 2, 4).getTime()
              ]
            }
          ]
        },
        // Thomas Jefferson
        {
          name: "Thomas Jefferson",
          data: [
            {
              x: "President",
              y: [
                new Date(1801, 2, 4).getTime(),
                new Date(1809, 2, 4).getTime()
              ]
            },
            {
              x: "Vice President",
              y: [
                new Date(1797, 2, 4).getTime(),
                new Date(1801, 2, 4).getTime()
              ]
            },
            {
              x: "Secretary of State",
              y: [
                new Date(1790, 2, 22).getTime(),
                new Date(1793, 11, 31).getTime()
              ]
            }
          ]
        },
        // Aaron Burr
        {
          name: "Aaron Burr",
          data: [
            {
              x: "Vice President",
              y: [
                new Date(1801, 2, 4).getTime(),
                new Date(1805, 2, 4).getTime()
              ]
            }
          ]
        },
        // George Clinton
        {
          name: "George Clinton",
          data: [
            {
              x: "Vice President",
              y: [
                new Date(1805, 2, 4).getTime(),
                new Date(1812, 3, 20).getTime()
              ]
            }
          ]
        },
        // John Jay
        {
          name: "John Jay",
          data: [
            {
              x: "Secretary of State",
              y: [
                new Date(1789, 8, 25).getTime(),
                new Date(1790, 2, 22).getTime()
              ]
            }
          ]
        },
        // Edmund Randolph
        {
          name: "Edmund Randolph",
          data: [
            {
              x: "Secretary of State",
              y: [
                new Date(1794, 0, 2).getTime(),
                new Date(1795, 7, 20).getTime()
              ]
            }
          ]
        },
        // Timothy Pickering
        {
          name: "Timothy Pickering",
          data: [
            {
              x: "Secretary of State",
              y: [
                new Date(1795, 7, 20).getTime(),
                new Date(1800, 4, 12).getTime()
              ]
            }
          ]
        },
        // Charles Lee
        {
          name: "Charles Lee",
          data: [
            {
              x: "Secretary of State",
              y: [
                new Date(1800, 4, 13).getTime(),
                new Date(1800, 5, 5).getTime()
              ]
            }
          ]
        },
        // John Marshall
        {
          name: "John Marshall",
          data: [
            {
              x: "Secretary of State",
              y: [
                new Date(1800, 5, 13).getTime(),
                new Date(1801, 2, 4).getTime()
              ]
            }
          ]
        },
        // Levi Lincoln
        {
          name: "Levi Lincoln",
          data: [
            {
              x: "Secretary of State",
              y: [
                new Date(1801, 2, 5).getTime(),
                new Date(1801, 4, 1).getTime()
              ]
            }
          ]
        },
        // James Madison
        {
          name: "James Madison",
          data: [
            {
              x: "Secretary of State",
              y: [
                new Date(1801, 4, 2).getTime(),
                new Date(1809, 2, 3).getTime()
              ]
            }
          ]
        }
      ],
      chart: {
        height: 350,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%",
          rangeBarGroupRows: true
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#3F51B5",
        "#546E7A",
        "#D4526E",
        "#8D5B4C",
        "#F86624",
        "#D7263D",
        "#1B998B",
        "#2E294E",
        "#F46036",
        "#E2C044"
      ],
      fill: {
        type: "solid"
      },
      xaxis: {
        type: "numeric"
      },
      legend: {
        position: "right"
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

   selectedAttribut2
  selectedEvent3: any;
  selectedAttribute2: any;
  selectedAttribute3: any;
  Attributes2: any[] = [];
  Attributes3: any[] = [];

  

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
    console.warn(this.type)
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
 
     console.log("hello wolrd")
     console.log(this.object1)
     console.log("hello wolrd")

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
       if(this.pkdV && this.pkfV){

       
      this.lrsServiceService.createSynoptique({pkd:this.pkdV,pkf:this.pkfV,routeName:this.selectedRoute,voie:this.selectedVoie}).subscribe((res)=>{
        console.error("3adia")
        console.error(res)
  
        this.data = res;
        this.chartOptionsS.series = []
        this.chartOptionsS.series = <ApexAxisChartSeries> <unknown>res
       
      }
      
      
      ,(err)=>{console.log(err)})
    }
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

  selectedAttribute1F(val){
    this.selectedAttribute1 = val
    console.log(val)
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



  selectedEventF1(val){
    this.selectedEvent1 = val;
    console.log(val)
    this.lrsServiceService.getEventParams(val).subscribe(res=>{
     console.log(res)
     this.Attributes1 = res
   },err=>{console.log(err)}
    )
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


    this.lrsServiceService.createSynoptique2({pkd:this.pkdV,pkf:this.pkfV,routeName:this.selectedRoute,voie:this.selectedVoie,event1:this.selectedEvent1,event2:this.selectedEvent2,attrribute1:this.selectedAttribute1,attrribute2:this.selectedAttribute2}).subscribe((res)=>{
      console.error("3adia")
      console.error(res)
      this.spinner.show(); 
       

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 200);

      console.log(res);

      // setTimeout(() => {
      //   /** spinner ends after 5 seconds */
      //   this.spinner.hide();
      // }, 5000);
      var names = []
      var nouvelleData=[]
      var element ={}
      for(let i = 0;i<res.length;i++){
        element ={}

        if(!names.includes(res[i]["name"])){
          element['name'] = res[i]["name"]
          element['data'] = []

          for(let k = 0;k<res.length;k++){
            if(res[k]["name"] == res[i]["name"])
            element['data'].push(res[k]['data'][0])
          }
          nouvelleData.push(element)
          names.push(res[i]["name"])
        }
      }
      console.log(nouvelleData)
      console.log(names)
      this.data = nouvelleData;
      this.chartOptionsS.series = []
      this.chartOptionsS.series = <ApexAxisChartSeries> <unknown>nouvelleData

      console.log("88888888888888888888888888")
      this.mediumLowPointsrc.clear();
      
     
        
        if(!this.verificationCard){
          console.log("88888888888888888888888888")
            this.mapPrevLine = new Map({
              target: "mapPrevLine",
              layers: [ ],
              
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
    
    
    ,(err)=>{console.log(err)})


//     console.log("88888888888888888888888888")
//     this.mediumLowPointsrc.clear();
    
   
      
//       if(!this.verificationCard){
//         console.log("88888888888888888888888888")
//           this.mapPrevLine = new Map({
//             target: "mapPrevLine",
//             layers: [ ],
            
//             view: new View({
//               center: [-5, 33],
//               zoom: 8,
//               projection: "EPSG:4326",
//             }),
//           });

//           this.mapPrevLine.addLayer(new LayerTile({
//             visible: true,
//             source: new OSM(),
//           } ));
//           this.mapPrevLine.addLayer(this.mediumLowPoint);
       
//         this.verificationCard =true;
      

    
// }





  }


  selectedAttribute2F(val){
    this.selectedAttribute2 = val
    console.log(val)
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

  selectedEventF2(val){
    this.selectedEvent2 = val;
    console.log(this.selectedEvent);
    this.lrsServiceService.getEventParams(val).subscribe(res=>{
     console.log(res)
     this.Attributes2 = res
   },err=>{console.log(err)}
    )
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
      console.log("this.series",this.chartOptionsS.series) 
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
            { duration: 300, size: this.mapPrevLine.getSize(), maxZoom: 15 }
        );
      });

      //hna fin kayn lblan

      if(this.chartOptionsS.series[this.chartOptionsS.series.length-1].name == "Ma position"){
        this.chartOptionsS.series.pop();
        this.chartOptionsS.series.pop();
      }

      this.chartOptionsS.series.push(
        {
          name: "Ma position",
          data: [
            {
              x: this.selectedEvent1,
              y: [
                this.mesure,
                this.mesure + 2
              ],
              fillColor: "#ff0000"
            }
          ]
        }
      )
      this.chartOptionsS.series.push(
        {
          name: "Ma position",
          data: [
            {
              x: this.selectedEvent2,
              y: [
                this.mesure,
                this.mesure + 2
              ],
              fillColor: "#ff0000"
            }
          ]
        }
      )


  
      this.chartOptionsS.series = [...this.chartOptionsS.series];
      
      }, err=>{
        console.log(err);
      })
    }
  
   , 1000);

   this.verification  = true
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
