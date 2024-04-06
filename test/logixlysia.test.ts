import { Elysia } from 'elysia'
import { edenTreaty } from '@elysiajs/eden'
import { describe, it, expect, beforeAll, beforeEach } from 'bun:test'
import { logger } from '../src'

describe('Logixlysia', () => {
  let server: Elysia
  let app: any
  let logs: string[] = []

  describe('IP logging disabled', () => {
    beforeAll(() => {
      server = new Elysia()
        .use(logger({ ip: false }))
        .get('/', () => '🦊 Logixlysia Getting')
        .post('logixlysia', () => '🦊 Logixlysia Posting')
        .listen(3000)

      app = edenTreaty<typeof server>('http://127.0.0.1:3000')
    })

    beforeEach(() => {
      logs = []
    })

    it("Responds correctly to GET '/' requests", async () => {
      const requestCount = 5

      for (let i = 0; i < requestCount; i++) {
        logs.push((await app.get('/')).data)
      }

      logs.forEach(log => {
        expect(log).toBe('🦊 Logixlysia Getting')
      })
    })

    it("Responds correctly to POST '/logixlysia' requests", async () => {
      const requestCount = 5

      for (let i = 0; i < requestCount; i++) {
        const postResponse = await app.logixlysia.post({})
        logs.push(
          postResponse.status === 200 ? postResponse.data : postResponse.error
        )
      }

      logs.forEach(log => {
        expect(log).toBe('🦊 Logixlysia Posting')
      })
    })

    it('Throws an error when attempting to post to an undefined route', async () => {
      const response = await app.undefinedRoute.post({})
      const error = response.error

      expect(response.status).toBe(404)
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('IP logging enabled', () => {
    beforeAll(() => {
      server = new Elysia()
        .use(logger({ ip: true }))
        .get('/', () => '🦊 Logixlysia Getting')
        .post('logixlysia', () => '🦊 Logixlysia Posting')
        .listen(3000)

      app = edenTreaty<typeof server>('http://127.0.0.1:3000')
    })

    beforeEach(() => {
      logs = []
    })

    it("Logs incoming IP address for GET '/' requests when X-Forwarded-For header is present", async () => {
      logs.forEach(log => {
        expect(log).toMatch(/^IP: \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
      })
    })

    it("Logs incoming IP address for GET '/' requests when X-Forwarded-For header is not present", async () => {
      const requestCount = 5

      for (let i = 0; i < requestCount; i++) {
        const response = await app.get('/')
      }

      logs.forEach(log => {
        expect(log).toMatch(/^IP: \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
      })
    })
  })
})
