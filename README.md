![The Monkeys](http://www.themonkeys.com.au/img/monkey_logo.png)

Monkey Bones generator
=======================

> Yeoman generator for The Monkeys projects - lets you quickly set up a project with sensible defaults and best practices.

Best used to quickly set up a web project!

## Install

Install `yo`, `grunt-cli` and `bower`:
```
npm install -g grunt-cli bower yo  
```

`cd` into this project and `npm install`:

```
cd /path/to/generator-monkey-bones && npm install
```

Link this generator:

```
sudo npm link
```

## Usage

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo monkey-bones`:

```
yo monkey-bones
```

Grunt will automatically run and watch your files after successfully scaffolding your project!


## Scaffolding Design & Structure

```
├── app/
│   ├── .bowerrc
│   ├── .gitignore
│   ├── bower.json
│   ├── gulpfile.js
│   ├── package.json
│   ├── build
│   │   ├── public
│   │   │   ├── css
│   │   │   │   ├── vendor
│   │   │   │   │   ├── normalize.css
│   │   │   │   ├── pages.css
│   │   │   ├── fonts
│   │   │   ├── images
│   │   │   │   ├── favicon.ico
│   │   │   ├── js
│   │   │   │   ├── vendor
│   │   │   │   │   ├── modernizr-2.8.3.min.js
│   │   │   │   │   ├── vendor.min.js
│   │   │   │   ├── global.js
│   │   │   │   ├── home.js
│   │   │   ├── index.html
│   │   ├── js
│   │   │   ├── vendor
│   │   │   ├── global.js
│   │   │   ├── home.js
│   │   ├── scss
│   │   │   ├── base
│   │   │   │   ├── variables.scss
│   │   │   │   ├── style.scss
│   │   │   │   ├── mixins.scss
│   │   │   ├── global
│   │   │   │   ├── generic.scss
│   │   │   │   ├── nav.scss
│   │   │   │   ├── footer.scss
│   │   │   ├── pages
│   │   │   │   ├── home.scss
│   ├── deployment
│   │   ├── deploy.sh
│   │   ├── README.md
│   ├── prototype
│   │   ├── README.md
│   ├── node_modules
```