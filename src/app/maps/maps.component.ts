import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import Map from "ol/Map";
import * as htmlToImage from 'html-to-image';
import domtoimage from 'dom-to-image';

import View from "ol/View";
import LayerTile from "ol/layer/Tile";
import Geolocation from 'ol/Geolocation';
import { format as formats}  from 'date-fns'
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
import { NotificationService } from "app/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
//mesure
import {LineString, Polygon} from 'ol/geom';
import {getArea, getLength} from 'ol/sphere';
import {unByKey} from 'ol/Observable';
declare let html2canvas: any;

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"],
})
export class MapsComponent implements OnInit {
  routeName: string;
  ressores: number;
  colorsd: any;
  capturedImage;
  paramschecked: any=[];
  dataFlow: any[];
  ver: any;
  events: any;
  selectedEvent: string = "";
  legendPoint = new Set<string>();
  legendLine = new Set<string>();
  legendPointFIltred: any[] = [];
  imgimg: HTMLImageElement;
  features: any[] = []
  features2: any[] = []
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = [];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();
  vectorSource: any;
  vectorLayer: olVectorLayer<any>;
  sourceMesure: any;
  vectorMesure: olVectorLayer<any>;
  sketch: any;
  helpTooltipElement: any;
  measureTooltipElement: any;
  continuePolygonMsg: string;
  continueLineMsg: string;
  measureTooltip: any;
  helpTooltip: any;
  typeSelect: HTMLElement;
  listener: any;
  constructor(private ngxCsvParser: NgxCsvParser,
    private lrsServiceService: LrsServiceService,
    private httpClient: HttpClient,private fb:FormBuilder,
    private notifyService : NotificationService,
    private spinner: NgxSpinnerService) {
    this.getAllParams();
    this.getRoutesName();
    this.getEvent();
    // this.getLrsLabelStyle();
    // this.getEtatLabelStyle();
    // this.getEtatColorStyle();
    // this.getAccidentLabelStyle();
    // this.getAccidentColorStyle();
    this.getEventTtype();
    
    this.event_type();
    this.getref();
    
    this.showToasterSuccess('bonjour monsieur ', JSON.parse(localStorage.getItem('user')).firstName);
  } 
  color = "red"
  boeder = "solid black 10px"
  radius = "50%"
  width = "25px"
  height = "25px"
  popup: Overlay;
  map: Map;
  mapView: View;
  MAR2: any;
  marker: Overlay;
  selectedrefT
  mapScreenshotParam = {
    dim: [190, 160],
    format: "jpeg",
  };
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
    "10",
    "0",
    "0",
    "#f30707",
    "#d9d9d9",
    "3",
    "38400"
  );
  t1: Date;
  t2: Date;
  t3: Date;
  val12: any;
  val11: any;
  d1: number;
  d2: number;
  d3: number;
  c1: string;
  c2: string;
  c3: string;
  selectedRouteT
  selectedVoieT
  t1Name: String;
  t2Name: String;
  t3Name: String;
  pkd
  pkf
  videoName
  d1Name: String;
  d2Name: String;
  d3Name: String;
  routes :any = []
  c1Name: String;
  c2Name: String;
  c3Name: String;
  selectedEventVolee:string
  selectedVoie
  accidentStyle = new ACCIDENTStyle(10, "#f30707", "#d9d9d9", 5, 10, 20);
  colors = new LinearColor();
  EtatRoute = new LineStyle(
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
  );
    featureInfoFlag: boolean = false;
  AccidentLabeStyle = new LineStyle(
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
  );
 
  etatStyle = new EtatStyle("#f30707", "#f30707", "#f30707");

  pointStyle = new PointStyle(10, "#f30707", "#d9d9d9", 5);

  linearColors = new LinearColor("#d1df1e", "##539a59", 3);

  highlightStyle = new Style({
    fill: new Fill({
      color: "rgba(255,0,255,0.3)",
    }),
    stroke: new Stroke({
      color: "#FF00FF",
      width: 3,
    }),
    image: new Circle({
      radius: 10,
      fill: new Fill({
        color: "#FF00FF",
      }),
    }),
  });

  segmentType = ["nouvelle route", "Exention"];
  draw: any;
  draw1: any;
  videoPath
  @ViewChild('close') close: ElementRef;
  olOverlay: Overlay;
  linear_events: any;
  Routes: LayerGroup;
  vector: any;
  source = new VectorSource({ wrapX: false });
  last_feature: String;
  format = new GeoJSON();
  coords: any;
  x: any;
  y: any;
  object: {};
  objectPoint: Object = {};
  coordinate12: any;
  name: any;
  currentId: any;
  openSansAdded: boolean = false;
  editContol: boolean = false;
  visibleVideo: boolean = false;
  labelStyle: Style;

  SourceMAR: any;
  thmeatiqueName
  edit: HTMLButtonElement;
  @ViewChild("labelForm") formLabel: NgForm;
  SrcLinear_events: any;
  etat: HTMLButtonElement;
  etat2: HTMLButtonElement;
  etat3: HTMLButtonElement;
  SrcPoint_events: any;
  attributePanel: any;
  geojson: any;
  province: LayerTile<any>;
  // region: LayerTile<WMS>;
  eventTypes: string[];
  thematiques: Object[];
  extension: boolean = true;
  currentFileImage: any;
  pointDATA: { [x: string]: any };
  lineData: { [x: string]: any };
  params: any;
  eventParams: any;
  eventName: string;
  edited: boolean = false;
  eventParamsEdit: any[];
  savePointEvent: any[] = [];
  event_id: any;
  thematique_id: any;
  image: string =
    "https://cdn-s-www.lejsl.com/images/BCA6B6DA-C18B-47BD-A8F8-6507D68FD19A/NW_raw/la-voiture-accidentee-s-est-retrouvee-en-sens-contraire-et-le-poteau-edf-est-tombe-route-du-creusot-photo-roger-lespour-1480674879.jpg";
  accident: any;
  objectLine: Object = {};
  coordinate: any[] = [];
  singlePoint: boolean = false;
  selectedRoute
  vrfy: boolean = false;
  productForm: any;
  saved: { champ_db_stock: any; champs_event: any; id_event: number; };
  object1: { route_name: any; voie: any; };
  videos: any;
 refreshIntervalId;
  pkdV: any;
  pkfV: any;
  vitess: number;
  mesure: any;
  voie: any;
  object12: { pkEvent: number; voie: number; route_name: string; };
  mediumLowPointsrc: any;

  mediumLowPoint: olVectorLayer<any>;
  currentdate: { x: any; y: any; route: any; voie: any; };
  c1Volee: boolean;
  c2Volee: boolean;
  d1Volee: boolean;
  d2Volee: boolean;
  t2Volee: boolean;
  t3Volee: boolean;
  t1Volee: boolean;
  d3Volee: boolean;
  c3Volee: boolean;
  edit1: HTMLButtonElement;
  stream:any = null
  previewImage: string ="";
  trigger:Subject<void> = new Subject();
  notPictured: boolean = false;
  event: any;
  point: boolean;
  point1444: boolean = false;
  twopoints: boolean = false;
  nbr: number = 0;
  layer: any;
  coordinates: any;
  track: boolean = false;
  positionFeature: Feature;
  accuracyFeature: Feature;
  route_id: any;
  pkdd: any;
  pkfd: any;
  fromLrs: boolean = false;
  name1: any;
  pkdd1: any;
  pkfd1: any;
  object2: { name: any; name1: any; };
  header: boolean = false;
  csvRecords: any;
  headerTable: string[];
  verification: boolean;
  validate: boolean;
  import: boolean;
  importation: boolean = true;
  verificationr: boolean;
  user: any;
  spinnerName='sp5';
  spinnerType='square-jelly-box';
  get $trigger():Observable<void>{
    return this.trigger.asObservable();
  }
  

  options = {
    series: [{
    name: 'Marine Sprite',
    data: [44, 55, 41, 37, 22, 43, 21]
  }, {
    name: 'Striking Calf',
    data: [53, 32, 33, 52, 13, 43, 32]
  }, {
    name: 'Tank Picture',
    data: [12, 17, 11, 9, 15, 11, 20]
  }, {
    name: 'Bucket Slope',
    data: [9, 7, 5, 8, 6, 9, 4]
  }, {
    name: 'Reborn Kid',
    data: [25, 12, 19, 32, 25, 24, 10]
  }],
    chart: {
    type: 'bar',
    height: 350,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  title: {
    text: 'Fiction Books Sales'
  },
  xaxis: {
    categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
    labels: {
      formatter: function (val) {
        return val + "K"
      }
    }
  },
  yaxis: {
    title: {
      text: undefined
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + "K"
      }
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  }
  };

  

  osm = new LayerTile({
    title: "OSM",
    type: "base",
    visible: true,
    source: new OSM(),
  } as BaseLayerOptions);

  watercolor = new LayerTile({
    title: "Water color",
    type: "base",
    visible: false,
    source: new Stamen({
      layer: "watercolor",
    }),
  } as BaseLayerOptions);

  baseMaps = new LayerGroup({
    title: "Base maps",
    layers: [this.osm, this.watercolor],
  } as GroupLayerOptions);
   vid 
   items = "";
   items2 = "";
  closer = document.getElementById("popup-closer");
  container = document.getElementById("popup");
  content = document.getElementById("popup-content");
  ngOnInit() {
this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    this.user = JSON.parse(localStorage.getItem('user'));


    for(let i = 0;i<this.user.provinces.length;i++){
      if(this.items == ""){
        this.items  =  this.items + "''" + this.user.provinces[i].id + "''"
        this.items2  =  this.items2 + "'" + this.user.provinces[i].id + "'"
      }else{
        this.items  =  this.items + ",''" + this.user.provinces[i].id + "''"
        this.items2  =  this.items2 + ",'" + this.user.provinces[i].id + "'"
      }

    }

    

     this.mediumLowPointsrc = new VectorSource();
    
    this.mediumLowPoint = new olVectorLayer({
  
      source: this.mediumLowPointsrc,

      style: (feature, resolution) => { 
        return new Style({
           image: new CircleStyle({
             radius:5,
             fill: new Fill({color: "#5ff300"}),
             stroke: new Stroke({color: "#fefefe", width: 2}),
           }),
           text: this.createTextStyle(
            feature,
            resolution,
            this.lines,
            "video"
          ),
         })}
        });


    this.productForm = this.fb.group({  
      name: '',  
      quantities: this.fb.array([]) ,  
    }); 
    
    this.vector = new olVectorLayer({
      source: this.source,
    });

    this.labelStyle = new Style({
      text: new Text({
        font: "12px Calibre,sans-serif",
        overflow: true,
        fill: new Fill({
          color: "#000",
        }),
        stroke: new Stroke({
          color: "#fff",
          width: 3,
        }),
      }),
    });

    this.mapView = new View({
      center: [-5, 33],
      zoom: 0,
      projection: "EPSG:4326",
    });

    this.map = new Map({
      target: "map",
      layers: [this.baseMaps, this.vector],
      controls: [
        new FullScreen(),
        new Zoom(),
        new ScaleLine({ bar: true }),
        new OverviewMap({
          className: "ol-overviewmap ol-custom-overviewmap",
          layers: [
            new LayerTile({
              source: new OSM(),
            }),
          ],
        }),
        new MousePosition({
          projection: "EPSG:4326",
          coordinateFormat: function (coordinate) {
            return format(coordinate, "{y} , {x}", 6);
          },
        }),
      ],
      view: this.mapView,
    });

    this.adddMarker();

    featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: this.map,
      style: this.highlightStyle,
    });
    /////////////////////////////////////////////////////////
    this.SourceMAR = new VectorSource({
      format: new GeoJSON(),
      
      url:  (extent) => {
        return ("http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=i2singineerie:LRS_ROUTES&CQL_FILTER=PROVINCE_ID IN ("+
        this.items2 +
        ")&outputFormat=application/json");
      },
      strategy: bboxStrategy,
      
    });



    // this.SrcLinear_events = new VectorSource({
    //   format: new GeoJSON(),
    //   url:  (extent)=> {
    //     return (
    //       "http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&" +  
    //       "version=1.0.0&request=GetFeature&typename=i2singineerie:LINEAR_EVENT&CQL_FILTER=INTERSECTS(ROUTE_GEOMETRY, collectGeometries(queryCollection('i2singineerie:PROVINCE', 'GEOMETRY', 'ID IN("+
    //       this.items +")'))) AND EVENT_TYPE_ID IN (" + this.selectedEvent +")&outputFormat=application/json"
    //     );
    //   },
    //   strategy: bboxStrategy,
    // });

    this.SrcLinear_events = new VectorSource({
      format: new GeoJSON(),
      url:  (extent)=> {
        return (
          "http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&" +  
          "version=1.1.0&request=GetFeature&typename=i2singineerie:LINEAR_EVENT&CQL_FILTER=INTERSECTS(ROUTE_GEOMETRY, collectGeometries(queryCollection('i2singineerie:PROVINCE', 'GEOMETRY', 'ID IN("+
          this.items +")')))&" +
          "outputFormat=application/json"
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
          text: this.createTextStyle(
            feature,
            resolution,
            this.lines,
            "lrsRoute"
          ),
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

    // this.region = new TileLayer({
    //   title: "Region",
    //   source: new TileWMS({
    //     url: "http://localhost:8081/geoserver/i2singineerie/wms",
    //     params: { LAYERS: "i2singineerie:REGION", TILED: true },
    //     serverType: "geoserver",
    //     crossOrigin: 'anonymous',
    //     // Countries have transparency, so do not fade tiles:
    //     transition: 0,
    //   }),
    // } as BaseLayerOptions);

    //////////////////////////////////////////////////

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
                }),
                text: this.createTextStyle(
                  feature,
                  resolution,
                  this.EtatRoute,
                  "etatRoute"
                ),
              });


            } else if(!this.thematiques[i]["style"]){
              return new Style({
                fill: new Fill({ color: "#eeeeee" }),
    
                stroke: new Stroke({
                  color: "#eeeeee",
                  width: 2,
                }),
                text: this.createTextStyle(
                  feature,
                  resolution,
                  this.EtatRoute,
                  "etatRoute"
                ),
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
            text: this.createTextStyle(
              feature,
              resolution,
              this.EtatRoute,
              "etatRoute"
            ),
          });
      },
    } as BaseLayerOptions);

  

    // this.SrcPoint_events = new VectorSource({
    //   format: new GeoJSON(),
    //   url:  (extent)=> {
    //     return (
    //       "http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&" +
    //       "version=1.0.0&request=GetFeature&typename=i2singineerie:PONCTUEL_EVENTS&CQL_FILTER=INTERSECTS(ROUTE_GEOMETRY, collectGeometries(queryCollection('i2singineerie:PROVINCE', 'GEOMETRY', 'ID IN("+
    //       this.items +")'))) AND EVENT_TYPE_ID IN (" + this.selectedEvent +")&outputFormat=application/json"
    //     );
    //   },
    //   strategy: bboxStrategy,
    // });
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
          stroke: new Stroke({color: 'red', width: 1})
      })

  });

  
    this.SrcPoint_events = new VectorSource({
      format: new GeoJSON(),
      url:  (extent)=> {
        return (
          "http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=i2singineerie:PONCTUEL_EVENTS&CQL_FILTER=INTERSECTS(ROUTE_GEOMETRY, collectGeometries(queryCollection('i2singineerie:PROVINCE', 'GEOMETRY', 'ID IN("+
          this.items +
          ")')))&" +
          "outputFormat=application/json"
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
                  }),
                  text: this.createTextStyle(
                    feature,
                    resolution,
                    this.AccidentLabeStyle,
                    "etatRoute"
                  ),
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
                  }),
                  text: this.createTextStyle(
                    feature,
                    resolution,
                    this.AccidentLabeStyle,
                    "etatRoute"
                  ),
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
          text: this.createTextStyle(
            feature,
            resolution,
            this.AccidentLabeStyle,
            "etatRoute"
          ),
        });
      },
    } as BaseLayerOptions);

    ///////////////////////////Mesure14////////////////////////
    var lengthButton = document.createElement('button');
      lengthButton.innerHTML = '<i class="bi bi-rulers"></i>';
      lengthButton.className = 'myButton';
      lengthButton.id = 'lengthButton';

      var lengthElement = document.createElement('div');
      lengthElement.className = 'lengthButtonDiv';
      lengthElement.appendChild(lengthButton);

      var lengthControl = new Control({
          element: lengthElement
      })

      var lengthFlag = false;
    lengthButton.addEventListener("click", () => {
        // disableOtherInteraction('lengthButton');
        lengthButton.classList.toggle('clicked');
        lengthFlag = !lengthFlag;
        document.getElementById("map").style.cursor = "default";
        if (lengthFlag) {
            this.map.removeInteraction(this.draw1);
            this.addInteraction1();
            //toto
              // this.createHelpTooltip()
        } else {

            this.map.removeInteraction(this.draw1);
            this.sourceMesure.clear();
            const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
            while (elements.length > 0) elements[0].remove();
        }

    })

   


    this.sourceMesure = new VectorSource();

      this.vectorMesure = new VectorLayer({
        source: this.sourceMesure,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33',
            }),
          }),
        }),
      });
      this.map.addLayer(this.vectorMesure);

      this.sketch;
      this.helpTooltipElement;
      this.helpTooltip;
      this.measureTooltipElement;
      this.measureTooltip;
      this.continuePolygonMsg = 'Click to continue drawing the polygon';
      this.continueLineMsg = 'Click to continue drawing the line';
      if(lengthFlag){
        this.map.on('pointermove', (evt)=> {
          if (evt.dragging) {
            return;
          }
         
          let helpMsg = 'Click to start drawing';
        
          if (this.sketch) {
            const geom = this.sketch.getGeometry();
            if (geom instanceof Polygon) {
              helpMsg = this.continuePolygonMsg;
            } else if (geom instanceof LineString) {
              helpMsg = this.continueLineMsg;
            }
          }
          if(!this.helpTooltipElement){
            this.createHelpTooltip()
          }
         
           this.helpTooltipElement.innerHTML = helpMsg;
           this.helpTooltip.setPosition(evt.coordinate);
         
           this.helpTooltipElement.classList.remove('hidden');
          
           
        });
  
  
        this.map.getViewport().addEventListener('mouseout',  ()=> {
          if(this.helpTooltipElement){
            this.helpTooltipElement.classList.add('hidden');
          }
          
        });
  
        // this.typeSelect = document.getElementById('type');
        this.draw1;
  
        // this.typeSelect.onchange =  ()=> {
        //   this.map.removeInteraction(this.draw1);
        //   this.addInteraction1();
        // };
        
      }
   
      



    ////////////////////////////////////////////////////////

    var layerSwitcher = new LayerSwicher({
      activationMode: "click",
      reverse: true,
      startActive: false,
      groupSelectStyle: "children",
    });
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

    // this.map.addLayer(this.region);
  
    this.map.addLayer(this.province);
    this.map.addLayer(this.vectorLayer);

    this.map.addLayer(linear_events1);

    this.map.addLayer(accidents1);
    this.map.addLayer(this.Routes);

    this.map.addLayer(this.mediumLowPoint);
    
 
    console.log("layerSwitcher")
    this.map.addControl(layerSwitcher);

    const container = document.getElementById("popup");
    const content = document.getElementById("popup-content");
    const closer = document.getElementById("popup-closer");
    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    this.map.addOverlay(overlay);

    this.map.on("click", (evt: any) => {
      this.nbr ++;
         console.warn(this.nbr);
      // console.warn(this.point1444);

      
      // console.warn(this.twopoints);
      // console.warn(this.coordinate.length);
      const coordinate = evt.coordinate;
      this.coordinate12 = evt.coordinate;

      const hdms = toStringHDMS(toLonLat(coordinate));
      var resolution = this.map.getView().getResolution();

      this.x = coordinate[0];
      this.y = coordinate[1];

      this.coordinate.push(coordinate[0])
      this.coordinate.push(coordinate[1])
//        console.log(this.coordinate)
// // 
//   console.log(this.point1444)
      if(this.point1444){
//todo
        this.edit1 = document.createElement("button");
        this.edit1.setAttribute("data-toggle", "modal");
        this.edit1.setAttribute("data-target", "#ModalVolee");
        this.edit1.setAttribute("id", "voleeedf");
        this.edit1.style.visibility = "hidden";
        document.body.appendChild(this.edit1);
    
        this.eventTypeVhangedVolee(this.productForm.value['name'])
    
        this.edit1.click();
      }
      if(this.twopoints && this.nbr%2 == 0 && this.coordinate.length >=4){

        this.edit1 = document.createElement("button");
        this.edit1.setAttribute("data-toggle", "modal");
        this.edit1.setAttribute("data-target", "#ModalVolee");
        this.edit1.setAttribute("id", "voleeedf");
        this.edit1.style.visibility = "hidden";
        document.body.appendChild(this.edit1);
    
        this.eventTypeVhangedVolee(this.productForm.value['name'])
    
        this.edit1.click();
      }

      if (this.featureInfoFlag) {
        this.map.forEachFeatureAtPixel(evt.pixel, (feature, Layer) => {
          var object = feature.getProperties();
          // console.log(object)
          delete object["geometry"];
         
          if(object["IMAGE"]){
            delete object["IMAGE"];
          }
          if(object["DATE_AJOUTE"] ){
            object["DATE_AJOUTE"] = formats(new Date(object["DATE_AJOUTE"]), 'yyyy-MM-dd');
          }

          

          Object.keys(object).forEach((k) => object[k] == null && delete object[k]);
                // console.log(this.params)
          for(let  j in  Object.keys(object)){
            for(var i of this.params){  
              if(i['eventType'].id == object['EVENT_TYPE_ID'] && i['champ_db_stock'].toUpperCase() == Object.keys(object)[j] ){
                object[i['champs_event']] = object[Object.keys(object)[j]];
                delete object[Object.keys(object)[j]]
              }
            }
          }

          for(let  j in  Object.keys(object)){
            for(var i of this.params){  
              if(i['eventType'].id == object['EVENT_TYPE_ID']){
                object['EVENT'] = i['eventType'].name;
                delete object['EVENT_TYPE_ID']
              }
            }
          }
        

          var th = Object.keys(object);
          var trows = Object.values(object);

          var contentTable = '<table id="customers"> <tr>';
          for (let i = 0; i < th.length; i++) {
            contentTable = contentTable + `<th>${th[i]}</th>`;
          }
          contentTable = contentTable + "</tr> <tr>";

          for (let i = 0; i < trows.length; i++) {
            contentTable = contentTable + `<td>${trows[i]}</td>`;
          }
          contentTable = contentTable + "<tr> </table>";
          content.innerHTML = contentTable;
          overlay.setPosition(coordinate);
        });
      }




      if(this.visibleVideo){
      //  console.error(this.x)
      //  console.error(this.y)

        this.currentdate={
          x:this.x,
          y:this.y,
          route:this.selectedRouteT,
          voie: this.voie
        }
 
        this.lrsServiceService.getCurrentTime(this.currentdate).subscribe(res=>{
          if(res>this.pkfV){
            this.vid.currentTime = this.vid.duration
          }else if(res<this.pkdV){
            this.vid.currentTime = 0 
          }else{
            this.vid.currentTime = res/this.vitess;
          }
          
        },err=>{
              console.log(err)
        })
      }

    
    });
    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    var featureInfoButton1 = document.createElement("button");

    featureInfoButton1.innerHTML = '<i class="bi bi-app-indicator"></i>';

    featureInfoButton1.className = "myButton";
    featureInfoButton1.id = "featureInfoButton";
    var featureInfoElement = document.createElement("div");
    featureInfoElement.className = "featureInfoDiv";
    featureInfoElement.appendChild(featureInfoButton1);

    var featureInfoControl = new Control({
      element: featureInfoElement,
    });

    featureInfoButton1.addEventListener("click", () => {
      featureInfoButton1.classList.toggle("clicked");
      this.featureInfoFlag = !this.featureInfoFlag;
    });
    console.log("featureInfoControl")

    this.map.addControl(featureInfoControl);

    // start : attribute query

    var featureOverlay;

    var qryButton = document.createElement("button");
    qryButton.innerHTML ='<i class="bi bi-search"></i>'
    qryButton.className = "myButton";
    qryButton.id = "qryButton";

    var qryElement = document.createElement("div");
    qryElement.className = "myButtonDiv";
    qryElement.appendChild(qryButton);

    var qryControl = new Control({
      element: qryElement,
    });
    var qryFlag = false;

    qryButton.addEventListener("click", () => {
      // disableOtherInteraction('lengthButton');
      qryButton.classList.toggle("clicked");
      qryFlag = !qryFlag;
      document.getElementById("map").style.cursor = "default";
      if (qryFlag) {
        if (this.geojson) {
          this.geojson.getSource().clear();
          this.map.removeLayer(this.geojson);
        }

        if (featureOverlay) {
          featureOverlay.getSource().clear();
          this.map.removeLayer(featureOverlay);
        }
        document.getElementById("attQueryDiv").style.display = "block";

        // bolIdentify = false;

        this.addMapLayerList();
      } else {
        document.getElementById("attQueryDiv").style.display = "none";
        document.getElementById("attListDiv").style.display = "none";

        if (this.geojson) {
          this.geojson.getSource().clear();
          this.map.removeLayer(this.geojson);
        }

        if (featureOverlay) {
          featureOverlay.getSource().clear();
          this.map.removeLayer(featureOverlay);
        }
      }
    });
    
    // console.log("featureInfoControl");
    this.map.addControl(qryControl);

    document.getElementById("selectLayer").onchange = () => {
      var select = $("#selectAttribute");
      while (select.children("option").length > 0) {
        select.remove();
      }
      var value_layer = $("#selectLayer").val();
      $(document).ready(() => {
        $.ajax({
          type: "GET",
          url:
            "http://localhost:8081/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.3&typeName=" +
            value_layer,
          dataType: "xml",
          success: function (xml) {
            var select = $("#selectAttribute");
            //var title = $(xml).find('xsd\\:complexType').attr('name');
            //	alert(title);
            select.append("<option class='ddindent' value=''></option>");
            $(xml)
              .find("xsd\\:sequence")
              .each(function () {
                $(this)
                  .find("xsd\\:element")
                  .each(function () {
                    var value = $(this).attr("name");
                    //alert(value);
                    var type = $(this).attr("type");
                    //alert(type);
                    if (value != "geom" && value != "the_geom") {
                      select.append(
                        "<option class='ddindent' value='" +
                          type +
                          "'>" +
                          value +
                          "</option>"
                      );
                    }
                  });
              });
          },
        });
      });
    };
    document.getElementById("selectAttribute").onchange = function () {
      var operator = $("#selectOperator");
      while (operator.children("option").length > 0) {
        operator.remove();
      }

      var value_type = $(this).val();
      var value_attribute = $("#selectAttribute option:selected").text();

      operator.append(
        "<option class='ddindent' value='Select operator'> </option>"
      );

      if (
        value_type == "xsd:short" ||
        value_type == "xsd:int" ||
        value_type == "xsd:double" ||
        value_type == "xsd:decimal"
      ) {
        var operator1 = $("#selectOperator");
        operator1.append(
          "<option class='ddindent' value='" +
            "Greater than" +
            "'>" +
            ">" +
            "</option>"
        );
        operator1.append(
          "<option class='ddindent' value='" +
            "Less than" +
            "'>" +
            "<" +
            "</option>"
        );
        operator1.append(
          "<option class='ddindent' value='" +
            "Equal to" +
            "'>" +
            "=" +
            "</option>"
        );

        // operator1.children('option')[1] = new Option('Greater than', '>');
        // operator1.children('option')[2] = new Option('Less than', '<');
        // operator1.children('option')[3] = new Option('Equal to', '=');
      } else if (value_type == "xsd:string") {
        var operator1 = $("#selectOperator");
        operator1.append(
          "<option class='ddindent' value='" +
            "Like" +
            "'>" +
            "Like" +
            "</option>"
        );
        operator1.append(
          "<option class='ddindent' value='" +
            "Equal to" +
            "'>" +
            "=" +
            "</option>"
        );

        // operator1.children('option')[1] = new Option('Like', 'Like');
        // operator1.children('option')[2] = new Option('Equal to', '=');
      }
    };

    $("#attQryRun").click(() => {
      this.map.removeLayer(this.vectorLayer);
      this.features2=[]
      this.features=[]
      this.map.set("isLoading", "YES");

      if (featureOverlay) {
        featureOverlay.getSource().clear();
        this.map.removeLayer(featureOverlay);
      }

      var layer = $("#selectLayer");
      var attribute = $("#selectAttribute");
      var operator = $("#selectOperator");
      var txt = $("#enterValue");

      if (layer.children("option").prop("selectedIndex") == 0) {
        alert("Select Layer");
      } else if (attribute.children("option").prop("selectedIndex") == -1) {
        alert("Select Attribute");
      } else if (operator.children("option").prop("selectedIndex") <= 0) {
        alert("Select Operator");
      } else if (txt.val.length <= 0) {
        alert("Enter Value");
      } else {
        var value_layer = $("#selectLayer :selected").val();
        var value_attribute = $("#selectAttribute :selected").text();
        var value_operator = $("#selectOperator :selected").val();
        var value_txt = txt.val();

        if (value_operator == "Like") {
          value_txt = "%25" + value_txt + "%25";
        } else {
          value_txt = value_txt;
        }
        var url =
          "http://localhost:8081/geoserver/i2singineerie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
          value_layer +
          "&CQL_FILTER=" +
          value_attribute +
          "+" +
          value_operator +
          "+'" +
          value_txt +
          "'&outputFormat=application/json";

        //  this.newaddGeoJsonToMap(url);
        if (this.geojson) {
          this.geojson.getSource().clear();
          this.map.removeLayer(this.geojson);
        }

        var style = new Style({
          // fill: new ol.style.Fill({
          //   color: 'rgba(0, 255, 255, 0.7)'
          // }),
          stroke: new Stroke({
            color: "#FFFF00",
            width: 3,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: "#FFFF00",
            }),
          }),
        });

        this.geojson = new Vector({
          source: new VectorSource({
            url: url,
            format: new GeoJSON(),
          }),
          style: style,
        });

        this.geojson.getSource().on("addfeature", () => {
          
          this.features = this.geojson.getSource().getFeatures();
          this.features2 = this.geojson.getSource().getFeatures();
          
          
         
            this.displayedColumns = Object.keys(this.features[0].getProperties());

            for(let j = 0;j<this.displayedColumns.length;j++){
              if(this.displayedColumns[j] === "geometry"){
                this.displayedColumns.splice(j, 1)
              }
            }
            for(let j =0;j<this.features.length ;j++){
              // this.features2[j]=this.features2[j].getProperties();
              
              delete this.features[j].getProperties()['geometry'];
              this.features[j]=this.features[j].getProperties();
              
            }

          this.map.getView().fit(this.geojson.getSource().getExtent(), {
            duration: 100,
            size: this.map.getSize(),
            maxZoom: 21,
          });
        });
        this.map.addLayer(this.geojson);
//todo





console.log(this.features.length)
console.log(this.features)
console.log(this.displayedColumns)

//todo

        console.log(this.features);
        
        // todo
        var table_button = document.getElementById("table_data")
        table_button.click();
        console.log('hahowa tclicka');

        
        layer.children("option").remove();
        attribute.children("option").remove();
        operator.children("option").remove();
        // review
        // this.newpopulateQueryTable(url);

        this.map.set("isLoading", "NO");
      }
    });

    
    var featureInfoButton = document.createElement("button");

    featureInfoButton.innerHTML = '<i class="bi bi-camera-reels-fill"></i>';

    featureInfoButton.className = "myButton";
    featureInfoButton.id = "video";
    
    featureInfoButton.setAttribute("data-toggle", "modal");
    featureInfoButton.setAttribute("data-target", "#videoModal");

    var featureInfoElement = document.createElement("div");
    featureInfoElement.className = "videoDivox";
    featureInfoElement.appendChild(featureInfoButton);

    var featureInfoControl144 = new Control({
      element: featureInfoElement,
    });
 
    // console.log("featureInfoControl144")
    this.map.addControl(featureInfoControl144)


    
    var featureInfoButton = document.createElement("button");

    featureInfoButton.innerHTML = '<i class="bi bi-shift"></i>';

    featureInfoButton.className = "myButton";
    featureInfoButton.id = "video144";
    
    featureInfoButton.setAttribute("data-toggle", "modal");
    featureInfoButton.setAttribute("data-target", "#importModal");

    var featureInfoElement = document.createElement("div");
    featureInfoElement.className = "videoDivox";
    featureInfoElement.appendChild(featureInfoButton);

    var featureInfoControl144 = new Control({
      element: featureInfoElement,
    });

    // console.log("featureInfoControl144")

    this.map.addControl(featureInfoControl144)



    //tttotototo

    






    

    //add print Button
    var Print = document.createElement("button");
    Print.innerHTML = '<i class="bi bi-printer"></i>';
    Print.className = "myButton";
    Print.id = "featureInfoButton";

    Print.setAttribute("data-toggle", "modal");
    Print.setAttribute("data-target", "#printModal");

    var PrintCart = document.createElement("div");
    PrintCart.className = "helloInfoDiv";
    PrintCart.appendChild(Print);

    var PrintControl = new Control({
      element: PrintCart,
    });

    this.map.addControl(PrintControl);


    var chequeboxData = document.createElement("button");
    chequeboxData.innerHTML = 'A';
    chequeboxData.className = "myButton";
    chequeboxData.id = "featureInfoButton41414141";

    chequeboxData.setAttribute("data-toggle", "modal");
    chequeboxData.setAttribute("data-target", "#achrafAouad");

    var chequeboxDataCart = document.createElement("div");
    chequeboxDataCart.className = "helloInfoDiv";
    chequeboxDataCart.appendChild(chequeboxData);

    var chequeboxDataControl = new Control({
      element: chequeboxDataCart,
    });
    this.map.addControl(chequeboxDataControl);



   

    document.getElementById("submit_par").addEventListener("click", () => {
      this.map.removeInteraction(this.draw);
    });

    document.getElementById("undo").addEventListener("click", () => {
      if (this.draw) {
        this.draw.removeLastPoint();
      }
    });
    document.getElementById("drow_Line").addEventListener("click", () => {

      document.getElementById("undo").style.visibility = "visible";
      document.getElementById("submit_par").style.visibility = "visible";
      document.getElementById("addRoute").style.visibility = "visible";

      this.map.removeInteraction(this.draw);
      this.addInteraction("LineString");
    });

    document.getElementById("drow_Point").addEventListener("click", () => {
      
      document.getElementById("undo").style.visibility = "visible";
      document.getElementById("submit_par").style.visibility = "visible";
      document.getElementById("addPoint").style.visibility = "visible";
      this.singlePoint = true;
      this.map.removeInteraction(this.draw);
      this.addInteraction("Point");
      //TODO
      this.lrsServiceService.getAllEventType().subscribe(
        (res) => {
        this.eventTypes = res;
        this.showToasterSuccess('loading Events Successfully', 'Opération bien efectuée');


      });
    });

   


    document.getElementById("drow_LineEvent").addEventListener("click", () => {

      document.getElementById("undo").style.visibility = "visible";
      document.getElementById("submit_par").style.visibility = "visible";
      document.getElementById("addPoint").style.visibility = "visible";
      this.singlePoint = false;
      this.map.removeInteraction(this.draw);
      this.addInteraction("Point");
      this.lrsServiceService.getAllEventType().subscribe((res) => {
        this.eventTypes = res;
      });

    })
 
 
  


    
    var editButton = document.getElementById("editButton");
    
   
    var EditControl = new Control({
      element: editButton,
    });

    this.map.addControl(EditControl);
 
  
   


    
    editButton.addEventListener("click", () => {
      this.editContol = !this.editContol;
      editButton.classList.toggle("clicked");

      if (this.editContol) {
        this.map.on("singleclick", (evt: any) => {
          if (this.editContol) {
            console.log("Edit");
            this.edit = document.createElement("button");
            this.edit.setAttribute("data-toggle", "modal");
            this.edit.setAttribute("data-target", "#EditModel");
            this.edit.setAttribute("id", "editModal");
            this.edit.style.visibility = "hidden";
            var editInfoElement = document.createElement("div");
            editInfoElement.className = "featureInfoDiv";
            editInfoElement.appendChild(this.edit);

            var editInfoElementControl = new Control({
              element: editInfoElement,
            });
            this.map.addControl(editInfoElementControl);
            this.map.on("singleclick", (evt: any) => {
              this.map.forEachFeatureAtPixel(evt.pixel, (feature, Layer) => {
               

                if (Layer.get("title") == "PONCTUEL_EVENTS") {
                  this.pointDATA = feature.getProperties();
                  // console.warn(this.pointDATA);
                  if (this.pointDATA["IMAGE"] != "") {
                    this.image =
                      "http://localhost:8091/" + this.pointDATA["IMAGE"];
                  }

                 
                  this.name = feature.getProperties()["ROUTE_NAME"];
                  this.pkfd = feature.getProperties()["PKF"];
                  this.pkdd = feature.getProperties()["PKD"];
                  this.name1 = feature.getProperties()["ROUTE_NAME"];
                  this.pkfd1 = feature.getProperties()["PKF"];
                  this.pkdd1 = feature.getProperties()["PKD"];
                  this.voie = feature.getProperties()["VOIE"];
               
                  this.fromLrs = false;

                  this.name = feature.getProperties()["ROUTE_NAME"];
                  this.currentId = feature.getProperties()["ROUTE_ID"];
                  // console.log("this.currentId",this.currentId)
                  this.returnparamsName(this.pointDATA);
                  console.log("clicked")
                  // this.edit.click();
                }

                if (Layer.get("title") == "linear_events") {
                  this.lineData = feature.getProperties();
                  this.name = feature.getProperties()["ROUTE_NAME"];
                  this.currentId = feature.getProperties()["ROUTE_ID"];
                  // console.log("this.currentId",this.currentId)
                  this.name = feature.getProperties()["ROUTE_NAME"];
                  this.pkfd = feature.getProperties()["PKF"];
                  this.pkdd = feature.getProperties()["PKD"];
                  this.name1 = feature.getProperties()["ROUTE_NAME"];
                  this.pkfd1 = feature.getProperties()["PKF"];
                  this.pkdd1 = feature.getProperties()["PKD"];
                  this.voie = feature.getProperties()["VOIE"];

                  this.fromLrs = false;
                  
                  // console.warn(this.pointDATA);
                  if (this.lineData["IMAGE"] != "") {
                    this.image =
                      "http://localhost:8091/" + this.lineData["IMAGE"];
                  }

                  this.returnparamsName(this.lineData);

                  // this.edit.click();
                }

                if (Layer.get("title") == "Lrsroutes") {
                  this.name = feature.getProperties()["ROUTE_NAME"];
                  this.pkfd = feature.getProperties()["PKF"];
                  this.pkdd = feature.getProperties()["PKD"];
                  this.name1 = feature.getProperties()["ROUTE_NAME"];
                  this.pkfd1 = feature.getProperties()["PKF"];
                  this.pkdd1 = feature.getProperties()["PKD"];
                  this.voie = feature.getProperties()["VOIE"];
                  
                  //todo
                  this.fromLrs = true
                  var eeeeee = feature.getProperties();
                  // console.log("hweni",eeeeee)
                  // 
                  this.currentId = feature.getProperties()["ROUTE_ID"];
                  // console.log("this.currentId",this.currentId)
                  this.edit.click();
                }
              });
            });
          } else {
            //todo
            this.edit.remove();
          }
        });
        ///////////////////////hadi blastha//////////////////////////
        
        /////////////////////////////////////////////////////

        this.map.on("singleclick", (evt: any) => {
          if (this.editContol) {
            
            this.etat2 = document.createElement("button");
            this.etat2.setAttribute("data-toggle", "modal");
            this.etat2.setAttribute("data-target", "#EtatModel");
            this.etat2.setAttribute("id", "EtatModal");
            this.etat2.style.visibility = "hidden";
            var etatInfoElement = document.createElement("div");
            etatInfoElement.className = "featureInfoDiv";
            etatInfoElement.appendChild(this.etat2);

            var etatInfoElementControl211 = new Control({
              element: etatInfoElement,
            });
            this.map.addControl(etatInfoElementControl211);
            this.map.on("singleclick", (evt: any) => {
              this.map.forEachFeatureAtPixel(evt.pixel, (feature, Layer) => {
                if (Layer.get("title") == "linear_events") {
                  // this.name = feature.getProperties()['ROUTE_NAME'];
                  // this.currentId = feature.getProperties()['ROUTE_ID'];
                  console.log("EtatModel clicked");
                  this.etat2.click();
                }
              });
            });
          } else {
            //todo
            this.etat2.remove();
          }
        });

        this.map.on("singleclick", (evt: any) => {
          if (this.editContol) {
            
            this.accident = document.createElement("button");
            this.accident.setAttribute("data-toggle", "modal");
            this.accident.setAttribute("data-target", "#AccidentModel");
            this.accident.setAttribute("id", "AccidentModal");
            this.accident.style.visibility = "hidden";
            var accidentInfoElement = document.createElement("div");
            accidentInfoElement.className = "featureInfoDiv";
            accidentInfoElement.appendChild(this.accident);

            var etatInfoElementControl = new Control({
              element: accidentInfoElement,
            });
            this.map.addControl(etatInfoElementControl);
            this.map.on("singleclick", (evt: any) => {
              this.map.forEachFeatureAtPixel(evt.pixel, (feature, Layer) => {
                if (Layer.get("title") == "PONCTUEL_EVENTS") {
                  // this.name = feature.getProperties()['ROUTE_NAME'];
                  // this.currentId = feature.getProperties()['ROUTE_ID'];
                  console.log("AccidentModel clicked");
                  this.accident.click();
                }
              });
            });
          } else {
            //todo
            this.accident.remove();
          }
        });
      } else if (!this.editContol) {
       
      }
    });

