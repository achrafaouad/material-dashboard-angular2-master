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
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../variables/charts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import View from "ol/View";
import { ZoomToExtent } from 'ol/control';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart-wrapper") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  map: Map;
  view: View;
  mapPrevLine: Map;
  
  constructor() { 
    this.chartOptions = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };



  }

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


   var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });
    
    var options = {
      series: [{
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100]
    }, {
      name: 'series2',
      data: [11, 32, 45, 32, 34, 52, 41]
    }],
      chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
    };

 


    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});



    this.view=   new View({
      center:[-770481.4772813218, 4029184.359656903],
      zoom: 10,
      // projection: "EPSG:3857",
    });

    
   

  }


  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  ngAfterViewInit() {
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
              813079.7791264898, 5929220.284081122, 848966.9639063801,
              5936863.986909639,
            ],
          }),
      ],
      view:this.view
    });
    


    this.mapPrevLine.on('singleclick',(evt: any) => {
console.log(evt.coordinate)

    })

   
      this.mapPrevLine.addLayer(new LayerTile({
        visible: true,
        source: new OSM(),
      } ));
    
   
  }
}
