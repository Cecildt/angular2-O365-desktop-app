import { ipcRenderer } from 'electron';

export class ElecService {
    
    constructor(){
        
        ipcRenderer.send('asynchronous-message', 'ping');
    }
    
    msg = "test message.";   
}


