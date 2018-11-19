"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_utilities_1 = require("schematics-utilities");
function addFiles(options) {
    return (tree, context) => {
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.filter(path => !path.endsWith('.spec.ts')),
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move('./proxy/'),
        ]);
        context.logger.log('info', '✅️ Added files into `proxy` directory');
        const rule = schematics_1.mergeWith(templateSource, schematics_1.MergeStrategy.Default);
        return rule(tree, context);
    };
}
function addPackageJsonDependencies() {
    return (host, context) => {
        const dependencies = [
            {
                type: schematics_utilities_1.NodeDependencyType.Dev,
                version: '^0.8.3',
                name: 'shelljs',
            },
            {
                type: schematics_utilities_1.NodeDependencyType.Dev,
                version: '^2.4.1',
                name: 'chalk',
            },
            {
                type: schematics_utilities_1.NodeDependencyType.Dev,
                version: '^6.2.0',
                name: 'inquirer',
            },
        ];
        dependencies.forEach(dependency => {
            schematics_utilities_1.addPackageJsonDependency(host, dependency);
            context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.log('info', `🔍 Installing packages...`);
        return host;
    };
}
function addPackageJsonScripts() {
    return (host, context) => {
        if (host.exists('package.json')) {
            const packageJson = host.read('package.json');
            if (packageJson) {
                const jsonStr = packageJson.toString('utf-8');
                const json = JSON.parse(jsonStr);
                // if there are no scripts, create an entry for scripts.
                const type = 'scripts';
                if (!json[type]) {
                    json[type] = {};
                }
                // add generate proxy cert scripts
                let script = 'generate.proxy.cert';
                let cmd = 'cd proxy/cert && node generate';
                if (!json[type][script]) {
                    json[type][script] = cmd;
                }
                // add proxy script
                script = 'proxy';
                cmd = 'cd proxy && node proxy';
                if (!json[type][script]) {
                    json[type][script] = cmd;
                }
                host.overwrite('package.json', JSON.stringify(json, null, 2));
                context.logger.log('info', '✅️ Added `proxy` and `generate.proxy.cert` scripts.');
            }
        }
        return host;
    };
}
function proxy(options) {
    return (_tree, _context) => {
        return schematics_1.chain([
            addFiles(options),
            options && options.skipPackageJson
                ? schematics_1.noop()
                : addPackageJsonDependencies(),
            options && options.skipPackageJson
                ? schematics_1.noop()
                : installPackageJsonDependencies(),
            options && options.skipModuleImport ? schematics_1.noop() : addPackageJsonScripts(),
        ]);
    };
}
exports.proxy = proxy;
//# sourceMappingURL=index.js.map