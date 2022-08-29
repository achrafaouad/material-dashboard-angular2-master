import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import Chart from 'chart.js';
import Map from "ol/Map";

import LayerTile from "ol/layer/Tile";
import Geolocation from 'ol/Geolocation';
import XYZ from "ol/source/XYZ";
import olVectorLayer from "ol/layer/Vector";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import Draw from "ol/interaction/Draw";
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import Stamen from "ol/source/Stamen";
import WMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";
import FullScreen from "ol/control/FullScreen";
import { toStringHDMS } from "ol/coordinate";
import Zoom from "ol/control/Zoom";
import ScaleLine from "ol/control/ScaleLine";
import OverviewMap from "ol/control/OverviewMap";
import MousePosition from "ol/control/MousePosition";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import LayerSwicher, { BaseLayerOptions } from "ol-layerswitcher";
import Overlay from "ol/Overlay";
import { GroupLayerOptions } from "ol-layerswitcher";
import { format } from "ol/coordinate";
import LayerGroup from "ol/layer/Group";
import Control from "ol/control/Control";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Circle from "ol/style/Circle";
import Vector from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import olMapScreenshot from "ol-map-screenshot";
import * as jspdf from "jspdf";
import { FormArray, FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { LrsServiceService } from "app/lrs-service.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import VectorLayer from "ol/layer/Vector";
import { LineStyle } from "app/Models/LineStyle";
import { EtatStyle } from "app/Models/EtatStyle";
import CircleStyle from "ol/style/Circle";
import { ACCIDENTStyle } from "app/Models/AccidentStyle";
import { ColorLike } from "ol/colorlike";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { LinearColor } from "app/Models/LinearColor";
import { PointStyle } from "app/Models/PointStyle";
import { Observable, Subject } from "rxjs";
import { WebcamImage } from "ngx-webcam";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  labels: number[];
  title: ApexTitleSubtitle;
};

