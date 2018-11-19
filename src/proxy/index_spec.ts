import {
  SchematicTestRunner,
  UnitTestTree
} from "@angular-devkit/schematics/testing";
import * as path from "path";
import { Schema as ApplicationOptions } from "@schematics/angular/application/schema";
import { Schema as WorkspaceOptions } from "@schematics/angular/workspace/schema";

const workspaceOptions: WorkspaceOptions = {
  name: "workspace",
  newProjectRoot: "projects",
  version: "6.0.0"
};

const appOptions: ApplicationOptions = {
  name: "bar",
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  style: "css",
  skipTests: false,
  skipPackageJson: false
};

const collectionPath = path.join(__dirname, "../collection.json");
const runner = new SchematicTestRunner("schematics", collectionPath);
let appTree: UnitTestTree;

describe("proxy", () => {
  beforeEach(() => {
    appTree = runner.runExternalSchematic(
      "@schematics/angular",
      "workspace",
      workspaceOptions
    );
    appTree = runner.runExternalSchematic(
      "@schematics/angular",
      "application",
      appOptions,
      appTree
    );
  });

  it("works", () => {
    const tree = runner.runSchematic("proxy", { hostname: "example.com" }, appTree);
    expect(tree.files).toContain("/proxy/proxy.js");
    expect(tree.files).toContain("/proxy/cert/generate.js");
  });
});
