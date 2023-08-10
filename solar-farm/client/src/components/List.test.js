import {
  getByRole,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import server from '../test/server';

import List from './List';
import panels from '../test/panels.json';

function renderComponent() {
  render(
    <MemoryRouter>
      <List />
    </MemoryRouter>
  );
}

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('List', () => {
  it('should render a table row for each panel', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const tableRows = screen.getAllByRole('row');

    expect(tableRows).toHaveLength(6); // 5 rows (one per panel) plus header row

    // Remove the header row.
    const headerRow = tableRows.shift();

    expect(headerRow.children.item(0)).toHaveTextContent(/id/i);
    expect(headerRow.children.item(1)).toHaveTextContent(/section/i);
    expect(headerRow.children.item(2)).toHaveTextContent(/row/i);
    expect(headerRow.children.item(3)).toHaveTextContent(/column/i);
    expect(headerRow.children.item(4)).toHaveTextContent(/material/i);
    expect(headerRow.children.item(5)).toHaveTextContent(/year installed/i);
    expect(headerRow.children.item(6)).toHaveTextContent(/is tracking\?/i);
    expect(headerRow.children.item(7)).toHaveTextContent(/edit\?/i);
    expect(headerRow.children.item(8)).toHaveTextContent(/delete\?/i);

    // Now check that each of the panel rows contains the expected content...
    tableRows.forEach((row, index) => {
      expect(row.children.item(0)).toHaveTextContent(panels[index].id);
      expect(row.children.item(1)).toHaveTextContent(panels[index].section);
      expect(row.children.item(2)).toHaveTextContent(panels[index].row);
      expect(row.children.item(3)).toHaveTextContent(panels[index].column);
      expect(row.children.item(4)).toHaveTextContent(panels[index].material);
      expect(row.children.item(5)).toHaveTextContent(
        panels[index].yearInstalled
      );
      expect(row.children.item(6)).toHaveTextContent(
        panels[index].tracking ? /yes/i : /no/i
      );

      const editLink = getByRole(row, 'link', { name: /edit/i });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', `/edit/${panels[index].id}`);

      const deleteLink = getByRole(row, 'link', { name: /delete/i });
      expect(deleteLink).toBeInTheDocument();
      expect(deleteLink).toHaveAttribute('href', `/delete/${panels[index].id}`);
    });
  });

  it('should initially render a loading message', () => {
    renderComponent();

    const loading = screen.getByText(/loading/i);

    expect(loading).toBeInTheDocument();
  });

  it('should render no records found message when panels are not returned from the API', async () => {
    server.use(
      rest.get('http://localhost:8080/api/solarpanel', (_req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    renderComponent();

    const noPanelsMessage = await screen.findByText(/no panels to display/i);

    expect(noPanelsMessage).toBeInTheDocument();
  });
});
