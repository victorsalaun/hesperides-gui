Hesperides-gui
========

[![Build Status](https://travis-ci.org/victorsalaun/hesperides-gui.svg?branch=master)](https://travis-ci.org/victorsalaun/hesperides-gui)

Hesperides is an open source tool with a frontend (hesperides-gui) and a backend (hesperides).

It lets you easily generate content from a template file (using mustache) in a given environment.

Go to <https://github.com/voyages-sncf-technologies/hesperides> to handle hesperides backend.

Build:
=====

Requirements : npm

```shell
$ npm install
```

Run:
=====

Install grunt-cli :
```shell
$ npm install grunt-cli -g
```

Run the server :
```shell
$ npm start
```

It should launch a server available at http://localhost:80 using back on http://localhost:8080

Tests:
=====

Run the webdriver-manager :
```shell
$ npm run webdriver-start
```

Run the protractor tests in other window :
```shell
$ npm run protractor
```

Documentation:
=====

Available at <https://voyages-sncf-technologies.github.io/hesperides-gui/>
