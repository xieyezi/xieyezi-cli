#!/usr/bin/env node

const package = require('../package.json')
const chalk = require('chalk')
const program = require('commander')
const requiredVersion = package.engines.node
const create = require('../lib/create')
const enhanceErrorMessages = require('../lib/enhanceErrorMessages')
// projcetName
// let projectName = null;
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        'You are using Node ' +
          process.version +
          ', but this version of ' +
          id +
          ' requires Node ' +
          wanted +
          '.\nPlease upgrade your Node version.'
      )
    )
    process.exit(1)
  }
}
/**
 * Check node version before requiring/doing anything else
 */
checkNodeVersion(requiredVersion, '@xieyezi/cli')
/**
 * start create app
 */
program.version(package.version).usage('<command> [options]')
program
  .command('create <app-name>')
  .description('  Create a project with template from @iwubida')
  .action((name, cmd) => {
    create(name)
  })
program.parse(process.argv)
/***
 * output help information on unknown commands
 */
program.arguments('<command>').action((cmd) => {
  program.outputHelp()
  console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  suggestCommands(cmd)
})

/**
 * enhance common error messages
 */
enhanceErrorMessages('missingArgument', (argName) => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', (optionName) => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return (
    `Missing required argument for option ${chalk.yellow(option.flags)}` + (flag ? `, got ${chalk.yellow(flag)}` : '')
  )
})

program.parse(process.argv)
/**
 * add some useful info on help
 */
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan('xieyezi-cli <command> --help')} for detailed usage of given command.`)
  console.log()
})
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
function suggestCommands(cmd) {
  const availableCommands = program.commands.map((cmd) => {
    return cmd._name
  })
  const suggestion = didYouMean(cmd, availableCommands)
  if (suggestion) {
    console.log('  ' + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}
