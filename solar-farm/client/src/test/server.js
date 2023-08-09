import { setupServer } from 'msw/node';
import { rest } from 'msw';
import panels from './panels.json';

const BASE_URL = 'http://localhost:8080/api/solarpanel';

const server = setupServer(
  rest.get(BASE_URL, (_req, res, ctx) => {
    return res(ctx.json(panels));
  })
);

export default server;
