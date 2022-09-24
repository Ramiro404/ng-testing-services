import { Calculator } from "./Calculator"
/*
describe - define una suite de tests. Una colección de tests. Recibe dos parámetros, un string con el nombre de la suite y una function() donde se definen los tests.

it - define un test en particular. Recibe como parámetro el nombre del test y una función a ejecutar por el test.

expect - Lo que esperar recibir ese test. Con expect se hace la comprobación del test.
*/
describe("Test for calculator", ()=> {
    it("#multiply should return a nine", ()=>{
        //Arrange
        const calc = new Calculator();
        //Act
        let result = calc.multiply(3,3);
        //Assert
        expect(result).toEqual(9);
    }),
    it("#multiple tests", ()=>{
        let name:string|undefined;
        let name2:string = "r";
        expect(name).toBeUndefined();
        expect(name2).toBeDefined();
        expect(1+3===4).toBeTruthy();
        //expect(1+3===4).toBeFalsy();
        expect(5).toBeLessThan(10);
        expect(20).toBeGreaterThan(10);
        expect('12345').toMatch(/123/);
        expect(['orange', 'banana', 'budou']).toContain('banana');

    }),
    it("#divide tests", ()=>{
        const div = new Calculator();
        let div1 = div.divide(1,0);
        expect(div1).toBeNull();
        let div2 = div.divide(2,2);
        expect(div2).toEqual(1);
    })
})

/*
//Comunes
.toBe();
.not.toBe();
.toEqual();

//Veracidad
.toBeNull()
.toBeUndefined()
.toBeDefined()
.toBeUndefined()
.toBeTruthy() 
.toBeFalsy() 

//Numeros
.toBeGreaterThan(3);
.toBeGreaterThanOrEqual(3.5);
.toBeLessThan(5);
.toBeLessThanOrEqual(4.5);

//Numeros decimales
expect(0.3).toBeCloseTo(0.3)

//Strings
.not.toMatch(/I/);
.toMatch(/stop/);

//Arrays
.toContain('milk');

//Ecepciones
myfunction.toThrow(Error);

*/