//mesure14
    // this.addInteraction1();
    this.map.addControl(lengthControl);
  }

  addInteraction(typo: String) {
    this.draw = new Draw({
      source: this.source,
      type: typo,
    });
    document.getElementById("undo").style.visibility = "visible";

    this.map.addInteraction(this.draw);

    this.source.on("addfeature", (evt) => {
      var feature = evt.feature;

      this.coords = feature.getGeometry();

      var Features = this.format.writeGeometry(this.coords);

      this.last_feature = Features;
    });
  }

  async doScreenshot() {
    try {
      return await olMapScreenshot.getScreenshot(
        this.map,
        this.mapScreenshotParam
      );
    } catch (ex) {
      alert(ex);
    }
  }

 
  // createPDFDocument(data) {
  //   const pdf = new jspdf.jsPDF("p", "mm", "a4");
  //   pdf.setFont("times");
  //   pdf.setFontSize(16);

  //   const title = this.val11;
  //   const comment = this.val12;
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   pdf.text(title, pageWidth / 2 - title.length, 20);
  //   pdf.text(title, pageWidth, 20);
  //   pdf.setFontSize(10);
  //   pdf.setFont("italic");
  //   // pdf.text(10, 28, "Location: Córdoba, Andalucia, España");
  //   pdf.addImage(data.img, "JPEG", 10, 30, data.w, data.h);

  //   pdf.text(comment, 10, data.h +40);
  //   // pdf.text(comment, pageWidth, 20);

  //   pdf.save("map-screenshot.pdf");
  // }



  zoomTOValue(val){
      console.log(val.geometry.getCoordinates())
      let test = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates":val.geometry.getCoordinates()
        }
      }

      console.log('--------------------------------')
      console.log(test)

      console.log('--------------------------------')
     
      this.map.removeLayer(this.vectorLayer);

        
          console.log("halawah")
       
          this.vectorSource.addFeatures(this.format.readFeatures(test,{ featureProjection: "EPSG:4326" }));
          this.map.getView().fit(this.vectorSource.getExtent(), {
            duration: 100,
            size: this.map.getSize(),
            maxZoom: 21,
          });
          this.map.addLayer(this.vectorLayer);
    
        
        
      
  }

  async createPDFDocument(data) {
    console.log("ha document d zeb")
    console.log("ha document d zeb"  , this.val11)
    console.log("ha document d zeb"  , this.val12)
    const pdf = new jspdf.jsPDF("p", "mm", "a4");
    pdf.setFont("times");
    pdf.setFontSize(16);

    const title = this.val11;
    const comment = this.val12;
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.text(title, pageWidth / 2 - title.length, 20);
    pdf.text(title, pageWidth, 20);
    pdf.setFontSize(10);
    pdf.setFont("italic");
    // pdf.text(10, 28, "Location: Córdoba, Andalucia, España");
    pdf.addImage(data.img, "JPEG", 10, 30, data.w, data.h);
    // var srcc = document.getElementById("containerTable")
   
    pdf.text(comment, 10, data.h +40);

    var node:any = document.getElementById("containerTable2");
  
        html2canvas(node).then(canvas => {
     
        /// document.body.appendChild(canvas);
        this.capturedImage = canvas.toDataURL();
        console.log("canvas.toDataURL() -->" + this.capturedImage);
        console.log(this.capturedImage);
        pdf.addImage(this.capturedImage, "JPEG", 10, data.h +70, 40, 60);
        pdf.save('DOC.pdf');
        });

        
      
 

  
  
    

    
     
    

        
    

   
  }

  


  routeType(value) {
    if (value == "nouvelle route") {
      this.extension = false;
    } else this.extension = true;
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    // console.log(this.last_feature)
    if (form.value.segmentType == "Exention") {
      var data = form.value;
      // console.warn("hayhayhayhyahy");
      // console.warn(form.value);
      
      this.lrsServiceService.addSection(this.last_feature).subscribe(
        (res) => {
          this.spinner.show();

          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);


          this.showToasterSuccess('Opération bien effectué', 'Section a été ajouté');

          this.MAR2.getSource().refresh();
        },
        (err: HttpErrorResponse) => {
          this.showToasterWarning('something goes wrong', 'check that you did that properly');


        }
      );
    }
    if (form.value.segmentType == "nouvelle route") {
      var my_object = {
        name: form.value.routeName,
        reference: form.value.référence,
        voie: form.value.voie,
        route: this.last_feature.toString(),
      };

      this.lrsServiceService.addNewSection(my_object).subscribe(
        (r) => {
          this.spinner.show();

          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

          // console.log(r);
          this.showToasterSuccess('Opération bien effectué', 'Section a été ajouté');

          this.MAR2.getSource().refresh();
        },
        (err: HttpErrorResponse) => {
          this.showToasterWarning('something goes wrong', 'check that you did that properly');
       

        }
      );
    }
  }

  closingVolee(){
    
    this.layer.getSource().clear()
    this.track = false;
    this.point1444 = false;
    this.twopoints = false
    this.stream = null;
    this.map.removeInteraction(this.draw);
  }

  onSubmitVolee(f: NgForm){
    
  //  console.log(f.value)
   this.object = f.value;
  //  console.log(this.previewImage)
   var file = this.dataURItoBlob(this.previewImage);
   if(this.singlePoint){
    this.object["x"] = this.x;
    this.object["y"] = this.y;
    this.object["thematique"] = this.thmeatiqueName;

   }
   if(this.twopoints){
     this.singlePoint = false;
    //  console.error("webbi" , this.object)
    this.object["x1"] = this.coordinate[this.coordinate.length-4];
    this.object["y1"] = this.coordinate[this.coordinate.length-3];
    this.object["x2"] = this.coordinate[this.coordinate.length-2];
    this.object["y2"] = this.coordinate[this.coordinate.length-1];
    this.object["thematique"] = this.thmeatiqueName;
   }
   const formData = new FormData();
  formData.append("file", file);
  formData.append("event_type", this.event);
  formData.append("data", JSON.stringify(this.object));

  this.httpClient
    .post<any>("http://localhost:8091/LrsEvent/uploadFileNewEvent", formData)
    .subscribe(
      (res) => {
        this.accident.getSource().refresh();   
        this.linear_events.getSource().refresh(); 
          this.spinner.show(); 
       

          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

        this.showToasterSuccess('Opération bien effectué', 'mise a jour a été effectué');
     
        

         document.getElementById("closingShit").click();
        this.stream = null;
        this.point1444 = false;
        this.twopoints = false;
        if(this.singlePoint)
        this.point1444 = true;
        else{
          this.twopoints= true
        }
    
      },
      (err) =>{
        this.showToasterError('Opération non effectué', 'somthing goes wrong');

      }
    );

  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);



    //New Code
    return new Blob([ab], {type: 'image/jpeg'});


}
Upload(data, eventType) {
  const formData = new FormData();
  formData.append("file", this.currentFileImage);
  formData.append("event_type", eventType);
  formData.append("data", JSON.stringify(data));

  this.httpClient
    .post<any>("http://localhost:8091/LrsEvent/uploadFile", formData)
    .subscribe(
      (res) => {
        
          this.spinner.show(); 
        

          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

        this.showToasterSuccess('Opération bien effectué', 'fichier a été ajouté');
   

        this.returnparamsName(res);
        if (res.image != "") {
          this.image = "http://localhost:8091/" + res.image;
        }
        this.return();
     
      },
      (err) => console.log(err)
    );
}



  onSubmitPoint(f: NgForm) {
    // console.log(f.value);
    this.object = f.value;
    if(this.singlePoint){
      this.object["x"] = this.x;
      this.object["y"] = this.y;
      // console.error(this.object);
     
    this.lrsServiceService.addPointFromMap(this.object).subscribe(
      (r) => {
        this.spinner.show(); 

        setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
        document.getElementById("closeModal144").click();
        this.showToasterSuccess('Opération bien effectué', 'évenement a été ajouté');
        this.accident.getSource().refresh();
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');

      }
    );

    }
    else {
      if(this.coordinate.length >=4){
        this.object["x1"] = this.coordinate[this.coordinate.length-4];
        this.object["y1"] = this.coordinate[this.coordinate.length-3];
        this.object["x2"] = this.coordinate[this.coordinate.length-2];
        this.object["y2"] = this.coordinate[this.coordinate.length-1];

        this.lrsServiceService.addNewLineEventFromMap(this.object).subscribe(
          (r) => {
            this.spinner.show(); 

            setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
              }, 5000);
            document.getElementById("closeModal144").click();
            this.showToasterSuccess('Opération bien effectué', 'évenement a été ajouté');
            this.linear_events.getSource().refresh();
          },
          (err: HttpErrorResponse) => {
            this.showToasterWarning('something goes wrong', 'check that you did that properly');

          }
        );


      }
      

    }




  }


  deleteSection(){
    if(this.fromLrs){
      this.object = {
      route_name: this.name,
      pkd1: this.pkdd1,
      pkf1:this.pkfd1,
      voie:this.voie
    }


    this.lrsServiceService.deleteByAtt(this.object).subscribe((res)=>{
      this.spinner.show(); 

      setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 5000);
      this.MAR2.getSource().refresh(); 

      this.fromLrs =false; 
      this.showToasterSuccess('Opération bien effectué', 'supression');

    }, (err)=>{
       console.log(err);
      this.fromLrs =false;
    })

    this.fromLrs =false;

  }else{
   console.log("//////////////////////////////////////////////////////////////////////////////////")
    this.object = {
      route_id: this.currentId
    }

    this.lrsServiceService.deleteByID(this.object).subscribe((res)=>{
      this.spinner.show(); 

      setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 5000);
      this.showToasterSuccess('Opération bien effectué', 'supression');
      this.MAR2.getSource().refresh();
    }, (err)=>{
      console.log(err);
    })

  
  }
  this.fromLrs =false;
  }

  onSubmitEdit(f: NgForm) {
    // this.object = {
    //   route_id: this.currentId,
    //   route_name: f.value.Nom,
    // };

    // this.lrsServiceService.updateRouteInfo(this.object).subscribe(
    //   (r) => {},
    //   (err: HttpErrorResponse) => {}
    // );
    if(this.fromLrs){
      this.object = {
      route_name: this.name,
      pkd1: this.pkdd1,
      pkf1:this.pkfd1,
      pkd2:this.pkdd,
      pkf2:this.pkfd,
      voie:this.voie
    }
    if(this.name = this.name1){

      this.lrsServiceService.changePKByAtt(this.object).subscribe((res)=>{
        this.spinner.show(); 

        setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
        this.showToasterSuccess('Opération bien effectué', 'les pk sont modifiée');

        this.MAR2.getSource().refresh();  
      }, (err)=>{
        console.log(err);
      })

    }else{
      this.object2 = {
        name:this.name,
        name1:this.name1
      }
      this.lrsServiceService.change_name(this.object2).subscribe((res)=>{
        this.spinner.show(); 

        setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
        this.showToasterSuccess('Opération bien effectué', 'le nom a été modifié');

        if(this.pkdd !=this.pkdd1||this.pkfd !=this.pkfd1){
          this.lrsServiceService.changePKByAtt(this.object).subscribe((res)=>{
            // console.log(res);
            this.MAR2.getSource().refresh();
          }, (err)=>{
            console.log(err);
          })

        }

      }, (err)=>{
        console.log(err);
      })
    }
    this.fromLrs =false;
  
    } else{
      this.object = {
        route_id: this.currentId,
        pkd:this.pkdd,
        pkf:this.pkfd
      }

      if(this.name = this.name1){

        this.lrsServiceService.changePKByID(this.object).subscribe((res)=>{
          // console.log(res);
        }, (err)=>{
          console.log(err);
        })
  
      }else{
        this.object2 = {
          name:this.name,
          name1:this.name1
        }
        this.lrsServiceService.change_name(this.object2).subscribe((res)=>{
          this.spinner.show(); 

          setTimeout(() => {
              /** spinner ends after 5 seconds */
              this.spinner.hide();
            }, 5000);
          this.showToasterSuccess('Opération bien effectué', 'le nom a été modifié');
          if(this.pkdd !=this.pkdd1||this.pkfd !=this.pkfd1){
            this.lrsServiceService.changePKByID(this.object).subscribe((res)=>{
              // console.log(res);
              this.MAR2.getSource().refresh();
            }, (err)=>{
              console.log(err);
            })
  
          }
  
        }, (err)=>{
          console.log(err);
        })
      }




    }
    this.fromLrs =false;
  }

  onLabelEdit(f: NgForm) {
    var data = {
      symbology_id: 8,
      symbology: JSON.stringify(this.lines.getObjStyle),
    };
    // console.log(this.lines.getObjStyle);

    this.lrsServiceService.updateStyle(data).subscribe(
      (res) => {
      
          this.spinner.show(); 
      
      
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

        this.getLrsLabelStyle();
        this.showToasterSuccess('Opération bien effectué', 'le style a été modifié');
       
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  onLabelEtatEdit(f: NgForm) {
    var data = {
      symbology_id: 9,
      symbology: JSON.stringify(this.EtatRoute.getObjStyle),
    };

    this.lrsServiceService.updateStyle(data).subscribe(
      (res) => {
      
        
          this.spinner.show(); 
      
      
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);


        this.getAccidentLabelStyle();
        this.showToasterSuccess('Opération bien effectué', 'le style a été modifié');
        
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  onAccidentEtatEdit(f: NgForm) {
    var data = {
      symbology_id: 11,
      symbology: JSON.stringify(this.AccidentLabeStyle.getObjStyle),
    };

    this.lrsServiceService.updateStyle(data).subscribe(
      (res) => {
    
          this.spinner.show(); 
      
      
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
        this.getEtatLabelStyle();
        this.showToasterSuccess('Opération bien effectué', 'le style a été modifié');
       
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  onStyleEtatEdit(f: NgForm) {
    var data = {
      symbology_id: 10,
      symbology: JSON.stringify(this.etatStyle.getObjStyle),
    };

    this.lrsServiceService.updateStyle(data).subscribe(
      (res) => {
      
          this.spinner.show(); 
      
      
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

        this.getEtatColorStyle();
        this.showToasterSuccess('Opération bien effectué', 'le style a été modifié');
      
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  onStyleACCIDENTEdit(f: NgForm) {
    var data = {
      symbology_id: 21,
      symbology: JSON.stringify(this.accidentStyle.getObjStyle),
    };

    this.lrsServiceService.updateStyle(data).subscribe(
      (res) => {
      
          this.spinner.show(); 
       
      
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

        this.getAccidentColorStyle();
        this.showToasterSuccess('Opération bien effectué', 'le style a été modifié');
       
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  getAccidentColorStyle() {
    this.lrsServiceService.getStyleById3(21).subscribe(
      (res) => {
        this.accidentStyle = new ACCIDENTStyle(
          res.radius,
          res.color,
          res.Ocolor,
          res.strokWidht,
          res.minRadius,
          res.maxRadius
        );
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }
  getEtatColorStyle() {
    this.lrsServiceService.getStyleById2(10).subscribe(
      (res) => {
        // console.warn(this.etatStyle);

        this.etatStyle = new EtatStyle(res.color1, res.color2, res.color3);
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  getLrsLabelStyle() {
    this.lrsServiceService.getStyleById(8).subscribe(
      (res) => {
        this.lines = new LineStyle(
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
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }
  getEtatLabelStyle() {
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
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }
  getAccidentLabelStyle() {
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
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  addMapLayerList() {
    $(document).ready(() => {
      $.ajax({
        type: "GET",
        url: "http://localhost:8081/geoserver/wfs?request=getCapabilities",
        dataType: "xml",
        success: function (xml) {
          var select = $("#selectLayer");
          select.append("<option class='ddindent' value=''></option>");
          $(xml)
            .find("FeatureType")
            .each(function () {
              $(this)
                .find("Name")
                .each(function () {
                  var value = $(this).text();
                  select.append(
                    "<option class='ddindent' value='" +
                      value +
                      "'>" +
                      value +
                      "</option>"
                  );
                });
            });
        },
      });
    });
  }

  lineStyleFunction(feature, resolution, data, type) {
    return new Style({
      stroke: new Stroke({
        color: "green",
        width: 2,
      }),
      text: this.createTextStyle(feature, resolution, data, type),
    });
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

  EnChangeRef(value) {
    // console.log(value);
    // console.log(this.extension);
  }
  voieFunction(value) {
    // console.log(value);
  }
  //todo
  eventTypeVhanged(value) {
    var c1 = document.getElementById("c1") as HTMLInputElement;
    var c2 = document.getElementById("c2") as HTMLInputElement;
    var c3 = document.getElementById("c3") as HTMLInputElement;
    var d1 = document.getElementById("d1") as HTMLInputElement;
    var d2 = document.getElementById("d2") as HTMLInputElement;
    var d3 = document.getElementById("d3") as HTMLInputElement;
    var t1 = document.getElementById("t1") as HTMLInputElement;
    var t2 = document.getElementById("t2") as HTMLInputElement;
    var t3 = document.getElementById("t3") as HTMLInputElement;
    c1.disabled = true;
    c2.disabled = true;
    c3.disabled = true;
    t1.disabled = true;
    t2.disabled = true;
    t3.disabled = true;
    d1.disabled = true;
    d2.disabled = true;
    d3.disabled = true;
    this.c1Name = "";
    this.c2Name = "";
    this.c3Name = "";
    this.d1Name ="";
    this.d2Name ="";
    this.d3Name ="";
    this.t1Name = "";
    this.t2Name = "";
    this.t3Name = "";

    // console.log(value);
    if (value) {
      this.lrsServiceService.getEventParams(value).subscribe(
        (res) => {
          for (let i of res) {
            // console.log(i);

            var ff = document.getElementById(
              i["champ_db_stock"]
            ) as HTMLInputElement;
            // console.log(ff);
            ff.disabled = false;
            if (i["champ_db_stock"] == "c1") this.c1Name = i["champs_event"];
            else
            if (i["champ_db_stock"] == "c2") this.c2Name = i["champs_event"];
             else
            if (i["champ_db_stock"] == "c3") this.c3Name = i["champs_event"];
            else
            if (i["champ_db_stock"] == "d1") this.d1Name = i["champs_event"];
            else 
            if (i["champ_db_stock"] == "d2") this.d2Name = i["champs_event"];
            else 
            if (i["champ_db_stock"] == "d3") this.d3Name = i["champs_event"];
            else
            if (i["champ_db_stock"] == "t1") this.t1Name = i["champs_event"];
            
            if (i["champ_db_stock"] == "t2") this.t2Name = i["champs_event"];
            else
            if (i["champ_db_stock"] == "t3") this.t3Name = i["champs_event"];
           
          }
        },
        (err: HttpErrorResponse) => {
          this.showToasterWarning('something goes wrong', 'check that you did that properly');
        }
      );
    }
  }

  eventTypeVhangedVolee(value) {
    this.c1Volee=false ;
    this.c2Volee=false ;
    this.d1Volee=false ;
    this.d2Volee=false ;
    this.t2Volee=false ;
    this.t3Volee=false ;
    this.t1Volee=false ;
    this.d3Volee=false ;
    this.c3Volee=false ;
    
    this.c1Name = "";
    this.c2Name = "";
    this.c3Name = "";
    this.d1Name ="";
    this.d2Name ="";
    this.d3Name ="";
    this.t1Name = "";
    this.t2Name = "";
    this.t3Name = "";

    // console.log(value);
    if (value) {
      this.lrsServiceService.getEventParams(value).subscribe(
        (res) => {
          for (let i of res) {
            // console.log(i);

            if (i["champ_db_stock"] == "c1"){
              this.c1Name = i["champs_event"];
              this.c1Volee = true
            } 
            else
            if (i["champ_db_stock"] == "c2"){
              this.c2Volee = true
              this.c2Name = i["champs_event"];
            } 
             else
            if (i["champ_db_stock"] == "c3"){
              this.c3Name = i["champs_event"];
              this.c3Volee = true

            } 
            else
            if (i["champ_db_stock"] == "d1"){
              this.d1Name = i["champs_event"];
              this.d1Volee = true;
            } 
            else 
            if (i["champ_db_stock"] == "d2"){
              this.d2Name = i["champs_event"];
              this.d2Volee = true;
            } 
            else 
            if (i["champ_db_stock"] == "d3"){
              this.d3Name = i["champs_event"];
              this.d3Volee = true;
            } 
            else
            if (i["champ_db_stock"] == "t1"){
              this.t1Name = i["champs_event"];
              this.t1Volee = true;
            } 
            
            if (i["champ_db_stock"] == "t2"){
              this.t2Name = i["champs_event"];
              this.t2Volee = true;
            } 
            else
            if (i["champ_db_stock"] == "t3"){
              this.t3Name = i["champs_event"];
              this.t3Volee = true;
            } 
           
          }
        },
        (err: HttpErrorResponse) => {
          this.showToasterWarning('something goes wrong', 'check that you did that properly');
        }
      );
    }
  }

  getEventTtype() {
    this.lrsServiceService.getEventypes().subscribe(
      (res) => {
        this.thematiques = res;
        // console.warn(this.thematiques);
      },
      (err: HttpErrorResponse) => {
        this.showToasterWarning('something goes wrong', 'check that you did that properly');
      }
    );
  }

  onFileSelect(event) {
    // console.log(event.target.files[0])
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.currentFileImage = file;
    }
  }

  onSubmit_upload(data, eventType) {
    const formData = new FormData();
    formData.append("file", this.currentFileImage);
    formData.append("event_type", eventType);
    formData.append("data", JSON.stringify(data));

    this.httpClient
      .post<any>("http://localhost:8091/LrsEvent/uploadFile", formData)
      .subscribe(
        (res) => {
          
            this.spinner.show(); 
         
        
            setTimeout(() => {
              /** spinner ends after 5 seconds */
              this.spinner.hide();
            }, 5000);
          this.returnparamsName(res);
          this.showToasterSuccess('Opération bien effectué', 'données sont modifié');

          if (res.image != "") {
            this.image = "http://localhost:8091/" + res.image;
          }
          this.return();
   
        },
        (err) => console.log(err)
      );
  }


  getEvent(){
    this.lrsServiceService.getEventypes().subscribe(
      (res) => {
        this.events = res;
        for(let i = 0;i<this.events.length;i++){
          this.paramschecked.push(res[i]['id']);
          if(res[i]['id']){

            if(this.selectedEvent == ""){
              this.selectedEvent  =  this.selectedEvent + "'" + res[i]['id'] + "'"
            }else{
              this.selectedEvent  =  this.selectedEvent + ",'" + res[i]['id']+ "'"
            }

          }
          
        }

        
        this.accident.getSource().refresh();
        this.linear_events.getSource().refresh()


      },
      (err: HttpErrorResponse) => this.showToasterWarning('something goes wrong', 'check that you did that properly')
      )
  }


  getAllParams(){
    this.name = "";
    this.lrsServiceService.getAllEventParams().subscribe(
      (res) => {
        this.params =res
    
       
        
      },
      (err: HttpErrorResponse) => this.showToasterWarning('something goes wrong', 'check that you did that properly')

    );
  }

  returnparamsName(db_stock) {
    this.eventName = "";
    this.eventParamsEdit = [];
    this.event_id = db_stock["ID"];
    

    if (db_stock["ID"] && !db_stock["PKD"] && !db_stock["PKF"]) {
      this.eventParams = [
        { title: "Evenement No tt:", value: db_stock["ID"] },
        { title: "Nom de la route :", value: db_stock["ROUTE_NAME"] },
        { title: "PKEVENT :", value: db_stock["PKEVENT"] },
        { title: "VOIE :", value: db_stock["VOIE"] },
      ];
      this.thematique_id = db_stock["EVENT_TYPE_ID"];
      // console.log("zobzob");
    } else if (db_stock["id"] && !db_stock["pkd"]) {
      this.event_id = db_stock["id"];
      this.eventParams = [
        { title: "Evenement No :", value: db_stock["id"] },
        { title: "Nom de la route DD:", value: db_stock["route_name"] },
        { title: "PKEVENT :", value: db_stock["pkEvent"] },
        { title: "VOIE :", value: db_stock["voie"] },
      ];
      this.thematique_id = db_stock["event_type"].id;
    } else if (db_stock["PKD"] || db_stock["PKF"]) {
      this.event_id = db_stock["ID"];
      this.eventParams = [
        { title: "Evenement No :", value: db_stock["ID"] },
        { title: "Nom de la route :", value: db_stock["ROUTE_NAME"] },
        { title: "PK Début :", value: db_stock["PKD"] },
        { title: "PK fin :", value: db_stock["PKF"] },
        { title: "VOIE :", value: db_stock["VOIE"] },
      ];
      this.thematique_id = db_stock["EVENT_TYPE_ID"];
    } else if (db_stock["pkd"] || db_stock["pkf"]) {
      this.event_id = db_stock["id"];
      this.eventParams = [
        { title: "Evenement No :", value: db_stock["id"] },
        { title: "Nom de la route :", value: db_stock["route_name"] },
        { title: "PK Début :", value: db_stock["pkd"] },
        { title: "PK fin :", value: db_stock["pkf"] },
        { title: "VOIE :", value: db_stock["voie"] },
      ];
      this.thematique_id = db_stock["event_type"].id;
    }

    // console.log(this.thematique_id);
    var keys = Object.keys(db_stock);
    for (let j = 0; j < keys.length; j++) {
      for (var i of this.params) {
        if (
          i["eventType"].id == this.thematique_id &&
          i["champ_db_stock"].toLowerCase() == keys[j].toLowerCase()
        ) {
          this.eventParams.push({
            title: i["champs_event"],
            value: db_stock[keys[j]],
          });
          this.eventParamsEdit.push({
            title: i["champs_event"],
            value: db_stock[keys[j]],
          });
          this.eventName = i["eventType"].name;
        }
      }
    }

    // console.log(this.eventParamsEdit);
  }

  modifierPoitEvent() {
    this.edited = true;
  }
  return() {
    this.edited = false;
  }

  saveEvent(f: NgForm) {
    this.objectPoint["id"] = this.event_id;
    for (let i = 0; i < this.eventParamsEdit.length; i++) {
      this.objectPoint[
        this.reconvert(this.eventParamsEdit[i].title, this.thematique_id)
      ] = (<HTMLInputElement>(
        document.getElementById(this.eventParamsEdit[i].title)
      )).value;
    }

    // console.log(this.objectPoint);

    this.onSubmit_upload(this.objectPoint, "ponctuel");
  }

  saveEventLinear(f: NgForm) {
    // console.log(f.value);
    // console.log("hana");
    this.objectLine["id"] = this.event_id;
    // console.warn(this.event_id);
    // console.log(this.eventParamsEdit);
    for (let i = 0; i < this.eventParamsEdit.length; i++) {
      console.warn(
        (<HTMLInputElement>(
          document.getElementById(this.eventParamsEdit[i].title)
        )).value
      );
      this.objectLine[
        this.reconvert(this.eventParamsEdit[i].title, this.thematique_id)
      ] = (<HTMLInputElement>(
        document.getElementById(this.eventParamsEdit[i].title)
      )).value;
    }

    // console.log(this.objectLine);
    // console.warn(this.objectLine);

    // console.log("hana");
    this.onSubmit_upload(this.objectLine, "linear");
  }

  reconvert(name: string, thematique_id) {
    for (var i of this.params) {
      if (
        i["eventType"].id == thematique_id &&
        i["champs_event"].toLowerCase() == name.toLowerCase()
      ) {
        return i["champ_db_stock"];
      }
    }
  }

  addQuantity() {  
    if(this.productForm.value.quantities.length <= 9){
      // console.log(this.productForm.value.quantities);
      this.quantities().push(this.newQuantity());  
    }
    

  } 

  quantities() : FormArray {  
    return this.productForm.get("quantities") as FormArray  
  }  
  newQuantity(): FormGroup {  
    return this.fb.group({  
      attributes_table: '',  
      attributes_toSaveOnDataBase: '',  
    })  
  }  

  removeQuantity(i:number) {  
    this.quantities().removeAt(i);  
  }  
  onSubmitTest() {  
    // console.log(this.productForm.value.quantities)  
  }  
  event_type(){
    this.lrsServiceService.getAllEventType().subscribe((res) => {
      this.eventTypes = res;

    });

  }
  event_exist(){
    for(var i of this.eventTypes){
      if(i == this.thmeatiqueName){
        return true;
       
      }
     
    }
    return false;


  }


   addEvent_typePoint(){

   
    this.layer.setSource(
      new VectorSource({
        features: [this.accuracyFeature, this.positionFeature],
      })
    )
 

setTimeout(()=>{
  this.flyTo(this.coordinates, function () {});
},1000)
 





    this.event = "ponctuel"
  console.log("hello world");
    document.getElementById("closing").click();
    document.getElementById("submit_par").style.visibility = "hidden"
    //todo
 
    //tt
    if(!this.event_exist()){

      this.lrsServiceService.saveEventType2(this.productForm.value['name']).subscribe(res=>{
       
          this.spinner.show(); 
       
      
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

        this.lrsServiceService.currentEventVolee = res;
        this.showToasterSuccess('Opération bien effectué', 'évenement a été ajouté');

        for(let i=0;i<this.productForm.value['quantities'].length;i++){
          this.saved={
            champ_db_stock:this.productForm.value['quantities'][i]['attributes_toSaveOnDataBase'],
            champs_event:this.productForm.value['quantities'][i]['attributes_table'],
            id_event:res
          }
          this.lrsServiceService.addParams(this.saved).subscribe(res=>{

            this.event_type();   // document.getElementById("addPoint").style.visibility = "visible";
        this.singlePoint = true;
        this.map.removeInteraction(this.draw);
        this.addInteraction("Point");
        this.lrsServiceService.volee = true;
           
            this.event_type();
            this.point1444 = true;
         //todo
    
    // featureInfoButton.setAttribute("data-toggle", "modal");
    // featureInfoButton.setAttribute("data-target", "#ModalVolee");
    // featureInfoButton.style.visibility = "hidden";

          
          },err=>{
            console.log(err)
            this.event_type();

       


            
            
          })
        }
      
   
      },err=>console.log(err))

    }else{

      this.event_type();   // document.getElementById("addPoint").style.visibility = "visible";
        this.singlePoint = true;
        this.map.removeInteraction(this.draw);
        this.addInteraction("Point");
        this.lrsServiceService.volee = true;
           
            this.event_type();
            this.point1444 = true;

    }

    
    

   
  }

  checkpermitions(){
    this.notPictured = true

    navigator.mediaDevices.getUserMedia({
      video:{
        width:500,
        height:500
      }
    }).then((res)=>{
      this.stream = res

    }).catch((err)=>{
      console.log(err)
    })
  }
  captrueImage(){
     this.trigger.next();
  }

  snapshot(event:WebcamImage){
    // console.log(event)
    this.notPictured = false
    this.previewImage = event.imageAsDataUrl;
  }





   addEvent_typeLine(){

    
    this.layer.setSource(
      new VectorSource({
        features: [this.accuracyFeature, this.positionFeature],
      })
    )


setTimeout(()=>{
  this.flyTo(this.coordinates, function () {});
},300)




    this.event = "linear";
    this.twopoints = true;
    this.singlePoint = false;
    document.getElementById("closing").click();
    document.getElementById("submit_par").style.visibility = "hidden"

    if(!this.event_exist()){

    this.lrsServiceService.saveEventType2(this.productForm.value['name']).subscribe(res=>{
    
        this.spinner.show(); 
  
    
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 5000);
      this.lrsServiceService.currentEventVolee = res;
      this.showToasterSuccess('Opération bien effectué', 'évenement a été ajouté');

      for(let i=0;i<this.productForm.value['quantities'].length;i++){
        this.saved={
          champ_db_stock:this.productForm.value['quantities'][i]['attributes_toSaveOnDataBase'],
          champs_event:this.productForm.value['quantities'][i]['attributes_table'],
          id_event:res
        }
        this.lrsServiceService.addParams(this.saved).subscribe(res=>{},err=>{
          // console.log(err)
          this.event_type();
        })
      }
      document.getElementById("addPoint").style.visibility = "visible";
      this.singlePoint = false;
      this.point1444 = false;
      this.twopoints = true;
      this.lrsServiceService.volee = true;
      // console.error(this.lrsServiceService.volee)
      this.map.removeInteraction(this.draw);
      this.addInteraction("Point");
      this.event_type();
  
    },err=>console.log(err))


  }else{
    this.event_type();   // document.getElementById("addPoint").style.visibility = "visible";
    this.twopoints = true;
    this.map.removeInteraction(this.draw);
    this.addInteraction("Point");
    this.lrsServiceService.volee = true;
       
        this.event_type();
        this.singlePoint = false;
        this.point1444 = false;
        this.twopoints = true;
  }


  }


  delete(){
    // console.log("velee",this.lrsServiceService.volee)
    // console.log("velee",this.lrsServiceService.currentEventVolee)
    if(this.lrsServiceService.volee){
      this.lrsServiceService.deletethAtAll(this.lrsServiceService.currentEventVolee).subscribe(res=>{
    
          this.spinner.show(); 
     
      
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);

      this.showToasterSuccess('Opération bien effectué', 'suppression a été effectué');

      this.event_type();
        
      },err=>{
        console.log(err);
      })
    }


  }


  getRoutesName(){
    setTimeout(()=>{
      this.lrsServiceService.getRouteNames().subscribe(
        res=>{
        this.routes = res;
        // console.log(res)
        
        }
        ,err=>{console.log(err)})
    },1500)
    
  }
  onchangeRoute(vv){
    this.selectedRoute = vv;
  }

   onchangeVoie(evv){
    this.selectedVoie = evv
  }
  onchangeRouteTable(vv){
    this.selectedRouteT = vv;
    this.object1 = {
      route_name:this.selectedRouteT,
      voie:this.selectedVoieT
    }
    this.lrsServiceService.getVideosList(this.object1).subscribe(
      res=>this.videos = res,err=>console.log(err)
    );
  }

  onchangeVoietable(evv){
    this.selectedVoieT = evv
    this.object1 = {
      route_name:this.selectedRouteT,
      voie:this.selectedVoieT
    }
    this.lrsServiceService.getVideosList(this.object1).subscribe(
      res=>this.videos = res ,err=>console.log(err)
    )

  }


  getMyvideo(v,pkd,pkf,voie,name){
    this.pkfV = pkf;
    this.voie = voie;
    this.pkdV = pkd;  
    this.videoPath  = "http://localhost:8091/LrsEvent/" + v;
    this.visibleVideo = true;
    // console.log(v)
    this.vid = <HTMLVideoElement> document.getElementById("myvideo");

    this.routeName = name;     
  }

  ee(ee){
    this.vid = <HTMLVideoElement> document.getElementById("myvideo");
    //  console.log(this.vid.currentTime)
   this.refreshIntervalId = setInterval(
    ()=>{ 
      // console.log(this.vid.currentTime)
      // this.vitess = (this.pkfV - this.pkdV) / (this.vid.duration);
      this.vitess = (this.pkfV -this.pkdV) / (this.vid.duration);
      // console.log("this.vitess",this.vitess)
      this.mesure = this.pkdV + this.vitess * this.vid.currentTime
      // console.log("this.mesure",this.mesure)
      this.object12 ={
        pkEvent: this.mesure,
        voie:1,
        route_name:this.routeName,
      }
      this.lrsServiceService.getPositionfeature(this.object12).subscribe((res)=>{
           this.mediumLowPointsrc.clear();
            this.mediumLowPointsrc.addFeatures(
                this.format.readFeatures(res, { featureProjection: "EPSG:4326" })
              );

      this.mediumLowPointsrc.on('addfeature', () =>{
        this.map.getView().fit(
            this.mediumLowPointsrc.getExtent(),
            { duration: 300, size: this.map.getSize(), maxZoom: 18 }
        );
      }); 
      

      }, err=>{
        console.log(err);
      })
    }
  
   , 1000);

  }
  pp(ee){
    clearInterval(this.refreshIntervalId);
  }


  //////////////////Mesure14///////////////////////////////
 formatLength = (line)=> {
  const length = getLength(line);
  let output;
 
    output = Math.round(length * 100) + ' ' + 'km';
  
  return output;
};


 addInteraction1(){
  // const type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
  console.log("add interaction")
  const type = 'LineString';
  this.draw1 = new Draw({
    source: this.sourceMesure,
    type: type,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    }),
  });
  this.map.addInteraction(this.draw1);
  console.log('add interaction1')
  console.log('lah ir7em lwaliden')

  // this.createMeasureTooltip();
  console.log('add interaction2')
  
  this.createHelpTooltip();
  
  console.log("jello")
  this.draw1.on('drawstart', (evt)=> {
    // set sketch
    //  console.log("drawstart")
     console.log(this.sketch);

    this.sketch = evt.feature;

    let tooltipCoord = evt.coordinate;

    this.listener = this.sketch.getGeometry().on('change', (evt)=> {
       
      // console.log("tooltipCoord")
      const geom = evt.target;
      let output;
       if (geom instanceof LineString) {
        output = this.formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
        // console.log('tooltipCoord',tooltipCoord)
      }
      console.log("drawstart" , output);
      if(!this.measureTooltipElement){
        this.createMeasureTooltip()
      }
      this.measureTooltipElement.innerHTML = output;
      this.measureTooltip.setPosition(tooltipCoord);
    });
  });

  this.draw1.on('drawend',  ()=> {
    console.log("hello mother fucker")
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    this.measureTooltip.setOffset([0, -7]);
    // unset sketch
    this.sketch = null;
    // unset tooltip so that a new one can be created
    this.measureTooltipElement = null;
    this.createMeasureTooltip();
    unByKey(this.listener);
  });
}



createMeasureTooltip() {

  if (this.measureTooltipElement) {
    this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
  }


  this.measureTooltipElement = document.createElement('div');
 
  this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
 
  this.measureTooltip = new Overlay({
    element: this.measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center',
    stopEvent: false,
    insertFirst: false,
  });
  
  this.map.addOverlay(this.measureTooltip);
  // console.log("hello chamakchello")
}


createHelpTooltip() { 
  console.log("createHelpTooltip")
  if (this.helpTooltipElement) {
    this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
  }
  this.helpTooltipElement = document.createElement('div');
  this.helpTooltipElement.className = 'ol-tooltip hidden';
  this.helpTooltip = new Overlay({
    element: this.helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left',
  });
  this.map.addOverlay(this.helpTooltip);
}




 



  


  //////////////////Mesure14///////////////////////////////
  saveEventvideo(f: NgForm){
    // console.log(this.selectedRoute);
    // console.log(this.selectedVoie);
    // console.log(this.videoName);
    // console.log(this.pkd);
    // console.log(this.pkf);
    const formData = new FormData();

    formData.append("file", this.currentFileImage);
    formData.append("selectedRoute", this.selectedRoute);
    formData.append("selectedVoie", this.selectedVoie);
    formData.append("videoName", this.videoName);
    formData.append("pkd", this.pkd);
    formData.append("pkf", this.pkf);


    this.httpClient
      .post<any>("http://localhost:8091/LrsEvent/saveEventvideo", formData)
      .subscribe(
        (res) => {
          
            this.spinner.show(); 
         
        
            setTimeout(() => {
              /** spinner ends after 5 seconds */
              this.spinner.hide();
            }, 5000);

        // console.log(res);
        this.showToasterSuccess('Opération bien effectué', 'video a été ajouté');
       
        },
        (err) => console.log(err)
      );

  }
  closeVideo(){
    clearInterval(this.refreshIntervalId);
    this.visibleVideo = false;
    this.mediumLowPointsrc.clear();

  }
  videoNameF(event){
   this.videoName = event.target.value;
  }

  pkdF(event){
   this.pkd = event.target.value;
  }
  pkfF(event){
    this.pkf = event.target.value;
   
  }

  spacest(){
    if(this.t1Volee || this.t2Volee || this.t3Volee ){
      return true;
    }
    return false
  }
  spacesd(){
    if(this.d1Volee || this.d2Volee || this.d3Volee ){
      return true;
    }
    return false
  }
  el(id) {
    return document.getElementById(id);
  }

   flyTo(location, done) {
    const duration = 2000;
    const zoom = this.mapView.getZoom();
    let parts = 2;
    let called = false;
    function callback(complete) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    this.mapView.animate(
      {
        center: location,
        duration: duration,
      },
      callback
    );
    this.mapView.animate(
      {
        zoom: zoom - 1,
        duration: duration / 2,
      },
      {
        zoom: zoom,
        duration: duration / 2,
      },
      callback
    );
  }

adddMarker(){
  this.track = true;

  this.positionFeature = new Feature();
this.positionFeature.setStyle(
new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#3399CC',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 2,
    }),
  }),
})
);

  const geolocation = new Geolocation({
    // enableHighAccuracy must be set to true to have the heading value.
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: this.mapView.getProjection(),
  });

    geolocation.setTracking(this.track);

  this.accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry',  () => {
this.accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});
geolocation.on('change:position',  ()=> {
const coordinates = geolocation.getPosition();
this.coordinates = coordinates

this.positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});
//todo
this.layer = new VectorLayer({

source: new VectorSource(),
})

this.map.addLayer(
this.layer
)
}



verifyy(){
  if(this.name == this.name1 && this.pkdd ==this.pkdd1&&this.pkfd ==this.pkfd1 ){
    return true 
  }
  return false;

}
pkddF(vll){
  // console.log(vll.target.value);
  this.pkdd = vll.target.value;
}
nameF(vll){
  // console.log(vll.target.value);
  this.name = vll.target.value;
}
pkfdF(vll){
  // console.log(vll.target.value);
  this.pkfd = vll.target.value;
}


fileChangeListenerP($event: any): void {

  const files = $event.srcElement.files;
  this.header = true;

  this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ';' })
    .pipe().subscribe({
      next: (result): void => {
        // console.log('Result', result);
        this.csvRecords = result;

        this.headerTable = Object.keys(this.csvRecords[0])
        this.verification = true;
      
        if(this.headerTable.includes("route_name")&& this.headerTable.includes("pkd") && this.headerTable.includes("pkf") && this.headerTable.includes("voie"),this.headerTable.includes("geometry")){
          this.verification = false;
        }
                

      },
      error: (error: NgxCSVParserError): void => {
        console.log('Error', error);
      }
    });
}


fileChangeListener($event: any): void {

  const files = $event.srcElement.files;
  this.header = true;

  this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ';' })
    .pipe().subscribe({
      next: (result): void => {
        // console.log('Result', result);
        this.csvRecords = result;
 
        this.headerTable = Object.keys(this.csvRecords[0])
        this.verificationr = true;
      
        if(this.headerTable.includes("geometry")){
          this.verificationr = false;
        }

      },
      error: (error: NgxCSVParserError): void => {
        console.log('Error', error);
      }
    });
}



submitRoute(){
  if(!this.verificationr){
    this.validate = true;
    let inc = 0;
     if(this.csvRecords){
      
      if(this.csvRecords.length>1){
        this.validate = false;
      }

         if(this.validate == true){
           this.object = {
             route_name:this.selectedRouteT,
             voie:this.selectedVoieT,
             geometry:this.csvRecords[0]['geometry'],
             reference:this.selectedrefT
           }

 

           this.lrsServiceService.addSectioncsv(this.object).subscribe(
            (r) => {
              this.spinner.show(); 

              setTimeout(() => {
                  /** spinner ends after 5 seconds */
                  this.spinner.hide();
                }, 5000);
              this.MAR2.getSource().refresh();
              this.showToasterSuccess('Opération bien effectué', 'Section a été ajouté');

            

            },
            (err: HttpErrorResponse) => {
              this.showToasterWarning('something goes wrong', 'check that you did that properly');

            }
          );


         }
       
     }
    
    
    



  }
}

submitRef(){
  // console.log(this.verification)
  // console.log(this.csvRecords)

  if(!this.verification){
    this.validate = true;
    let inc = 0;
     if(this.csvRecords){
      for(let i in this.csvRecords){
        this.csvRecords[i]['reference'] = 2;
        console.warn(Object.keys(this.csvRecords[i]))
        if(Object.keys(this.csvRecords[i]).length == 6){
          this.validate = true;
        }else this.validate = false;

      }

      for(let i = 0 ; i<this.csvRecords.length;i++){
      for( let j = (i + 1);j < this.csvRecords.length; j++){
        if(this.csvRecords[i]['route_name'] == this.csvRecords[j]['route_name']){
          this.validate = false
        }
       }
      }

         if(this.validate == true){
          this.lrsServiceService.addRef(this.csvRecords).subscribe(res=>{
            this.spinner.show(); 

            setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
              }, 5000);
            this.MAR2.getSource().refresh();
            this.showToasterSuccess('Opération bien effectué', 'Référence a été ajouté');

          },err=>{
            console.log(err)
          })
         }
       
     }
    
    
    



  }
}


getref(){
  this.lrsServiceService.getreference().subscribe((res)=>{
this.importation = res == "true"? true:false;
// console.log("achraf", res)
  },(err)=>{
    console.log(err)
  })
}


onchangereferenciel(val){
  this.selectedrefT = val;
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



returnparamsNames(thematique_id ,db_stock ){
   
  for(var i of this.params){
    if(i['eventType'].id == thematique_id && i['champ_db_stock'] == db_stock ){

      this.object[i['champs_event']] = this.object[db_stock];
      delete this.object[db_stock]
    }
  }

}

titre(val){
  // console.log(val)
  // console.log(this.val11)
}

body(val){
  // console.log(val) 
  // console.log(this.val12)
}
 
async imprimer(){
  const response = await this.doScreenshot();
  this.createPDFDocument(response);
  this.showToasterInfo('createPDFDocument ', 'Opération en cours');

}

checkedEvents(id){
  
if(this.paramschecked.length > 0){
  this.ver = this.paramschecked.includes(id);
  if(this.ver){
    return true
  }
  return false;
}
}

addedProvince(id){
  

  if(this.checkedEvents(id) == true){
   
    for(let i = 0;i<this.paramschecked.length;i++){ 
  
      if (this.paramschecked[i] === id) { 
        this.paramschecked.splice(i, 1); 
      }
  }
  this.refresh();
  return
  }

  if(this.checkedEvents(id) == false){
   
  this.paramschecked.push(id);
  this.refresh();
     return 
 }
 

  
  

}


refresh(){
  if(this.events){

    this.selectedEvent = "";
    for(let i = 0;i<this.paramschecked.length;i++){
      if(this.paramschecked[i]){
        if(this.selectedEvent == ""){
          this.selectedEvent  =  this.selectedEvent + "'" + this.paramschecked[i] + "'"
        }else{
          this.selectedEvent  =  this.selectedEvent + ",'" + this.paramschecked[i]+ "'"
        }
      }
      
    }
    
    this.accident.getSource().refresh();
    this.linear_events.getSource().refresh();   

  

  }
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

}


