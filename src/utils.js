/* @flow */
import toPromise from "denodeify";
import fs from "fs";

export function generateFilePathTraversal(filePath: string) {
  let depth = computeFileDepth(filePath) + 1;
  //add one to get out of tests folder
  return [ ...Array(depth) ].reduce(
    filePathTraversal => filePathTraversal + "../",
    ""
  );
}

export function computeFileDepth(filePath: string): number {
  return filePath.split("/").length - 1;
}

export function computeFolderPath(filePath: string): string {
  let r = /[^\/]*$/;
  return filePath.replace(r, "");
}

export async function isDir(dir: string): Promise<boolean> {
  let stats;
  try {
    stats = await toPromise(fs.stat)(dir);
  } catch (err) {
    return false;
  }

  if (stats.isDirectory()) {
    return true;
  }

  return false;
}
