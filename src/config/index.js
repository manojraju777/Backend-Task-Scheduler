const assert = require('assert')

// Validate the config for schema
const myEnv = require('schema')('myEnvironment', { fallbacks: 'STRICT_FALLBACKS' })

const appconfig = require('config')

const configStr = JSON.stringify(appconfig)
require('dotenv').config()

const expandenv = require('expandenv')
const config = JSON.parse(expandenv(configStr))

module.exports = config