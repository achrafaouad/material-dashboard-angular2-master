
export class Point_Event{
    
    private route_id: Number ;
    private  route_name:String;
    private   pkEvent:Number;
    private  classement:String;
    private  route_geometry:String;

    public constructor(route_id?:Number,route_name?:String,pkEvent?:Number,classement?:String,route_geometry?:String){
        this.route_id = route_id;
        this.route_name = route_name;
        this.pkEvent=pkEvent;
        this.classement = classement;
        this.route_geometry = route_geometry;
    }
    
}

