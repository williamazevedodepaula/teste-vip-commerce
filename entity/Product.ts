import { ProductI } from './ProductI'
import { BaseEntity } from './BaseEntity'

export class Product extends BaseEntity<ProductI> implements ProductI{
    code:number
    name:string
    manufacturing:'national'|'imported'
    size:string
    value:number
}