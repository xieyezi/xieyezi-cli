const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const figlet = require('figlet')
const downloadFromGithub = require('./downloadFromGithub')
let REMOTE_URL = 'https://github.com/xieyezi/vue-template.git' // 默认为Vue项目模板

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

  const { framework, author, description, version, package_manager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework do you want to create',
      default: 'Vue',
      choices: ['Vue', 'React'],
      validate(val) {
        return true
      }
    },
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
      message: 'Please input project version',
      default: '1.0.0',
      validate(val) {
        return true
      },
      transformer(val) {
        return val
      }
    },
    {
      type: 'list',
      name: 'package_manager',
      message: 'Which package manager do you want to use',
      default: 'Yarn',
      choices: ['Yarn', 'Npm'],
      validate(val) {
        return true
      }
    }
  ])
  if (framework === 'React') {
    REMOTE_URL = 'https://github.com/xieyezi/react-template.git'
  }
  // some tip
  console.log(chalk.white(`\n\n✨  Creating project in ${chalk.yellow(targetDir)}.`))
  console.log(chalk.white(`🗃  Initializing git repository....\n`))
  const spinner = new Ora({
    text: `Download template from xieyezi git repository... This might take a while....\n`
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
            console.log(chalk.white(`📦  Installing additional dependencies...\n`))
            // 将node工作目录更改成构建的项目根目录下
            process.chdir(`./${projectName}`)
            // 安装项目依赖
            const child_process = require('child_process')
            if (package_manager === 'Yarn') {
              child_process.execSync('yarn install', { stdio: [0, 1] })
            } else {
              child_process.execSync('npm install', { stdio: [0] })
            }
            // 依赖安装完成之后给出提示信息
            console.log(chalk.white(`\n🎉  Successfully created project`), chalk.yellow(`${projectName}.`))
            console.log(chalk.white('👉  Get started with the following commands:\n'))
            console.log(`${chalk.cyan(`${chalk.gray('$')} cd ${projectName}`)}`)
            console.log(
              package_manager === 'Yarn'
                ? chalk.cyan(`${chalk.gray('$')} yarn start\n\n`)
                : chalk.cyan(`${chalk.gray('$')} npm run start\n\n`)
            )
            // console.log(chalk.white(figlet.textSync('xieyezi-cli')))
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
