import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtClientService {
  private apiUrl = 'http://localhost:8091';
  constructor( private httpClient: HttpClient) {


   }

   public authenticate(request){
    return this.httpClient.post(`${this.apiUrl}/login`,request,{responseType:'text' as 'json'});
   }

   public welcome(token){
  let tokenStr = "Bearer " + token;
  const headers = new HttpHeaders().set("Authorization",tokenStr);
    return this.httpClient.get(`${this.apiUrl}/`,{headers,responseType:'text' as 'json'});
   }
}
