import { BaseEntity } from './BaseEntity'

export class Product extends BaseEntity<Product>{
    code:number
    name:string
    manufacturing:'national'|'imported'
    size:string
    value:number
}