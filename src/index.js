/* @flow */
import reactComponentSnapshotTemplate from "./snapshot-templates/react-component-snapshot-template";
import functionalSnapshotTemplate from "./snapshot-templates/functional-snapshot-template";
import classSnapshotTemplate from "./snapshot-templates/class-snapshot-template";
import { parse as docGenParse } from "react-docgen";
import babylon from "react-docgen/dist/babylon";
import { getExports } from "./babylon-utils";
import { generateSignaturesFromFlowType } from "./data-utils";
import { generateFilePathTraversal } from "./utils";
import {
  mockPropString,
  getTypeName,
  generateMockValueFromFlowType,
  generateMockValue
} from "./react-utils";

/* potential ideas
generate multiple snapshots with optional permutations for non required and things like boolean
atom plugin
https://github.com/babel/babel/tree/master/packages/babel-template replace our templates?
*/
/*
try to parse with react doc gen, if error then not react.
we are calling docgen twice, but want to keep this function return boolean for future growth
*/
function isReactComponent(src: string): boolean {
  try {
    let docGenParsed = docGenParse(src);
    return true;
  } catch (e) {
    return false;
  }
}

function generateFunctionalSnapshot(exportFromTarget, filePath, typeAlias) {
  return functionalSnapshotTemplate({
    exportType: exportFromTarget.type,
    name: exportFromTarget.declaration.id.name,
    filePath: generateFilePathTraversal(filePath) + filePath,
    signatures: generateSignaturesFromFlowType(
      exportFromTarget.declaration.params,
      typeAlias
    )
  });
}

function generateClassSnapshot(exportFromTarget, filePath) {
  //poc for experimenting, not sure if a es6 class makes for great snapshots
  let constructor = exportFromTarget.body.body.methodDefinition.find(
    methodDefinition => methodDefinition.kind === "constructor"
  );
  if (constructor) {
    return classSnapshotTemplate({
      exportType: exportFromTarget.type,
      name: exportFromTarget.declaration.id.name,
      filePath: generateFilePathTraversal(filePath) + filePath,
      constructorParams: generateSignaturesFromFlowType(
        constructor.value.params.typeAnnotation
      )
    });
  }
}
function generateVanillaSnapshot(
  exportFromTarget,
  filePath,
  typeAlias
): string {
  if (exportFromTarget.declaration.type === "FunctionDeclaration") {
    return generateFunctionalSnapshot(exportFromTarget, filePath, typeAlias);
  } else {
    return "";
  }
}
/*
For now support
 - individually exported functions (default or no)
 - one top level object's attributes either class or function
 this is rather clunky, explore benefits / drawbacks of going recursive
 */
function generateSnapshotsFromExports(
  babyParsed: Object,
  filePath: string,
  typeAlias: Array<Object>
) {
  let exportsFromTarget = getExports(babyParsed);

  return exportsFromTarget.reduce(
    (snapshotString, exportFromTarget) => {
      if (exportFromTarget.declaration.type === "ObjectExpression") {
        return exportFromTarget.declaration.properties.reduce((
          snapshotString,
          exportFromTargetOneLevel
        ) =>
          {
            let newSnapshot = generateVanillaSnapshot(
              exportFromTargetOneLevel,
              filePath,
              typeAlias
            );
            if (newSnapshot)
              return snapshotString + newSnapshot + "\n";
            else
              return snapshotString;
          });
      } else {
        let newSnapshot = generateVanillaSnapshot(
          exportFromTarget,
          filePath,
          typeAlias
        );
        if (newSnapshot)
          return snapshotString + newSnapshot + "\n";
        else
          return snapshotString;
      }
    },
    ""
  );
}

export function generateSnapshot(src: string, filePath: string) {
  try {
    let babyParsed = babylon.parse(src);
    let typeAliases = babyParsed.body.filter(node => node.type === "TypeAlias");

    let isReact = isReactComponent(src);
    if (isReact) {
      //leveraging react-docgen for now, will eventually have everything go through generateSnapshotsFromExports
      return generateReactComponentSnapshot(src, babyParsed, filePath);
    } else {
      return generateSnapshotsFromExports(babyParsed, filePath, typeAliases);
    }
  } catch (e) {
    console.error("unable to parse " + filePath);
    //console.error(e)
    return;
  }
}

function generateReactComponentSnapshot(
  componentSrc: string,
  babyParsed: Object,
  filePath: string
) {
  let docGenParsed = docGenParse(componentSrc);
  //todo, handle when no props
  let mockedPropString = mockPropString(docGenParsed);
  let mockedChildrenProp = docGenParsed.props.children
    ? generateMockValue("children", docGenParsed.props.children)
    : "";
  let exportFromTarget = getExports(babyParsed)[0];
  //only supporting one react comp per file
  let exportNameType;
  if (
    exportFromTarget && exportFromTarget.declaration &&
      exportFromTarget.declaration.id &&
      exportFromTarget.declaration.id.name
  )
    exportNameType = {
      type: exportFromTarget.type,
      name: exportFromTarget.declaration.id.name
    };
  else
    exportNameType = { type: "ExportDefaultDeclaration", name: "Component" };

  filePath = generateFilePathTraversal(filePath) + filePath;
  let snapshotString = reactComponentSnapshotTemplate({
    component: exportNameType.name,
    type: exportNameType.type,
    componentPath: filePath,
    componentProps: mockedPropString,
    componentChildren: mockedChildrenProp
  });
  return snapshotString;
}
