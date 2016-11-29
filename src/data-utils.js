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

export function getPlaceholderFromType(typeAnnotation, typeAlias){
  if(typeAnnotation.type === 'GenericTypeAnnotation'){
    if(typeAnnotation && typeAnnotation.typeParameters && typeAnnotation.typeParameters.params){
      typeAnnotation.typeParameters.params.map((param)=>{
      //  console.log(JSON.stringify(param))
        return getPlaceholderFromType(param)
      })
    }else{
      return false
      //console.log(JSON.stringify(typeAnnotation))

    }
  }else{
  //  console.log(typeAnnotation.type);
    let dataType = typeAnnotationsMap[typeAnnotation.type]
    //console.log(dataType)
    return dataTypeMap[dataType]
  }

}

export function generateSignaturesFromFlowType(params:Array<Object>, typeAlias:Array<Object>){
//  console.log(params)
  return params
  .filter(param => param.typeAnnotation)
  .map((param)=>{
  //  console.log(getPlaceholderFromType(param.typeAnnotation.typeAnnotation))
    return getPlaceholderFromType(param.typeAnnotation.typeAnnotation, typeAlias)
  })
}
