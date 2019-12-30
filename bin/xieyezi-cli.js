#!/usr/bin/env node
!(function(e) {
  'function' == typeof define && define.amd ? define(e) : e()
})(function() {
  'use strict'
  var e,
    o,
    n = require('../package.json'),
    r = require('chalk'),
    i = require('commander'),
    s = require('semver'),
    t = n.engines.node,
    a = require('./lib/create'),
    c = require('./lib/enhanceErrorMessages'),
    u = require('didyoumean')
  ;(u.threshold = 0.6),
    (e = t),
    (o = '@xieyezi/cli'),
    s.satisfies(process.version, e) ||
      (console.log(
        r.red(
          'You are using Node ' +
            process.version +
            ', but this version of ' +
            o +
            ' requires Node ' +
            e +
            '.\nPlease upgrade your Node version.'
        )
      ),
      process.exit(1)),
    i.version(n.version).usage('<command> [options]'),
    i
      .command('create <app-name>')
      .description('  Create a project with template from xieyezi react template.')
      .action(function(e, o) {
        a(e)
      }),
    i.arguments('<command>').action(function(e) {
      i.outputHelp(),
        console.log('  ' + r.red('Unknown command ' + r.yellow(e))),
        console.log(),
        (function(e) {
          var o = i.commands.map(function(e) {
              return e._name
            }),
            n = u(e, o)
          n && console.log('  ' + r.red('Did you mean ' + r.yellow(n) + '?'))
        })(e)
    }),
    c('missingArgument', function(e) {
      return 'Missing required argument ' + r.yellow('<' + e + '>') + '.'
    }),
    c('unknownOption', function(e) {
      return 'Unknown option ' + r.yellow(e) + '.'
    }),
    c('optionMissingArgument', function(e, o) {
      return 'Missing required argument for option ' + r.yellow(e.flags) + (o ? ', got ' + r.yellow(o) : '')
    }),
    i.parse(process.argv),
    i.on('--help', function() {
      console.log(),
        console.log('  Run ' + r.cyan('xieyezi-cli <command> --help') + ' for detailed usage of given command.'),
        console.log()
    }),
    process.argv.slice(2).length || i.outputHelp()
})
