import files from '../lib/files'
import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import fs, { write } from 'fs'
import path from 'path'
import ncp from 'ncp'
import { promisify } from 'util'
import yaml from 'js-yaml'
import loading from 'loading-cli'
const access = promisify(fs.access);
const copy = promisify(ncp);

const inquirer  = require('../lib/inquirer');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('SC-Hooks v1.0.1', { horizontalLayout: 'full' })
  )
);

if (!files.directoryExists('composer.json')) {
    console.log(chalk.red('Composer json file not exists! Application require composer.json'));
    process.exit(1);
}

async function copyTemplateFiles(templateDir, targetDirectory) {
    return copy(templateDir, targetDirectory, {
        clobber: true,
    })
}
const initData = {
    PhpChecker: false,
    JsChecker: false,
    phpFolder: '',
    typeJs: '',
}
const run = async () => {
    const data = await inquirer.askModuleConvetion();

    if (data.modules.find((e) => e === 'phpcs')) {
        const data = await inquirer.askPhpFolders();
        initData.PhpChecker = true
        initData.phpFolder = data.php_check.replace(/,/g, ' ');
    }
    if (data.modules.find((e) => e === 'eslint')) {
        const data = await inquirer.askTypeBuilds();
        initData.JsChecker = true;
        initData.typeJs = data.typeBuilds;
    }
    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates'
    );
    const targetDirectory = process.cwd();
    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid Error : %s', chalk.red.bold('ERROR'), chalk.red(err));
        process.exit(1);
    }

    const load = loading({
        "text":"Initial Precommit File",
        "color":"green",
        "interval":100,
        "stream": process.stdout,
        "frames":["◐", "◓", "◑", "◒"]
      }).start()
    const configPath = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates/.avengers/config.yml'
    );
    await writeConfig(configPath);
    await copyTemplateFiles(templateDir, targetDirectory);
    readComposerFile()
    setTimeout(function(){
        load.stop()
        load.succeed('Setup successfully')
    },3000)
};

run();

const writeConfig = async (configPath) => {
    try {
        let data = yaml.safeDump(initData);
        fs.writeFileSync(configPath, data, 'utf8');
    } catch (e) {
        console.log(e);
    }
}

const readComposerFile = async () => {
    fs.readFile(process.cwd() + '/composer.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        var command = [
            "cp .avengers/pre-commit .git/hooks/pre-commit",
            "cp .avengers/config.yml .git/hooks/config.yml",
            "chmod a+x .git/hooks/pre-commit"
        ];
        const data = JSON.parse(jsonString);
        if (data.scripts['post-install-cmd']) {
            data.scripts['post-install-cmd'] = data.scripts['post-install-cmd'].concat(command);
        } else {
            data.scripts['post-install-cmd'] = command;
        }
        fs.writeFile(process.cwd() + '/composer.json', JSON.stringify(data, null, "    "), (err) => {
            if (err) console.log('Error writing file:', err)
        })
    })
}