const whiteList = [
    'http://localhost:5173'
];

export const corsOptions = {
    origin: function(origin: any, callback: any){
        if(whiteList.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('Origin not allowed by CORS'))
        }
    }
}