import View from "ol/View";
import { ZoomToExtent } from 'ol/control';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  thematiques: Object[];
  legendLine = new Set<string>();
  legendPoint = new Set<string>();
  legendPointFIltred: any[] = [];
  map: Map;
  view: View;
  mapPrevLine: Map;
  mediumLowPointsrc: any;
  mediumLowPoint: olVectorLayer<any>;
  SourceMAR: any;
  SrcLinear_events: any;
  province: any;
  MAR2: any;
  linear_events: any;
  ressores: any;
  colorsd: any;
  SrcPoint_events: any;
  accident: any;
  color = "red"
  boeder = "solid black 10px"
  radius = "50%"
  width = "25px"
  height = "25px"
  pointStyle = new PointStyle(10, "#f30707", "#d9d9d9", 5);
  Routes: LayerGroup;
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  lineEvent: any;
  ponctuels: any;
  agents: any;
  kiloRoute: any;
  events: any;

  constructor(private lrsServiceService: LrsServiceService,) { 
    this.getEventTtype();
    this.getgraphLinear();
    this.getgraphponctuel();
    this.getinfo();
    this.getEvent();

    this.chartOptions = {
      series: [
        {
          name: "Peter",
          data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10,]
        },
        {
          name: "Johnny",
          data: [
            10,
            15,
            null,
            12,
            null,
            10,
            12,
            15,
            null,
            null,
            12,
            null,
           
          ]
        },
        {
          name: "David",
          data: [
            null,
            null,
            null,
            null,
            3,
            4,
            1,
            3,
            4,
            6,
            7,
            9,
           
          ]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        },
        animations: {
          enabled: false
        }
      },
      stroke: {
        curve: "straight"
      },
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      title: {
        text: "Evenements Lineaire"
      }
    };

    this.chartOptions2 = {
      series: [
        {
          name: "Peter",
          data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10,]
        },
        {
          name: "Johnny",
          data: [
            10,
            15,
            null,
            12,
            null,
            10,
            12,
            15,
            null,
            null,
            12,
            null,
           
          ]
        },
        {
          name: "David",
          data: [
            null,
            null,
            null,
            null,
            3,
            4,
            1,
            3,
            4,
            6,
            7,
            9,
           
          ]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        },
        animations: {
          enabled: false
        }
      },
      stroke: {
        curve: "straight"
      },
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      title: {
        text: "Evenements Ponctuel"
      }
    };

    }

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  ngOnInit() {
    this.view=   new View({
      center:[-6.8233653,34.0139846],
      zoom: 10,
      projection: "EPSG:4326",
    });

    // edit option
    console.log("hello world")
    this.mapPrevLine = new Map({
      target: "mapPrevLine",
      layers: [],
      controls: [
        new FullScreen(),
        new Zoom(),
        new ScaleLine({ bar: true }),
          new ZoomToExtent({
            extent: [
              -6.7534427,34.1018165,-6.4705178,33.9716707
            ],
          }),
      ],
      view:this.view
    });
   
      this.mapPrevLine.addLayer(new TileLayer({
        source: new XYZ({
          url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
        })
      }));

// working
this.SourceMAR = new VectorSource({
  format: new GeoJSON(),
  
  url:  (extent) => {
    return ("http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=i2singineerie:LRS_ROUTES&outputFormat=application/json");
  },
  strategy: bboxStrategy,
  
});

this.SrcLinear_events = new VectorSource({
  format: new GeoJSON(),
  url:  (extent)=> {
    return (
      "http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&" +  
      "version=1.1.0&request=GetFeature&typename=i2singineerie:LINEAR_EVENT&outputFormat=application/json"
    );
  },
  strategy: bboxStrategy,
});


this.MAR2 = new VectorLayer({
  title: "Lrsroutes",
  source: this.SourceMAR,
  style: (feature, resolution) => {
    return new Style({
      stroke: new Stroke({
        color: "#4d4d4d",
        width: 2,
      }),
      
    });
  },
} as BaseLayerOptions);


this.province = new TileLayer({
  title: "Province",
  source: new TileWMS({
    url: "http://localhost:8081/geoserver/i2singineerie/wms",
    params: { LAYERS: "i2singineerie:PROVINCE", TILED: true },
    serverType: "geoserver",
    crossOrigin: 'anonymous',
    // Countries have transparency, so do not fade tiles:
    transition: 0,
  }),
} as BaseLayerOptions);

this.linear_events = new VectorLayer({
  title: "linear_events",
       source: this.SrcLinear_events,
  style: (feature, resolution) => {
    this.ressores
    this.colorsd

    

    // console.error(resolution)
    var event_type_id = feature.get("EVENT_TYPE_ID");

    if (event_type_id) {
      for (let i = 0; i < this.thematiques.length; i++) {
        // console.warn(this.thematiques[i]['id'] , event_type_id)
        

        if (this.thematiques[i]["id"] == event_type_id) {

          if(this.thematiques[i]["style"]){
            if(0.002362464157453313>resolution && resolution >0.00008575184020914552){
              this.ressores = 6;
              this.colorsd = <ColorLike>(JSON.parse(this.thematiques[i]["style"]).remplissageC)
              
            }
            if(0.002362464157453313<resolution){
              this.ressores = 8
              this.colorsd = <ColorLike>(JSON.parse(this.thematiques[i]["style"]).remplissageC)
             
            }
            if(0.00008575184020914552>resolution){
              this.ressores = JSON.parse(this.thematiques[i]["style"]).strock
              this.colorsd = <ColorLike>(JSON.parse(this.thematiques[i]["style"]).colorBor)
              
            }
           
              this.legendLine.add(JSON.stringify({
                fill:JSON.parse(this.thematiques[i]["style"]).remplissageC,
                radius:"5px solid " + this.colorsd,
                thematique:event_type_id
              }))
 
          return new Style({
            fill: new Fill({
              color: <ColorLike>(
                JSON.parse(this.thematiques[i]["style"]).remplissageC
              ),
            }),

            stroke: new Stroke({
              color: this.colorsd ,
              width:this.ressores,
            })
          });


        } else if(!this.thematiques[i]["style"]){
          return new Style({
            fill: new Fill({ color: "#eeeeee" }),

            stroke: new Stroke({
              color: "#eeeeee",
              width: 2,
            })
          });

        }
        }
      }
    } else
      return new Style({
        fill: new Fill({ color: "#eeeeee" }),

        stroke: new Stroke({
          color: "#eeeeee",
          width: 2,
        }),
       
      });
  },
} as BaseLayerOptions);

this.SrcPoint_events = new VectorSource({
  format: new GeoJSON(),
  url:  (extent)=> {
    return (
      "http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&" +
      "version=1.1.0&request=GetFeature&typename=i2singineerie:PONCTUEL_EVENTS&outputFormat=application/json"
    );
  },
  strategy: bboxStrategy,
});

this.accident = new VectorLayer({
  title: "PONCTUEL_EVENTS",
  source: this.SrcPoint_events,
  style: (feature, resolution) => {
    var event_type_id = feature.get("EVENT_TYPE_ID");

    if (event_type_id) {
      for (let i = 0; i < this.thematiques.length; i++) {
        // console.log(this.thematiques[i]["id"], event_type_id);

        if (this.thematiques[i]["id"] == event_type_id) {
          if (this.thematiques[i]["pointStyle"]) {
           
            this.legendPoint.add(
              JSON.stringify({
              fill:JSON.parse(this.thematiques[i]["pointStyle"]).color,
              radius:"5px solid " + JSON.parse(this.thematiques[i]["pointStyle"]).Ocolor,
              thematique:event_type_id
            }))                

            return new Style({
              image: new CircleStyle({
                radius: JSON.parse(this.thematiques[i]["pointStyle"])
                  .radius,
                fill: new Fill({
                  color: <ColorLike>(
                    JSON.parse(this.thematiques[i]["pointStyle"]).color
                  ),
                }),
                stroke: new Stroke({
                  color: <ColorLike>(
                    JSON.parse(this.thematiques[i]["pointStyle"]).Ocolor
                  ),
                  width: JSON.parse(this.thematiques[i]["pointStyle"])
                    .strokWidht,
                }),
              })
            });
          } else if (!this.thematiques[i]["pointStyle"]) {
            return new Style({
              image: new CircleStyle({
                radius: this.pointStyle.radius,
                fill: new Fill({ color: <ColorLike>"#eeeeee" }),
                stroke: new Stroke({
                  color: <ColorLike>"#eeeeee",
                  width: 3,
                }),
              })
            });
          }
        }
      }
    }

    return new Style({
      image: new CircleStyle({
        radius: this.pointStyle.radius,
        fill: new Fill({ color: <ColorLike>"#eeeeee" }),
        stroke: new Stroke({ color: <ColorLike>"#eeeeee", width: 3 }),
      }),
      
    });
  },
} as BaseLayerOptions);

this.Routes = new LayerGroup({
  title: "Les Routes",
  layers: [this.MAR2, this.linear_events, this.accident],
} as GroupLayerOptions);


var linear_events1 = new LayerGroup({
  title: "condition de la route",
  layers: [this.linear_events],
} as GroupLayerOptions);
var accidents1 = new LayerGroup({
  title: "les accidents",
  layers: [this.accident],
} as GroupLayerOptions);
this.mapPrevLine.addLayer(this.province);
// this.map.addLayer(this.vectorLayer);

this.mapPrevLine.addLayer(linear_events1);

this.mapPrevLine.addLayer(accidents1);
this.mapPrevLine.addLayer(this.Routes);

    



  } 

