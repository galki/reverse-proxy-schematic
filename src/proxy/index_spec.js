"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const workspaceOptions = {
    name: "workspace",
    newProjectRoot: "projects",
    version: "6.0.0"
};
const appOptions = {
    name: "bar",
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: "css",
    skipTests: false,
    skipPackageJson: false
};
const collectionPath = path.join(__dirname, "../collection.json");
const runner = new testing_1.SchematicTestRunner("schematics", collectionPath);
let appTree;
describe("proxy", () => {
    beforeEach(() => {
        appTree = runner.runExternalSchematic("@schematics/angular", "workspace", workspaceOptions);
        appTree = runner.runExternalSchematic("@schematics/angular", "application", appOptions, appTree);
    });
    it("works", () => {
        const tree = runner.runSchematic("proxy", { hostname: "example.com" }, appTree);
        expect(tree.files).toContain("/proxy/proxy.js");
        expect(tree.files).toContain("/proxy/cert/generate.js");
    });
});
//# sourceMappingURL=index_spec.js.map