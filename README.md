## Install

```sh
npm i -g sun-convention-hooks
```

## Usage
- Go to root project folders
- Run `chinit`
- Select type convention check
- After success run `composer install`

## Support
- PHPCS Standard Framgia
- Yarn , npm eslint

## Note
- After members clone your project, can run `composer install` for add pre-commit to git hooks automate
- You can config in `.avengers/config.yml`

```sh
PhpChecker: true # Enable check with phpcs tool
JsChecker: true # Enable check with js eslint
phpFolder: app # list folders check phpcs , separated by spaces
typeJs: 'yarn' # JS Tool check eslint ex: yarn or npm
``` 

## Author
- hieudt from Ironman Members team Avengers
