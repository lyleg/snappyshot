/* @flow */
import reactComponentSnapshotTemplate from './reactComponentSnapshotTemplate'
import {parse as docGenParse} from 'react-docgen'
import {parse as babyParse} from 'babylon'
import {getExportNameTypeAll} from './babylon-utils'
import {generateFilePathTraversal} from './utils'
import {mockPropString, getTypeName, generateMockValueFromFlowType, generateMockValue} from './react-utils'

/* potential ideas
generate multiple snapshots with optional permutations for non required and things like boolean
atom plugin
snapshot non react components, babylon parser or recast?
*/

let babyOptions =  {
  sourceType: "module",
  plugins: [
    "jsx",
    "flow"
  ]
}

function generateFunctionalSnapshots(componentSrc:string, filePath:string){
  let babyParsed = babyParse(componentSrc, babyOptions)
  let exportNameTypes = getExportNameTypeAll(babyParsed)
  return exportNameTypes.map(exportNameType => {
    //do similar action for functions
  })
}

export function generateSnapshot(src:string, filePath:string){
  return generateReactComponentSnapshot(src, filePath)//if component
  //return generateFunctionalSnapshots
}

 function generateReactComponentSnapshot(componentSrc:string, filePath:string){
    let babyParsed = babyParse(componentSrc, babyOptions)
    let docGenParsed = docGenParse(componentSrc)

    let mockedPropString = mockPropString(docGenParsed)
    let mockedChildrenProp = (docGenParsed.props.children)
      ? generateMockValue('children',docGenParsed.props.children)
      : ''
    let exportNameType = getExportNameTypeAll(babyParsed)[0]
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