getgraphLinear(){
  this.lrsServiceService.getgraphLinear().subscribe(
    (res) => {
      var cc = 0;
      var rees = [];
      for(let i = 0;i<res.length;i++){
        cc = 0;
        for(let j = 0;j<res[i]['data'].length;j++){
           console.log(res[i],res[i]['data'][j])
          if(res[i]['data'][j] == null){
            cc ++;
          }
        }
        // console.log('c',cc)
        if (cc != 12){
          rees.push(res[i])
        }

      }
      this.chartOptions.series = <ApexAxisChartSeries> <unknown>rees

    },
    (err: HttpErrorResponse) => {
    }
  );

}
getgraphponctuel(){
  this.lrsServiceService.getgraphponctuel().subscribe(
    (res) => {
      var cc = 0;
      var rees = [];
      for(let i = 0;i<res.length;i++){
        cc = 0;
        for(let j = 0;j<res[i]['data'].length;j++){
           console.log(res[i],res[i]['data'][j])
          if(res[i]['data'][j] == null){
            cc ++;
          }
        }
        // console.log('c',cc)
        if (cc != 12){
          rees.push(res[i])
        }

      }
      this.chartOptions2.series = <ApexAxisChartSeries> <unknown>rees

    },
    (err: HttpErrorResponse) => {
    }
  );

}

getinfo(){
  this.lrsServiceService.getinfo().subscribe(
    (res) => {
      this.lineEvent =  Math.floor(res['kiloLinear']);
      this.ponctuels = res['nbPoint'];
      this.kiloRoute = Math.floor(res['kiloRoute']);
    },
    (err: HttpErrorResponse) => {
    }
    );
}

returnJSon(te){
  // console.log(te)
  return JSON.parse(te)

}
returnProvinceById(id){
  // console.log(this.events)
  for(let t = 0 ; t<this.events.length;t++){
    if(this.events[t].id === id){
      return this.events[t].name
    }
  }
}


getEvent(){
  this.lrsServiceService.getEventypes().subscribe(
    (res) => {
      this.events = res;},
      
      (err: HttpErrorResponse) => {
      }
      )}
  

  getEventTtype() {
    this.lrsServiceService.getEventypes().subscribe(
      (res) => {
        this.thematiques = res;
        // console.warn(this.thematiques);
      },
      (err: HttpErrorResponse) => {
      }
    );
  }

}
