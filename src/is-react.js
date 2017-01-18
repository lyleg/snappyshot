/*
For some reason I can't get the ast to mirror the ast used from within react docgen,
I'm leaving this file here for when the time comes to move off of react docgen for parsing components
I'd like to always use their component detection though because it would be too silly to rewrite
*/

import findExportedComponentDefinitions from "react-docgen/dist/utils/isStatelessComponent";
import babylon from "react-docgen/dist/babylon";
import recast from "recast";

export function findReactComponents(src) {
  let ast = recast.parse(src, { esprima: babylon });
  findExportedComponentDefinitions(ast, recast);
}
