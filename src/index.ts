import Elysia from 'elysia'
import { createLogger, handleHttpError } from './logger'
import startString from './utils/start'
import { Server } from 'bun'
import { HttpError, Options } from './types'

/**
 * Creates a logger.
 *
 * @export
 * @module logger
 * @category Logger
 * @subcategory Functions
 *
 * @name Logixlysia
 * @description Logixlysia is a logger plugin for ElysiaJS.
 * @author PunGrumpy
 * @license MIT
 *
 * @returns {Elysia} The logger.
 */
export const logger = (options?: Options): Elysia => {
  const log = createLogger(options)

  const elysia = new Elysia({
    name: 'Logixlysia'
  })
    .onStart(ctx => {
      startString(ctx.server as Server)
    })
    .onRequest(ctx => {
      ctx.store = { beforeTime: process.hrtime.bigint() }
    })
    .onAfterHandle({ as: 'global' }, ({ request, store }) => {
      log.log('INFO', request, { status: 200 }, store as { beforeTime: bigint })
    })
    .onError({ as: 'global' }, ({ request, error, store }) => {
      handleHttpError(
        request,
        error as HttpError,
        store as { beforeTime: bigint },
        options
      )
    })

  return elysia
}
