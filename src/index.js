/* @flow */
import { parse as docGenParse } from "react-docgen"
import { generateReactComponentSnapshot } from "./react-component-snapshot"
import { generateSnapshotsFromExports } from "./javascript-snapshot"

import babylon from "react-docgen/dist/babylon"

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
        let docGenParsed :Object = docGenParse(src)
        return !!docGenParsed
    } catch (e) {
        return false
    }
}

export function generateSnapshot(src: string, filePath: string) {
    try {
        let babyParsed = babylon.parse(src)
        let typeAliases = babyParsed.body.filter(
            node => node.type === "TypeAlias"
        )

        let isReact = isReactComponent(src)
        if (isReact) {
            //leveraging react-docgen for now, will eventually have everything go through generateSnapshotsFromExports
            return generateReactComponentSnapshot(src, babyParsed, filePath)
        } else {
            return generateSnapshotsFromExports(
                babyParsed,
                filePath,
                typeAliases
            )
        }
    } catch (e) {
        console.error("unable to parse " + filePath)
        return
    }
}
