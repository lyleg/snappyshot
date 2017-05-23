import { parse as docGenParse } from "react-docgen";

import reactComponentSnapshotTemplate from "./snapshot-templates/react-component-snapshot-template";
import {
  mockPropString,
  getTypeName,
  generateMockValueFromFlowType,
  generateMockValue
} from "./react-utils";

export function generateReactComponentSnapshot(
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
