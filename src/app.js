const config = require('./config/index')
const appConfig = config.server
const Utils = require("./helpers/utils")
const cronService = require('./services/cronService');

// Require the framework and instantiate it
const fastify = require('fastify')(
  {
    logger: { level: appConfig.logLevel }
  })

//run tasks on startup
cronService.taskRunnerOnStartUp()


// Connect to DB
const mongoose = require('mongoose')
const mongodbConfig = config.mongodb
const options = {
  autoIndex: false, // Don't build indexes
  poolSize: mongodbConfig.poolSize, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  user: mongodbConfig.username,
  pass: mongodbConfig.password
}
mongoose.connect(mongodbConfig.baseURL + mongodbConfig.dbName, options)
  .then(() => {
    fastify.log.info('MongoDB connected...')

    var debug = mongodbConfig.debug == "true" ? true : false
    mongoose.set('debug', debug)
  })
  .catch(err => {
    fastify.log.error(err)
    process.exit(1)
  })

mongoose.plugin((schema) => {
  schema.options.toJSON = {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    }
  };
});

//cors
fastify.register(require('fastify-cors'), {
  origin: true
})

// Register fastify axios
fastify.register(require('fastify-axios'))

// Import Routes
let routes = require('require-all')({
  dirname: __dirname + '/routes/',
  filter: /(.+Routes)\.js$/,
  recursive: false
})

let serviceRoutes = Object.getOwnPropertyNames(routes)
let index
for (index = 0; index < serviceRoutes.length; index++) {
  routes[`${serviceRoutes[index]}`].forEach((route, index) => {

    fastify.route(route)
  })
}

// Import and Register Routes
fastify.decorateRequest('fastify', fastify);

const HttpError = require("./models/errors/httpError")
fastify.setErrorHandler(function (error, request, reply) {
  fastify.log.debug(error)

  if (error instanceof HttpError) {
    reply.send(error)
  } else if (error) {
    try {
      let httpError = HttpError.convertFrom(error.response.data)
      if (httpError) {
        reply.send(httpError)
      } else {
        Utils.sendErrorResponse(reply, 88000, error.message)
      }
    }
    catch (err) {
      Utils.sendErrorResponse(reply, 88000, error.message)
    }
  } else {
    reply.send();
  }
})

// Run the server!
fastify.listen(appConfig.port, appConfig.host, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  } else {
    fastify.log.info(`Server listening on ${fastify.server.address().port}`)
  }
})
