import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtClientService } from 'app/jwt-client.service';

 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./dd.css']
})
export class LoginComponent implements OnInit {
  title = "CodeSandbox";
  options = {
    fpsLimit: 60,
    particles: {
      shape: {
        options: { confetti: { type: ['circle', 'square'] } },
        type: 'confetti',
      },
      color: {
        value: "#000"
      },
      links: {
        enable: true,
        color: "#000"
      },
      move: {
        enable: true
      }
    }
  };
  
  userType=['admin', 'agent'];
 
  constructor(private jwtClientService:JwtClientService,private http: HttpClient,private _router: Router) {
  }

  ngOnInit(): void {
     
  }
  
  


  onSubmit(form:NgForm){
  console.log(form.value)
  let body = new URLSearchParams();
  body.set('username', form.value.username);
  body.set('password', form.value.password);
  let options = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
};
 

  this.http
    .post('http://localhost:8091/login', body.toString(), options)
    .subscribe(response => {
       console.log(response)

       localStorage.setItem('refresh_token',response["refresh_token"]);
       localStorage.setItem('access_token',response["access_token"]);

       let options2 = {
        headers: new HttpHeaders().set('Authorization', "Bearer " + response["access_token"])
    };

       this.http.post('http://localhost:8091/LrsEvent/getUser',body.toString(), options2 ).subscribe(response => 
       {
        localStorage.setItem('user',JSON.stringify(response));
        console.log(localStorage.getItem('user'));
        console.log(response);
        if(JSON.parse(localStorage.getItem('user')).roles[0].name == "simple_user"){
          this._router.navigate(['maps'])
        }else{
          this._router.navigate(['dashboard'])
        }
        
      },
       err=>{
        console.log(err)
       })


    },err=> console.log(err));
  }


 

    // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    // await loadFull(engine);
  }
  



