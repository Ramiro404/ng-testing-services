import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValueService {
  private value:string ="my-value";
  constructor() { }

  setValue(value:string):void{
    this.value=value;
  }
  getValue():string{
    return this.value;
  }
  getPromise(): Promise<string>{
    return Promise.resolve(this.value);
  }
  getObservable(): Observable<string>{
    return of(this.value);
  }

}
