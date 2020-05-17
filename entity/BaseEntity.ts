import { PersistedModel } from "loopback";

export class BaseEntity<T> extends PersistedModel{
    constructor(data?:Partial<T>){
        super(data);
    }
}