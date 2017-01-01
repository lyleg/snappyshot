/**
todo, more elaborate typeAlias support, module, interfaces, etc
*/

import types from 'ast-types'

export let dataTypeMap = {//move defaults to snappyshot.config.js
  'number': 2000,
  'string': 'abcdefghijklmnopqrstuvwxyz',
  'boolean': true,
  'null': null,
  'void': undefined,
  'any': 1,
  'mixed':{},
  'all':[-1, 0, 1, 'abc', '', true, false, null, undefined]
}

let typeAnnotationsMap = {//should I just ditch react doc gen and do everything with these types?
  'NumberTypeAnnotation': 'number',
  'StringTypeAnnotation': 'string',
  'BooleanTypeAnnotation': 'boolean',
  'NullLiteralTypeAnnotation': 'null',
  'VoidTypeAnnotation': 'void',
  'AnyTypeAnnotation': 'any',
  'MixedTypeAnnotation': 'mixed',
}

export function typeAliasExistsForAnnotation(type,name){
  return type.id.name === name
}

export function getPlaceholderFromProperty(property, typeAliases){
  let dataType = typeAnnotationsMap[property.value.type]
  return dataTypeMap[dataType]
}

export function getGenericTypeObject(typeAlias, typeAliases){//how do I keep track of original keys
  return typeAlias.right.properties.reduce((customObject, property) => {
    if(property.value.type === 'GenericTypeAnnotation'){
      return getPlaceholderFromType(property, typeAliases)
    }else{
      return getPlaceholderFromProperty(property, typeAliases)
    }
  },{})
}

export function getGenerctTypeArray(){}

export function getPlaceholderFromType(typeAnnotation, typeAliases){
  if(typeAnnotation.type === 'GenericTypeAnnotation' && typeAnnotation && typeAnnotation.id && typeAnnotation.id.name){
    const typeAlias = typeAliases.find(typeAlias => typeAliasExistsForAnnotation(typeAlias,typeAnnotation.id.name))
    if(!typeAlias)
      return false
    if(typeAlias.right.type === 'ObjectTypeAnnotation'){
      return getGenericTypeObject(typeAlias,typeAliases)
    }else{//assume simple, add array, etc
      //return getPlaceholderFromProperty(typeAlias.right.property, typeAliases)
    }
  }else{
    let dataType = typeAnnotationsMap[typeAnnotation.type]
    return dataTypeMap[dataType]
  }

}

export function generateSignaturesFromFlowType(params:Array<Object>, typeAliases:Array<Object>){
  return params
  .filter(param => param.typeAnnotation && param.typeAnnotation.typeAnnotation)
  .map((param)=>{
    return getPlaceholderFromType(param.typeAnnotation.typeAnnotation, typeAliases)
  })
}
