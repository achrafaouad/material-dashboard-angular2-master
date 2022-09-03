import { AfterViewInit, Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export let ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/table-list', title: 'Importation',  icon:'content_paste', class: '' },
    { path: '/typography', title: 'users',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Requetteur',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/notifications', title: 'Cartographie',  icon:'notifications', class: '' },
    { path: '/synoptique', title: 'synoptique',  icon:'bi bi-bar-chart-steps', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  menuItems: any[];
  fonctionalities: any[]=[];

  constructor() { }

  ngOnInit() {
     console.log(JSON.parse(localStorage.getItem('user')));
     this.fonctionalities = JSON.parse(localStorage.getItem('user')).profil.ihm
    if(JSON.parse(localStorage.getItem('user')).roles[0].name == "simple_user"){
      ROUTES = [
        
        { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
        { path: '/table-list', title: 'Importation',  icon:'content_paste', class: '' },
        { path: '/icons', title: 'Requetteur',  icon:'bubble_chart', class: '' },
        { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
        { path: '/notifications', title: 'Cartographie',  icon:'notifications', class: '' },
        { path: '/synoptique', title: 'synoptique',  icon:'bi bi-bar-chart-steps', class: '' },
    ];
    }else{
      ROUTES = [ 

        { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
        { path: '/typography', title: 'users',  icon:'library_books', class: '' },
        { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
      ]
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    

    
    
  }
  ngAfterViewInit(){
    $(document).ready(function(){
      $(".sub-btn1").click(function(){
        $(".submenu1").slideToggle();
        $(this).find(".dropdown1").toogleClass("rotate");
      });
    });
    $(document).ready(function(){
      $(".sub-btn2").click(function(){
        $(".submenu2").slideToggle();
        $(this).find(".dropdown2").toogleClass("rotate");
      });
    });
    $(document).ready(function(){
      $(".sub-btn3").click(function(){
        $(".submenu3").slideToggle();
        $(this).find(".dropdown3").toogleClass("rotate");
      });
    });

    $(document).ready(function(){
      $(".sub-btn0").click(function(){
        $(".submenu0").slideToggle();
        $(this).find(".dropdown0").toogleClass("rotate");
      });
    });
  }

  
  Profil(){
    if(JSON.parse(localStorage.getItem('user')).roles[0].name == "Role_Admin") {
      return true
    }
    return false
  }
  verifyProfil(data){
    
    if(this.fonctionalities.includes(data) == true ||  JSON.parse(localStorage.getItem('user')).roles[0].name == "Role_Admin" ){
      return true
    }
    return false
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
