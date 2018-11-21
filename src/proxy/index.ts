import { strings } from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  apply,
  chain,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';

function addFiles(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move('./proxy/'),
    ]);
    context.logger.log(
      'info',
      '✅️ Added files into `proxy` directory'
    );

    const rule = mergeWith(templateSource, MergeStrategy.Default);
    return rule(tree, context);
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

function addPackageJsonScripts(): Rule {
  return (host: Tree, context: SchematicContext) => {
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
        context.logger.log(
          'info',
          '✅️ Added `proxy` and `generate.proxy.cert` scripts.'
        );
      }
    }
    return host;
  };
}

export function proxy(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      addFiles(options),
      options && options.skipPackageJson
        ? noop()
        : installPackageJsonDependencies(),
      options && options.skipModuleImport ? noop() : addPackageJsonScripts(),
    ]);
  };
}
