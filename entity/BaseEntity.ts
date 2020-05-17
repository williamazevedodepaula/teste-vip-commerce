export class BaseEntity<T>{
    constructor(data?:T){
        if(!data) return undefined;
        Object.keys(data).forEach((key)=>{
            this[key]=data[key];
        })
    }
}