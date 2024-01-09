import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  sharedData:any;

  constructor() { }
  // private dataSubject=new Subject<any>();
  // data$=this.dataSubject.asObservable();
  // sendData(data:any){
  //   this.dataSubject.next(data);

  // }
  private localstoragekey='sampledata'
  savedata(data:string[]):void{
    console.log("saved data-----------------",data)
    localStorage.setItem(this.localstoragekey,JSON.stringify(data));
  }
  getData():string[]{
    console.log("get data-----------------",this.localstoragekey)
    const storedData=localStorage.getItem(this.localstoragekey);
    return storedData? JSON.parse(storedData) : [];
  }
  
}