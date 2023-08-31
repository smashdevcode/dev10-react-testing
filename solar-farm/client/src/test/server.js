import { setupServer } from 'msw/node';
import { rest } from 'msw';
import panels from './panels.json';

const server = setupServer(
  rest.get('http://localhost:8080/api/solarpanel', (_req, res, ctx) => {
    return res(ctx.json(panels));
  }),
  rest.post('http://localhost:8080/api/solarpanel', (_req, res, ctx) => {
    return res(ctx.status(201));
  })
);

export default server;
