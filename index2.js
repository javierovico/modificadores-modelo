function extend(sup,base) {
    const descriptor = Object.getOwnPropertyDescriptor(
        base.prototype, "constructor"
    );
    base.prototype = Object.create(sup.prototype);
    const handler = {
        construct: function (target, args) {
            const obj = Object.create(base.prototype);
            this.apply(target, obj, args);
            return obj;
        },
        apply: function (target, that, args) {
            sup.apply(that, args);
            base.apply(that, args);
        },
        get: function (target,prop,receiver){
            return '2'
        }
    };
    const proxy = new Proxy(base, handler);
    descriptor.value = proxy;
    Object.defineProperty(base.prototype, "constructor", descriptor);
    return proxy;
}

const ModeloBase = function(atributos = {}){
    Object.defineProperty(this,'_attributes',{value:atributos, writable:false, enumerable:false})
    Object.defineProperty(this,'_updates',{value: {}, writable:true, enumerable:false})
    Object.defineProperties(this,Object.entries(atributos).reduce((acum,[key,value])=> Object.assign(acum,{[key]:{
        enumerable: true,
        get: function(){
            if(key in this._updates){
                return this._updates[key]
            }else if(key in this._attributes){
                return this._attributes[key]
            }else{
                return undefined
            }
        },
        set: function(nuevo){
            this._updates[key] = nuevo
        }
    }}),{}))
}

const Tour = function(atributos){
    return new ModeloBase({
        atributos,
        metodos:{
            id: (target) => target._attributes.id * 2,
            getNombrePureteAttribute: (target) => target.nombre + '_ T' + target.id,
            getNombrePureteOcultoAttribute: (target) => target.nombre + '_ T pero oculto' + target.id,
        },
        appends:['nombrePurete']
    })
}

const Punto = extend(ModeloBase,function(){
    this.getNombrePureteAttribute = function(){
        return 'nombre ' + this.nombre;
    }
})

const punto = new Punto({id:1,nombre:'caberna',tour:{id:1,nombre:'tour'}});
console.log(JSON.stringify(punto,null,2))
console.log(punto.getNombrePureteAttribute());
console.log(punto.nombrePurete);