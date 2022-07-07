import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Object } from 'ol';
import { Observable } from 'rxjs';
import { ACCIDENTStyle } from './Models/AccidentStyle';
import { EtatStyle } from './Models/EtatStyle';
import { LinearColor } from './Models/LinearColor';
import { Linear_Event } from './Models/LineEvent';
import { LineStyle } from './Models/LineStyle';
import { Point_Event } from './Models/Point_model';

@Injectable({
  providedIn: 'root'
})
export class LrsServiceService {
   
   currentEventVolee;
   volee = false;
   
  public users:any[] =[];

  public getUserByid(data){
    for(let i = 0;i<this.users.length;i++){
      if(this.users[i].id == data) {return this.users[i];}

    }
  }

  private apiUrl = 'http://localhost:8091';
  csvRecords: any;
  constructor(private httpClient: HttpClient) { }


  private accesTocken = localStorage.getItem("access_token");
  private  refresh_token= localStorage.getItem("refresh_token");

  private  options1 = {
    headers: new HttpHeaders().set('Authorization', "Bearer " + this.accesTocken)
  };
  
  private  options2 = {
    headers: new HttpHeaders().set('Authorization', "Bearer " +this.refresh_token)
  };

//   public getEmloyees():Observable<Employee[]>{
//     return this.httpClient.get<Employee[]>(`${this.apiUrl}/Employee/all`this.options1);
// }

// public updateEmloyees(employee:Employee):Observable<Employee>{
//     return this.httpClient.put<Employee>(`${this.apiUrl}/Employee/update`,employee);
// }
// public deleteEmloyees(employee_id:Number):Observable<void>{
//     return this.httpClient.delete<void>(`${this.apiUrl}/Employee/delete/${employee_id}`this.options1);
// }


public addLineEvent(data:Array<Linear_Event>):Observable<void>{
 
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addLineEvent`,data,this.options1);
}
  public saveUser(data):Observable<Array<Object>>{
  
    return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/user/save`,data,this.options1);
  }

public updateUser(data):Observable<Object>{
 
  return this.httpClient.post<Object>(`${this.apiUrl}/LrsEvent/updateUser`,data,this.options1);
}


public getUsers():Observable<Array<Object>>{
  return this.httpClient.get<Array<Object>>(`${this.apiUrl}/LrsEvent/getUsers`,this.options1);
}


public changePKByAtt(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/changePKByAtt`,data,this.options1);
}
public change_name(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/change_name`,data,this.options1);
}

public changePKByID(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/changePKByID`,data,this.options1);
}
public deleteByID(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/deleteByID`,data,this.options1);
}

public deleteByAtt(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/deleteByAtt`,data,this.options1);
}

public addExistantEventoRoutes(data:any):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addEventsToRoute`,data,this.options1);
}


public getVideosList(data:any):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/getVideosList`,data,this.options1);
}

public getCurrentTime(data:any):Observable<number>{
  return this.httpClient.post<number>(`${this.apiUrl}/LrsEvent/getCurrentTime`,data,this.options1);
}


public addExistantPointEventoRoutes(data:any):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addPointEventsToRoute`,data,this.options1);
}



public PointEvent(data:Array<Point_Event>):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addPointEvent`,data,this.options1);
}

public saveEventType(data:String):Observable<number>{
  return this.httpClient.post<number>(`${this.apiUrl}/LrsEvent/addEventType`,data,this.options1);
}

public saveEventType2(data:String):Observable<number>{
  return this.httpClient.post<number>(`${this.apiUrl}/LrsEvent/addEventType2`,data,this.options1);
}

public deletethAtAll(data:number):Observable<number>{
  return this.httpClient.post<number>(`${this.apiUrl}/LrsEvent/deletethAtAll`,data,this.options1);
}

public addParams(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/saveParams`,data,this.options1);
}

public addSection(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/sectionAdd`,data,this.options1);
}
public addSectioncsv(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addSectioncsv`,data,this.options1);
}

public addRef(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addRef`,data,this.options1);
}


public addNewSection(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addNewSection`,data,this.options1);
}

public addPointFromMap(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addNewPointEvent`,data,this.options1);
}

public addNewLineEventFromMap(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addNewLineEventFromMap`,data,this.options1);
}

public updateRouteInfo(data):Observable<void>{
  return this.httpClient.put<void>(`${this.apiUrl}/LrsEvent/updateRouteInfo`,data,this.options1);
}

public updateStyle(data):Observable<LineStyle>{
  return this.httpClient.put<LineStyle>(`${this.apiUrl}/LrsEvent/updateSumbologyInfo`,data,this.options1);
}

//

public onUpdateStyleColors(data):Observable<LinearColor>{
  return this.httpClient.put<LinearColor>(`${this.apiUrl}/LrsEvent/updatecolorEvent`,data,this.options1);
}
public onUpdateStyleColorsP(data):Observable<LinearColor>{
  return this.httpClient.put<LinearColor>(`${this.apiUrl}/LrsEvent/updatecolorPointEvent`,data,this.options1);
}

public getStyleById(id:Number):Observable<LineStyle>{
  return this.httpClient.post<LineStyle>(`${this.apiUrl}/LrsEvent/getStyleById`,id,this.options1);
}
public getStyleById2(id:Number):Observable<EtatStyle>{
  return this.httpClient.post<EtatStyle>(`${this.apiUrl}/LrsEvent/getStyleById`,id,this.options1);
}

public getRouteIdByName(data:String):Observable<number>{
  return this.httpClient.post<number>(`${this.apiUrl}/LrsEvent/getRouteIdByName`,data,this.options1);
}

