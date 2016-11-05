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

export function getPlaceholderFromType(typeAnnotation){
  if(typeAnnotation.type === 'GenericTypeAnnotation'){
    return [getPlaceholderFromType(typeAnnotation.typeParameters.params[0])]
  }
  let dataType = typeAnnotationsMap[typeAnnotation.type]
  return dataTypeMap[dataType]
}

export function generateSignaturesFromFlowType(exportFromTarget:Object){
  return exportFromTarget.declaration.params
  .filter(param => param.typeAnnotation)
  .map((param)=>{
    return getPlaceholderFromType(param.typeAnnotation.typeAnnotation)
  })
}
