
import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService]
    })
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for setvalue', ()=>{
    it('should chage the value', ()=>{
      service.setValue("AA");
      expect(service.getValue()).toBe("AA");
    })
  })

  describe('Test for getPromise', ()=>{
    it('should resolve the promise', (doneFn)=>{
      service.getPromise().then((value) =>{
        expect(value).toBe('my-value');
        doneFn();
      })
    })
  })

  describe('Test for getObservable', ()=>{
    it('should subscribe the observable', (doneFn)=>{
      service.getObservable().subscribe((value)=>{
        expect(value).toBeDefined();
        doneFn();
      })
    })
  })
});
