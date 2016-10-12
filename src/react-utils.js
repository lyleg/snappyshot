//check for defaultValues,  flow, then proptypes
export function mockPropString(parsedResponse:ParsedResponse){
  if(parsedResponse.props){
    return Object.keys(parsedResponse.props)
      .filter(propName => propName!== 'children')
      .reduce((propsString, propName)=>{ //rewrite as object entries and iterate map?
        let propDescriptor = parsedResponse.props[propName]
        let typeName = getTypeName(propDescriptor)
        let propValue = generateMockValue(propName, propDescriptor)
        if(typeName === 'string'){
          propValue = '"' + propValue + '"'
        }
        return propsString += ' ' + propName + ' = ' + propValue
    },'')
  }else{
    return null
  }
}

export function getTypeName(propDescriptor:PropDescriptor){
  if(propDescriptor.flowType){
    return propDescriptor.flowType.name
  }else if(propDescriptor.type){
    return propDescriptor.type.name
  }
}

export function generateMockValueFromFlowType(propName:string, propDescriptor:PropDescriptor):string{
  let flowTypeMap = {//move defaults to snappyshot.config.js
    'number': 2000,
    'string': 'abcdefghijklmnopqrstuvwxyz',
    'boolean': true,
    'null': null,
    'void': undefined,
    'any': 1,
    'mixed':{},
  }

  if(propDescriptor.flowType && flowTypeMap[propDescriptor.flowType.name]){
    return flowTypeMap[propDescriptor.flowType.name]
  }else{
    //console.log(JSON.stringify(propDescriptor.flowType.elements))
    console.warn('unable to determine flowtype for ' + propName)
    return ''
  }
}

export function generateMockValue(propName:string, propDescriptor:PropDescriptor):string{
  if(propDescriptor.defaultValue){
    return propDescriptor.defaultValue.value
  }else if(propDescriptor.flowType){
    return generateMockValueFromFlowType(propName, propDescriptor)
  }else{//todo, add check for propType
    console.warn('not able to generate a value for ')
    return ''
  }
}
