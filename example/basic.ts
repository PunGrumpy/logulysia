import { Elysia } from 'elysia'
import { logger } from '~/index'

const app = new Elysia({
  name: 'Basic Example'
})
  .use(
    logger({
      ip: true
    })
  )
  .get('/', () => {
    return {
      message: 'Basic Example'
    }
  })
  .get('/error', () => {
    throw new Error('This is an error message.')
  })
  .post('/', () => {
    return {
      message: 'Basic Example'
    }
  })
  .put('/', () => {
    return {
      message: 'Basic Example'
    }
  })
  .delete('/', () => {
    return {
      message: 'Basic Example'
    }
  })
  .patch('/', () => {
    return {
      message: 'Basic Example'
    }
  })

app.listen(3000)