public getStyleById3(id:Number):Observable<ACCIDENTStyle>{
  return this.httpClient.post<ACCIDENTStyle>(`${this.apiUrl}/LrsEvent/getStyleById`,id,this.options1);
}

public getEventParams(name:any):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/getEventpByName`,name,this.options1);
}

public getAllEventParams():Observable<Array<Object>>{
  return this.httpClient.get<Array<Object>>(`${this.apiUrl}/LrsEvent/getEvenParams`,this.options1);
}
public createSynoptique(data):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/createSynoptique`,data,this.options1);
}
public createAdvancedSynoptique(data):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/createAdvancedSynoptique`,data,this.options1);
}

public createSynoptiqueLast10(data):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/createSynoptiqueLast10`,data,this.options1);
}

public getRouteNames():Observable<Array<Object>>{
   console.log("getRouteNames",this.options1)
  return this.httpClient.get<Array<Object>>(`${this.apiUrl}/LrsEvent/getRouteNames`,this.options1);
}
public getEventypepByID(id:number):Observable<Object>{
  return this.httpClient.post<Object>(`${this.apiUrl}/LrsEvent/getEventypepByID`,id,this.options1);
}



public getreference():Observable<string>{
  return this.httpClient.get<string>(`${this.apiUrl}/LrsEvent/getreference`,this.options1);
}




public getAllEventType():Observable<Array<string>>{
  return this.httpClient.get<Array<string>>(`${this.apiUrl}/LrsEvent/getAllEventType`,this.options1);
}

public getdistinctValues(data):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getdistinctValues`,data,this.options1);
}
//todo

public getdistinctAttributeValD(data):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getdistinctAttributeValD`,data,this.options1);
}
public getdistinctAttributeValDV(data):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getdistinctAttributeValDV`,data,this.options1);
}
public getdistinctAttributeValFV(data):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getdistinctAttributeValFV`,data,this.options1);
}                             

public getdistinctAttributeValF(data):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getdistinctAttributeValF`,data,this.options1);
}



public getEventypes():Observable<Array<Object>>{
  return this.httpClient.get<Array<Object>>(`${this.apiUrl}/LrsEvent/getEventypes`,this.options1);
}

public getProvinces():Observable<Array<string>>{
  return this.httpClient.get<Array<string>>(`${this.apiUrl}/LrsEvent/getProvinces`,this.options1);
}

public getProvinceByName(data):Observable<Object>{
  return this.httpClient.post<Object>(`${this.apiUrl}/LrsEvent/getProvinceByName`,data,this.options1);
}


public getProvinceJson(data:string):Observable<string>{
  return this.httpClient.post<string>(`${this.apiUrl}/LrsEvent/getProvinceJson`,data,this.options1);
}
public getProvincesJson(data):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getProvincesJson`,data,this.options1);
}

public getBBox(data:String):Observable<Array<number>>{
  return this.httpClient.post<Array<number>>(`${this.apiUrl}/LrsEvent/getBBox`,data,this.options1);
}

public QueryLinearData(data:string):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryLinearData`,data,this.options1);
}
public QueryLinearData2(data:any):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryLinearData2`,data,this.options1);
}
public QueryPonctuelData(data:string):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryPonctuelData`,data,this.options1);
}

public queryPonctuelDataForMap(data):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryPonctuelDataForMap`,data,this.options1);
}
public queryLinearDataForMap(data):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryLinearDataForMap`,data,this.options1);
}

public getPointJson(data:number[]):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getPointJson`,data,this.options1);
}

public getPointEventJson(data:String):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getPointEventJson`,data,this.options1);
}

public getDtataLine(data:String):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/getDtataLine`,data,this.options1);
}
public getDtatapoint(data:String):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/getDtatapoint`,data,this.options1);
}

public getLineEventJson(data:String):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getLineEventJson`,data,this.options1);
}


public getLineJson(data:number[]):Observable<Array<string>>{
  return this.httpClient.post<Array<string>>(`${this.apiUrl}/LrsEvent/getLineJson`,data,this.options1);
}


public MyIntersectionPOintToPoint(data:any):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryPonctuelDataS`,data,this.options1);
}
public MyIntersectionPOintToPointP(data:any):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryPonctuelDataP`,data,this.options1);
}






public queryLinearAndPonctual(data:any):Observable<Array<Object>>{
  return this.httpClient.post<Array<Object>>(`${this.apiUrl}/LrsEvent/queryLinearAndPonctual`,data,this.options1);
}


// public getuserById(id):Agent{
// return this.users[id];
// }
// public getAllUsers():Agent[]{
// return this.users.slice();
// }


public addThematique(data):Observable<void>{
  return this.httpClient.post<void>(`${this.apiUrl}/LrsEvent/addThematiuqe`,data,this.options1);
}

public previewLineResult(data):Observable<Array<String>>{
  return this.httpClient.post<Array<String>>(`${this.apiUrl}/LrsEvent/previewLineResult`,data,this.options1);
}
public getRouteNameByRouteId(data):Observable<string>{
  return this.httpClient.post<string>(`${this.apiUrl}/LrsEvent/getRouteNameByRouteId`,data,this.options1);
}

public  previewPointResult(data):Observable<Array<String>>{
  return this.httpClient.post<Array<String>>(`${this.apiUrl}/LrsEvent/previewPointResult`,data,this.options1);
}

public  getPositionfeature(data):Observable<Array<String>>{
  return this.httpClient.post<Array<String>>(`${this.apiUrl}/LrsEvent/getPositionfeature`,data,this.options1);
}


public addTableToView(data){
  this.csvRecords = data;
}

public getTableToView(){
  return this.csvRecords;
}


}
