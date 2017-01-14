//check for defaultValues,  flow, then proptypes
import {dataTypeMap} from './data-utils'


//todo, omit object and node

//todo, have all flowType parsing be covered by functions in data-utils, one off react props can still be done here

function keyValueToString(typeName, propName, propValue){
  if(typeName === 'string'){
    propValue = '"' + propValue + '"'
  }else if(typeName === 'bool' || typeName === 'number'){
    propValue = '{' + propValue + '}'
  }else if (typeName === 'object'){
    propValue = JSON.stringify(propValue)
  }
  return ' ' + propName + ' = ' + propValue
}

export function mockPropString(parsedResponse:ParsedResponse){
  if(parsedResponse.props){
    return Object.keys(parsedResponse.props)
      .filter(propName => propName!== 'children')
      .reduce((propsString, propName)=>{ //rewrite as object entries and iterate map?
        let propDescriptor = parsedResponse.props[propName]
        let typeName = getTypeName(propDescriptor)
        let propValue = generateMockValue(propName, propDescriptor)
        let keyValueStringValue = propValue ? keyValueToString(typeName,propName,propValue) : ''
        return propsString += keyValueStringValue
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


export function parseFlowTypeObject(flowTypeObject:Object){
  return Object.keys(flowTypeObject).reduce((str,key)=>{
    if(typeof flowTypeObject[key] === 'object'){
      return str + ' ' + key + ' = ' + parseFlowTypeObject(flowTypeObject[key])
    }else{
      let propName = key
      let typeName = flowTypeObject[key]//know it is flow, can just reference typename
      let propValue = generateMockValueFromFlowType(typeName, propName)
      return str + keyValueToString(typeName, propName, propValue)
    }
  },'{') + '}'
}

export function generateMockValueFromFlowType(typeName:string, propName:string):string{//make function pure
  if(dataTypeMap[typeName]){
    return dataTypeMap[typeName]
  }else{
    //console.log(JSON.stringify(propDescriptor.flowType.elements))
    console.warn('unable to determine flowtype for ' + propName)
    return ''
  }
}

export function generateMockValueFromPropType(typeName:string, propName:string):string{//make function pure
  if(dataTypeMap[typeName]){
    return dataTypeMap[typeName]
  }else{
    //console.log(JSON.stringify(propDescriptor.flowType.elements))
    console.warn('unable to generate mock for ' + propName + ' of type ' + typeName)
    return ''
  }
}

export function generateMockValue(propName:string, propDescriptor:PropDescriptor):string{
  if(propDescriptor.defaultValue){
    return propDescriptor.defaultValue.value
  }else if(propDescriptor.flowType){
    let typeName = getTypeName(propDescriptor)
    return generateMockValueFromFlowType(typeName, propName)
  }else{//todo, add check for propType
    console.log(JSON.stringify(propDescriptor,null,2))
    let typeName = propDescriptor.type.name
    return generateMockValueFromPropType(typeName, propName)
  }
}
