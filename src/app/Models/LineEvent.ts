
export class Linear_Event{
    
    private route_id: Number ;
    private  route_name:String;
    private   pkd:Number;
    private  pkf:Number ;
    private  classement:String;
    private  route_geometry:String;

    public constructor(route_id?:Number,route_name?:String,pkd?:Number,pkf?:Number,classement?:String,route_geometry?:String){
        this.route_id = route_id;
        this.route_name = route_name;
        this.pkd = pkd;
        this.pkf = pkf;
        this.classement = classement;
        this.route_geometry = route_geometry;
    }
    
}

