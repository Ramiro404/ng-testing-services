import { TestBed } from '@angular/core/testing';
import { FakeValueService } from './fake-value.service';
import { MasterService } from './master.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let service: MasterService;
  let valueServiceSpy:jasmine.SpyObj<ValueService>;
 beforeEach(()=>{
  const spy:jasmine.SpyObj<ValueService> = jasmine.createSpyObj('ValueService', ['getValue']);
    TestBed.configureTestingModule({
      providers: [MasterService, {
        provide:{
          ValueService, useValue: spy
        }
      }]
    });
    service = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
 })
  

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for Master service', ()=>{
    it('Should call getValue from master service',()=>{
      let valueService = new ValueService();
      let masterService = new MasterService(valueService);
      expect(masterService.getValue()).toBe('my-value')

    });

    it('Should get value from fake service', ()=>{
      const fakeValueService = new FakeValueService();
      const masterService = new MasterService(fakeValueService as unknown as ValueService);
      expect(masterService.getValue()).toBe('fake-value')
    })

    it('should be return "other value" from the fake object',()=>{
      const fake = {getValue: ()=> 'fake object'};
      const masterService = new MasterService(fake as ValueService);
      expect(masterService.getValue()).toBe('fake object')
    })
  })

  describe('SpyvsSpy', ()=>{
    it('Spy test', ()=>{
      const valueServiceSpy: jasmine.SpyObj<ValueService> = jasmine.createSpyObj(
        'ValueService',
        ['getValue']
      );
        valueServiceSpy.getValue.and.returnValue('fake value');
        const masterService = new MasterService(valueServiceSpy);
        expect(masterService.getValue()).toBeDefined();
        expect(valueServiceSpy.getValue).toHaveBeenCalled();
        expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1)
    })
  })
});
