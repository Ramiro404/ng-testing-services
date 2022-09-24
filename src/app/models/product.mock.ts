import { faker } from '@faker-js/faker'
import { Product } from './product.model'

export const generateProduct = (): Product=>{
    return {
        id: faker.datatype.uuid(),
        title: faker.commerce.productName(),
        category: {
            id: faker.datatype.string(),
            name: faker.commerce.department()
        },
        description: faker.commerce.productDescription(),
        images: [faker.image.imageUrl(), faker.image.imageUrl()],
        price: +faker.commerce.price()
    }
}

export const generateProducts = (size:number): Product[] => {
    let products:Product[] = [];
    for(let i=0;i<size;i++){
        products.push({
            id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            category: {
                id: faker.datatype.string(),
                name: faker.commerce.department()
            },
            description: faker.commerce.productDescription(),
            images: [faker.image.imageUrl(), faker.image.imageUrl()],
            price: +faker.commerce.price()
        })
    }
    return [...products];
}