const inquirer = require('inquirer');

module.exports = {
  askModuleConvetion: () => {
    const questions = [
        {
            type: 'checkbox',
            name: 'modules',
            message: 'Select the options precommit check:',
            choices: ['eslint', 'phpcs'],
            default: ['eslint']
        },
    ];
    return inquirer.prompt(questions);
  },
  askPhpFolders: () => {
    const questions = [
        {
            name: 'php_check',
            type: 'input',
            message: 'Type folders or files check ( separated by commas ) Ex: app,tests,index.php',
            validate: function( value ) {
              if (value.length) {
                  return true;
              } else {
                  return 'Please enter folders or files.';
              }
            }
        },
    ];
    return inquirer.prompt(questions);
  },
  askTypeBuilds: () => {
    const questions = [
        {
          type: 'list',
          name: 'typeBuilds',
          message: 'Select the options javascript build tools use eslint:',
          choices: ['yarn', 'npm'],
          validate: function( value ) {
            if (value.length) {
                return true;
            } else {
                return 'Please check valid value.';
            }
          }
        },
    ];
    return inquirer.prompt(questions);
  }
};