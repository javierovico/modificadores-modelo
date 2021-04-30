const ModeloBase = function({atributos = {}, appends = [], metodos = {}}){
    Object.defineProperty(this,'_attributes',{value:atributos, writable:false, enumerable:false})
    Object.defineProperty(this,'_updates',{value: {}, writable:true, enumerable:false})
    Object.defineProperty(this,'_metodos',{value: metodos, writable:false, enumerable:false})
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
    Object.entries(metodos).forEach(([key,value])=>{
        const resultadoComprobacion = /^(get)(.+)(Attribute)$/.exec(key)
        if(resultadoComprobacion){
            const nuevoAtributo = resultadoComprobacion[2].charAt(0).toLowerCase() + resultadoComprobacion[2].slice(1)
            Object.defineProperty(this,nuevoAtributo,{
                enumerable: 0<=appends.indexOf(nuevoAtributo),
                get: function(){
                    return value(this)
                }
            })
        }
    })
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

const Punto = function(atributos){
    return new ModeloBase({
        atributos,
        metodos:{
            id: (target) => target._attributes.id * 2,
            getNombrePureteAttribute: (target) => target.nombre + '_ PURETE' + target.id,
            getNombrePureteOcultoAttribute: (target) => target.nombre + '_ PURETE pero oculto' + target.id,
        },
        appends:['nombrePurete']
    })
}

const punto = Punto({id:1,nombre:'caberna',tour:{id:1,nombre:'tour'}});
console.log(JSON.stringify(punto,null,2))
const punto2 = Punto({id:2,nombre:'caberna2'});
console.log(JSON.stringify(punto2,null,2))
