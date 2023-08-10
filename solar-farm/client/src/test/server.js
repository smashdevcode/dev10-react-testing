import { setupServer } from 'msw/node';
import { rest } from 'msw';
import panels from './panels.json';

const BASE_URL = 'http://localhost:8080/api/solarpanel';

const server = setupServer(
  rest.get(BASE_URL, (_req, res, ctx) => {
    return res(ctx.json(panels));
  }),

  rest.get(`${BASE_URL}/:panelId`, (req, res, ctx) => {
    const { panelId } = req.params;
    const panel = panels.find((p) => p.panelId === parseInt(panelId, 10));
    if (panel) {
      return res(ctx.json(panel));
    }
    return res(ctx.status(404));
  }),

  rest.post(BASE_URL, (_req, res, ctx) => {
    return res(ctx.status(201));
  })
);

export default server;
