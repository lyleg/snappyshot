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
  'mixed':'{}',
  'object': {},
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

export function getGenericTypeObject(typeAlias, typeAliases){
  return typeAlias.right.properties.reduce((customObject, property) => {
    let value
    if(property.value.type === 'GenericTypeAnnotation'){
      value = getPlaceholderFromType(property.value, typeAliases)
    }else{
      value = getPlaceholderFromProperty(property, typeAliases)
    }
    return {...customObject, [property.key.name]:value}
  },{})
}

export function getGenericTypeArray(){}

export function getPlaceholderFromType(typeAnnotation, typeAliases){
  if(typeAnnotation && typeAnnotation.type === 'GenericTypeAnnotation' && typeAnnotation.id.name){
    const typeAlias = typeAliases.find(typeAlias => typeAliasExistsForAnnotation(typeAlias,typeAnnotation.id.name))
    if(!typeAlias){
      return false
    }
    if(typeAlias.right.type === 'ObjectTypeAnnotation'){
      return getGenericTypeObject(typeAlias,typeAliases)
    }else{
      //return getPlaceholderFromProperty(typeAlias.right.property, typeAliases)
    }
  }else{
    //console.log(typeAnnotation.type)
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
