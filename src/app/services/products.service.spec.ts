import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { generateProduct, generateProducts } from '../models/product.mock';
import { HttpErrorResponse, HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenService } from './token.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';

fdescribe('ProductsService', () => {
  let service: ProductsService;
  let httpController: HttpTestingController;
  let tokenService:TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });
    service = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(()=>{
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests for getAllSimple', () => {
    it('should return a list', (doneFn) => {
      let mockProducts: Product[] = generateProducts(20);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      service.getAllSimple()
        .subscribe((data) => {
          expect(data.length).toEqual(mockProducts.length);
          expect(data).toEqual(mockProducts);
          doneFn();
        })

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url)
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`)
      req.flush(mockProducts); // reemplaza los datos de la api con el mock

    });
    it('should return a list from getAll', (doneFn) => {
      let mockProducts: Product[] = [
        {
          ...generateProduct(),
          price: 100
        },
        {
          ...generateProduct(),
          price: 200
        }];

      service.getAll().subscribe((data) => {
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        doneFn();
      })
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockProducts);
    });
    it('should return a list when price is zero and negative', (doneFn) => {
      let mockProducts: Product[] = [
        {
          ...generateProduct(),
          price: 100
        },
        {
          ...generateProduct(),
          price: 200
        },
        {
          ...generateProduct(),
          price: 0
        },
        {
          ...generateProduct(),
          price: -100
        },
      ];

      service.getAll().subscribe((data) => {
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      })
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockProducts);
    });
    it('params receive limit=10 and offser=3', (doneFn) => {
      let mockProducts: Product[] = generateProducts(3);
      const limit = 10;
      const offset = 3;

      service.getAll(limit, offset).subscribe((data) => {
        expect(data.length).toEqual(mockProducts.length);
        //expect(limit).toEqual(0);
        //expect(data[3].taxes).toEqual(0);
        doneFn();
      })
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockProducts);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    })
  })

  describe("Test for POST", () => {
    it("should use method post", (doneFn) => {
      let mockProduct:Product = generateProduct();
      let product: CreateProductDTO = {
        title: 'rwer',
        description: 'dsfdf',
        images: ["img", "img"],
        price: 12,
        categoryId:"1"
      };

      service.create(product).subscribe((data) => {
        expect(data).toEqual(mockProduct);
        doneFn();
      })
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockProduct);
      expect(req.request.body).toEqual(product);
      expect(req.request.method).toEqual('POST')
    })
  });

  describe("Tests for update", ()=> {
    it("should update a product", (doneFn)=>{
      let mockProduct:Product = generateProduct();
      let product:UpdateProductDTO = {
        categoryId: "2",
        description: "sdsadsa",
        images: ["sd"],
        price: 12,
        title: "232321"
      };

      service.update("3", product).subscribe(data =>{
        expect(data).toEqual(mockProduct);
        doneFn();
      });
      const url = `${environment.API_URL}/api/v1/products/${3}`;
      const req = httpController.expectOne(url);
      req.flush(mockProduct);
      expect(req.request.body).toEqual(product);
      expect(req.request.method).toEqual('PUT');
    })
  });

  describe("Tests for delete", ()=>{
    it("#delete, should delete a product", (doneFn)=>{
      let mockProduct:Product = generateProduct();
      let id:string = "2";
      service.delete(id).subscribe(data =>{
        expect(data).toBeTruthy();
        doneFn();
      });
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush(true);
      expect(req.request.method).toEqual('DELETE');
    })
  });

  describe("Tests for Error 404", ()=>{
    it("#404, should return not found", (doneFn)=>{
      let id = "1";
      let msgError = "404 message";
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError 
      }
      service.getOne(id).subscribe({
        error: (error)=>{
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      })
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    })
  });

  describe("Test for Error 409", ()=>{
    it("#409, should return a server conflict", (doneFn)=>{
      let id = "2";
      let msgError = "407 message";
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      };
      service.getOne(id).subscribe({
        error: (error)=>{
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        }
      })
      const url =  `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET')
    })
  })

  describe("Tests for Error 401", ()=>{
    it("#401, should return the user is not authorized", (doneFn)=>{
      let id="3";
      let msgError = "401 message";
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
      };
      service.getOne(id).subscribe({
        error: (error)=>{
          expect(error).toEqual('No estas permitido');
          doneFn();
        }
      });
      const url =  `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    })
  })
});
