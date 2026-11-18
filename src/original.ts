import {surface,label,panel,rect,amber,mint,persist,read,report,type Frame} from "@shared/surface";
import {loadValues} from "@shared/settings";

function sampleHistory(samples: Sample[], latency: boolean): Frame {
  const recent = samples.slice(-8);
  const scale = Math.max(1,...recent.map(p=>p.ok?p.ms:0));
  return recent.map((p,i)=>{
    const h = !p.ok?2:latency?Math.max(2,Math.round(10*p.ms/scale)):6;
    return rect("probe"+i,48+i*3,15-h,2,h,p.ok?"#72CBA9FF":"#F27A6BFF");
  });
}


type Sample={ok:boolean;ms:number};
type History={endpoint:string;before:Sample[];live:Sample[]};
let history:History={endpoint:"",before:[],live:[]};
let endpoint="",page=0,busy=false,closed=false,lastAttempt=0,notice="Set health URL";
let timer:ReturnType<typeof setInterval>|undefined;
function stats(samples:Sample[]){
 const good=samples.filter(x=>x.ok);
 return {up:samples.length?Math.round(good.length*100/samples.length):null,
         latency:good.length?Math.round(good.reduce((total,x)=>total+x.ms,0)/good.length):null};
}
function metric(value:number|null,unit:string){return value===null?"--":value+unit;}
function summary(samples:Sample[]){
 const s=stats(samples);return metric(s.up,"%")+" / "+metric(s.latency,"ms")+" ("+samples.length+")";
}
function delta(current:number|null,baseline:number|null,unit:string){
 if(current===null||baseline===null)return "--";
 const change=current-baseline;return (change>0?"+":"")+change+unit;
}
function draw():Frame{
 const current=stats(history.live),base=stats(history.before),released=history.before.length>0;
 const value=page?metric(current.latency,"ms"):metric(current.up,"%");
 const headline=!endpoint?"Set URL":!history.live.length?"Waiting":value;
 const heading=(released?"POST ":"PRE ")+(page?"LATENCY":"UPTIME");
 return [label("phase",heading,1,0,amber,"front","tiny"),label("metric",headline,1,7,mint),
 ...sampleHistory(history.live,page===1),
 ...panel("CANARY WATCH",["Now: "+summary(history.live),"Base: "+summary(history.before),
 "Diff: "+delta(current.up,base.up,"pp")+" / "+delta(current.latency,base.latency,"ms"),notice,
 "Click: probe / Wheel: metric",released?"Hold Start: new baseline":"Start: mark release"])];
}
async function probe(){
 if(!endpoint||busy||closed||Date.now()-lastAttempt<1200)return;
 busy=true;lastAttempt=Date.now();
 let healthy=false;
 try{
   const response=await fetch(endpoint);
   healthy=response.ok;notice="HTTP "+response.status;
 }catch{notice="Connection failed";}
 const ms=Math.max(0,Date.now()-lastAttempt);
 busy=false;if(closed)return;
 history.live.push({ok:healthy,ms});if(history.live.length>20)history.live.shift();
 persist("history",history);
 console.log("probe",healthy?"up":"down","ms",ms,"window",history.before.length?"after":"before","samples",history.live.length);
 refresh();
}
function mark(){
 if(busy||!history.live.length){notice=busy?"Probe in progress":"Probe at least once";return;}
 history.before=history.live.slice();history.live=[];persist("history",history);
 notice="Release marked";console.log("baseline",summary(history.before));
}
let refresh:()=>void=()=>{};
export function original(){
refresh=surface(draw,k=>{
 if(k==="up"||k==="down")page=1-page;
 else if(k==="ok")void probe();
 else if((k==="start"&&!history.before.length)||k==="hold-start")mark();
},()=>{closed=true;if(timer!==undefined)clearInterval(timer);},{enabled:false});
void loadValues().then(v=>{
 if(closed)return;
 endpoint=String(v?.endpoint||"").trim();
 if(!/^https?:\/\/[^\s]+$/i.test(endpoint)){endpoint="";notice="Set HTTP(S) health URL";refresh();return;}
 const saved=read<History|null>("history",null);
 history=saved?.endpoint===endpoint&&Array.isArray(saved.before)&&Array.isArray(saved.live)?saved:{endpoint,before:[],live:[]};
 notice="Connecting";console.log("restore baseline",history.before.length,"live",history.live.length);refresh();
 void probe();timer=setInterval(()=>void probe(),30000);
}).catch(report);
}
