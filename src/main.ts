import {original} from "./original";
import {loadValues} from "@shared/settings";
import {instrument} from "@shared/instrument";
void loadValues().then(v=>{if(!v?.bridge){original();return;}instrument({title:"CANARY WATCH",primary:"Reading",accent:"#7CDEBC",cadence:30000,motion:{enabled:false},setup:"Start companion/serve.py"});});
