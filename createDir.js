const fs = require('fs-extra')
const dir = './uploads/documents'

async function createDir (directory) {
    try {
      await fs.ensureDir(directory)
      logger.info('uploads/documents dir created')
    } catch (err) {
      logger.error(err)
    }
  }
  createDir(dir)