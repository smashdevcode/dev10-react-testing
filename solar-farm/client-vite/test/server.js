import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import panels from './panels.json';

const BASE_URL = 'http://localhost:8080/api/solarpanel';

const server = setupServer(
  http.get(BASE_URL, () => {
    return HttpResponse.json(panels);
  }),
  http.post(BASE_URL, () => {
    return new HttpResponse(null, { status: 201 });
  })
);

export default server;
