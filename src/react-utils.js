//check for defaultValues,  flow, then proptypes
import {dataTypeMap} from './data-utils'

function keyValueToString(typeName, propName, propValue){
  if(typeName === 'string'){
    propValue = '"' + propValue + '"'
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
        let keyValueStringValue = keyValueToString(typeName,propName,propValue)
        return propsString += keyValueStringValue
    },'')
  }else{
    return null
  }
}

export function getTypeName(propDescriptor:PropDescriptor){
  console.log(propDescriptor)
  if(propDescriptor.flowType){
    return propDescriptor.flowType.name
  }else if(propDescriptor.type){
    return propDescriptor.type.name
  }
}


export function parseFlowTypeObject(flowTypeObject:Object){
  return Object.keys(flowTypeObject).reduce((str,key)=>{
    console.log(flowTypeObject[key])
    console.log(flowTypeObject)
    console.log(key)
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

export function generateMockValue(propName:string, propDescriptor:PropDescriptor):string{
  if(propDescriptor.defaultValue){
    return propDescriptor.defaultValue.value
  }else if(propDescriptor.flowType){
    let typeName = getTypeName(propDescriptor)
    console.log(typeName)
    return generateMockValueFromFlowType(propName, typeName)
  }else{//todo, add check for propType
    console.warn('not able to generate a value for ')
    return ''
  }
}
