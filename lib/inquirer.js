const inquirer = require('inquirer')
/**
 *  inquirer
 */
module.exports = async function create(projectName) {
  const { author, description, version } = await inquirer.prompt([
    {
      type: 'input',
      name: 'project-name',
      message: 'Please input your project name.',
      default: 'xieyezi',
      validate(val) {
        return true
      },
      transformer(val) {
        return val
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please input your project description.',
      default: 'description',
      validate(val) {
        return true
      },
      transformer(val) {
        return val
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'Please input your author name.',
      default: 'author',
      validate(val) {
        return true
      },
      transformer(val) {
        return val
      }
    }
  ])
}
