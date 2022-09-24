import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from 'src/environments/environment';

fdescribe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService
      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(()=>{
    httpController.verify();
  })

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('tests for login', ()=>{
    it('should return a token', (doneFn)=>{
      //Arrange
      const mockData:Auth ={
        access_token: '123456'
      };
      const email = "ramir@gmail.com";
      const password = "1234";
      //act
      authService.login(email, password)
        .subscribe((data)=>{
          //Assert
          expect(data).toEqual(mockData);
          doneFn();
        });

        //http config
        const url = `${environment.API_URL}/api/v1/auth/login`;
        const req = httpController.expectOne(url);
        req.flush(mockData);
    })

    it('should call to saveToken', (doneFn)=>{
      //Arrange
      const mockData:Auth ={
        access_token: '123456'
      };
      const email = "ramir@gmail.com";
      const password = "1234";
      spyOn(tokenService, 'saveToken').and.callThrough();

      //act
      authService.login(email, password)
        .subscribe((data)=>{
          //Assert
          expect(data).toEqual(mockData);
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledOnceWith('123456');
          doneFn();
        });

        const url = `${environment.API_URL}/api/v1/auth/login`;
        const req = httpController.expectOne(url);
        req.flush(mockData);
    })
  })
});
