import { ProdutoI } from './ProdutoI'
import { BaseEntity } from './BaseEntity'

export class Produto extends BaseEntity<ProdutoI> implements ProdutoI{
    codigo:number
    nome:string
    fabricacao:'nacional'|'importado'
    tamanho:string
    valor:number
}