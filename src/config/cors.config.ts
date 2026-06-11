import { NEXT_URL } from "./main.config";

const whiteList = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://eventajaaa.vercel.app/",
  "mini-project-fe-alpha.vercel.app",
  NEXT_URL,
].filter(Boolean); // filter out undefined/null values

export const corsOptions = {
    origin: function(origin: any, callback: any){
        // Allow requests with no origin (server-to-server, Postman, etc.)
        if (!origin) {
            callback(null, true);
            return;
        }
        if(whiteList.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    credentials: true,
}
