/* @flow */
import reactComponentSnapshotTemplate from './snapshot-templates/react-component-snapshot-template'
import functionalSnapshotTemplate from './snapshot-templates/functional-snapshot-template'
import {parse as docGenParse} from 'react-docgen'
import {parse as babyParse} from 'babylon'
import {getExports} from './babylon-utils'
import {generateSignaturesFromFlowType} from './data-utils'
import {generateFilePathTraversal} from './utils'
import {mockPropString, getTypeName, generateMockValueFromFlowType, generateMockValue} from './react-utils'

/* potential ideas
generate multiple snapshots with optional permutations for non required and things like boolean
atom plugin
https://github.com/babel/babel/tree/master/packages/babel-template replace our templates?
*/

let babyOptions =  {
  sourceType: "module",
  plugins: [
    "jsx",
    "flow"
  ]
}

function isReact(path) {//simple react check, only valid for components that directly extend React.component
  if(path && path.declaration && path.declaration.superClass
    && path.declaration.superClass.object
    && path.declaration.superClass.object.name === 'React'){
    return true
  }//react native name?
  return false
}

function generateFunctionalSnapshots(componentSrc:string, babyParsed:Object, filePath:string){
  let exportsFromTarget = getExports(babyParsed)

  return exportsFromTarget.map(exportFromTarget => {
    if (exportFromTarget.declaration.type === 'FunctionDeclaration'){
      return functionalSnapshotTemplate({
        type: exportFromTarget.type,
        name: exportFromTarget.declaration.id.name,
        filePath: generateFilePathTraversal(filePath) + filePath,
        signatures: generateSignaturesFromFlowType(exportFromTarget)
      })
    }
    //if class
    //if ?
  })
}

export function generateSnapshot(src:string, filePath:string){
  let babyParsed = babyParse(src, babyOptions)
  let isReactComponent = getExports(babyParsed).find((exportNode)=>{//loop through all exports, if one react exists push to react-docgen for now, else loop and mock for all
    return isReact(exportNode)
  })
  if(isReactComponent){
    return generateReactComponentSnapshot(src, babyParsed, filePath)
  }else{
    return generateFunctionalSnapshots(src, babyParsed, filePath)
  }

}

 function generateReactComponentSnapshot(componentSrc:string, babyParsed:Object, filePath:string){
    let docGenParsed = docGenParse(componentSrc)
    //todo, handle when no props
    let mockedPropString = mockPropString(docGenParsed)
    let mockedChildrenProp = (docGenParsed.props.children)
      ? generateMockValue('children',docGenParsed.props.children)
      : ''
    let exportFromTarget = getExports(babyParsed)[0]//only supporting one react comp per file
    let exportNameType = {type:exportFromTarget.type, name:exportFromTarget.declaration.id.name}
    filePath = generateFilePathTraversal(filePath) + filePath
    let snapshotString = reactComponentSnapshotTemplate({
      component: exportNameType.name,
      type: exportNameType.type,
      componentPath: filePath,
      componentProps: mockedPropString,
      componentChildren:mockedChildrenProp
    })
    return snapshotString
}
