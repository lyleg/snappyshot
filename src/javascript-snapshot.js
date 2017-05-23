import functionalSnapshotTemplate
    from "./snapshot-templates/functional-snapshot-template"

import { getExports } from "./babylon-utils"
import { generateSignaturesFromFlowType } from "./data-utils"
import { generateFilePathTraversal } from "./utils"
/*import classSnapshotTemplate
    from "./snapshot-templates/class-snapshot-template"
*/

function generateFunctionalSnapshot(exportFromTarget, filePath, typeAlias) {
    return functionalSnapshotTemplate({
        exportType: exportFromTarget.type,
        name: exportFromTarget.declaration.id.name,
        filePath: generateFilePathTraversal(filePath) + filePath,
        signatures: generateSignaturesFromFlowType(
            exportFromTarget.declaration.params,
            typeAlias
        )
    })
}

function generateVanillaSnapshot(
    exportFromTarget,
    filePath,
    typeAlias
): string {
    if (exportFromTarget.declaration.type === "FunctionDeclaration") {
        return generateFunctionalSnapshot(
            exportFromTarget,
            filePath,
            typeAlias
        )
    } else {
        return ""
    }
}
/*
For now support
 - individually exported functions (default or no)
 - one top level object's attributes either class or function
 this is rather clunky, explore benefits / drawbacks of going recursive
 */
export function generateSnapshotsFromExports(
    babyParsed: Object,
    filePath: string,
    typeAlias: Array<Object>
) {
    let exportsFromTarget = getExports(babyParsed)

    return exportsFromTarget.reduce((snapshotString, exportFromTarget) => {
        if (exportFromTarget.declaration.type === "ObjectExpression") {
            return exportFromTarget.declaration.properties.reduce(
                (snapshotString, exportFromTargetOneLevel) => {
                    let newSnapshot = generateVanillaSnapshot(
                        exportFromTargetOneLevel,
                        filePath,
                        typeAlias
                    )
                    if (newSnapshot) return snapshotString + newSnapshot + "\n"
                    else return snapshotString
                }
            )
        } else {
            let newSnapshot = generateVanillaSnapshot(
                exportFromTarget,
                filePath,
                typeAlias
            )
            if (newSnapshot) return snapshotString + newSnapshot + "\n"
            else return snapshotString
        }
    }, "")
}

/*
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
}*/
