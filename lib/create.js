const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const figlet = require('figlet')
const downloadFromGithub = require('./downloadFromGithub')
const REMOTE_URL = 'https://github.com/xieyezi/react-template.git'

module.exports = async function create(projectName) {
  const cwd = process.cwd()
  const targetDir = path.resolve(cwd, projectName)
  const name = path.relative(cwd, projectName)
  // check projectName is Exist
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Target directory ${chalk.cyan(targetDir)} already exists. choose an action:`,
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Cancel', value: false }
        ]
      }
    ])
    if (!action) {
      return
    } else if (action === 'overwrite') {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
      await fs.remove(targetDir)
    }
  }

  const { author, description, version } = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Please input your project description',
      default: 'description',
      validate(val) {
        return true
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'Please input your author name',
      default: 'author',
      validate(val) {
        return true
      },
      transformer(val) {
        return val
      }
    },
    {
      type: 'input',
      name: 'version',
      message: 'Please input your version',
      default: '1.0.0',
      validate(val) {
        return true
      },
      transformer(val) {
        return val
      }
    }
  ])
  console.log()
  const spinner = new Ora({
    text: `Download template from xieyezi react template...\n`
  })

  spinner.start()
  downloadFromGithub(REMOTE_URL, projectName)
    .then((res) => {
      fs.readFile(`./${projectName}/package.json`, 'utf8', function(err, data) {
        if (err) {
          spinner.stop()
          console.error(err)
          return
        }
        const packageJson = JSON.parse(data)
        packageJson.name = projectName
        packageJson.description = description
        packageJson.author = author
        packageJson.version = version
        var updatePackageJson = JSON.stringify(packageJson, null, 2)
        fs.writeFile(`./${projectName}/package.json`, updatePackageJson, 'utf8', function(err) {
          spinner.stop()
          if (err) {
            console.error(err)
          } else {
            console.log(
              logSymbols.success,
              chalk.green(`Successfully created project template of xieyezi react template!\n`)
            )
            console.log(
              `${chalk.green(`cd ${projectName}`)}\n${chalk.green('yarn install || npm install')}\n${chalk.green(
                'yarn start || npm run start'
              )}\n`
            )
            console.log(chalk.green(figlet.textSync('xieyezi-cli')))
          }
          process.exit()
        })
      })
    })
    .catch((err) => {
      console.log(logSymbols.error, err)
      spinner.fail(chalk.red('Sorry, it must be something error,please check it out. \n'))
      process.exit(-1)
    })
}
