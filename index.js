const handler = {
    get: function (target, name) {
        return name in target ?
            target[name] :
            37;
    }
};

const ModeloBase = function({atributos = {}, appends = [], getset = {}}){
    Object.defineProperty(this,'_attributes',{value:atributos, writable:false, enumerable:false})
    Object.defineProperty(this,'_updates',{value: {}, writable:true, enumerable:false})
    Object.defineProperties(this,Object.entries(atributos).filter(([key])=>!(key in getset)).reduce((acum,[key,value])=> Object.assign(acum,{[key]:{
        enumerable: true,
        // writable:true,
        // value,
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
    Object.defineProperties(this,Object.entries(getset).reduce((acum,[key,value])=> Object.assign(acum,{[key]:{
            enumerable: (0<=appends.indexOf(key)) || (key in atributos),
            // writable:false,
            get: function(){
                return value(this)
            },
        }}),{}))
}

// const ModeloModificador = function(atributos,getters = {},appends = []){
//     return new ModeloBase({atributos,getters, appends})
// }

const Punto = function(atributos){
    return new ModeloBase({
        atributos,
        getset:{
            id: (target) => target._attributes.id * 2,
            nombrePurete: (target) => target.nombre + '_ PURETE' + target.id,
        },
        appends:['nombrePurete']
    })
}

const punto = new Punto({id:1,nombre:'caberna'});
console.log(JSON.stringify(punto,null,2))
const punto2 = Punto({id:2,nombre:'caberna2'});
console.log(JSON.stringify(punto2,null,2))
