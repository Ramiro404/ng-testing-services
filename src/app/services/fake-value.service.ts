import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FakeValueService {

  constructor() { }

  getValue(): string{
    return 'fake-value';
  }
  setValue():void{}

  getPromise(): Promise<string>{
    return Promise.resolve('fake promise value');
  }
}
