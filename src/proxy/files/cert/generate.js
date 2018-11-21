const chalk = require('chalk');
const inquirer = require('inquirer');
const shell = require('shelljs');

const echo = string => console.log(chalk.greenBright(string));
const info = string => console.log(chalk.magentaBright(string));
const warn = string => console.log(chalk.yellowBright(string));

inquirer
  .prompt([
    {
      type: 'confirm',
      name: 'generate',
      message: 'This will remove any current certificates. Procceed?',
      default: true,
    },
  ])
  .then(answers => {
    if (answers.generate) {
      echo('---> GENERATING SELF-SIGNED SSL CERTIFICATE...');
      if (shell.exec('sh createRootCA.sh').code) {
        warn(
          'Failed to generate a new ssl certificate. Did you update /proxy/cert/proxy.csr.cnf?'
        );
      } else {
        shell.exec('sh createCert.sh');
        info('Generated a new ssl certificate!');
        shell.echo(`Be sure to:
        1) add /proxy/cert/ssl/rootCA.pem to your browser's "Trusted Root Certification Authorities"
        2) add the domain and any subdomains to your hosts file`);
      }
    }
  });
