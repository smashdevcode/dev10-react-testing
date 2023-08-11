import {
  getByRole,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import server from '../test/server';
import List from './List';
import panels from '../test/panels.json';

// Start the server listening before any of our tests are ran
beforeAll(() => server.listen());

// Reset the request handlers after each test is ran
afterEach(() => server.resetHandlers());

// Stop the server after all of our tests have ran
afterAll(() => server.close());

function renderComponent() {
  render(
    <MemoryRouter>
      <List />
    </MemoryRouter>
  );
}

describe('List', () => {
  it('should render a table row for each panel', async () => {
    // Arrange
    renderComponent();

    // Act

    // TODO to wait for the data to come back from the API

    // By default, "find*" methods will retry every 50ms up to 1000ms
    // await screen.findAllByRole('link', { name: 'Edit' });
    // const editLinks = await screen.findAllByRole('link', { name: /edit/i });

    // expect(editLinks).toHaveLength(5);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const tableRows = screen.getAllByRole('row');

    // Assert

    expect(tableRows).toHaveLength(6);

    const headerRow = tableRows.shift();

    expect(headerRow.children.item(0)).toHaveTextContent(/id/i);
    expect(headerRow.children.item(1)).toHaveTextContent(/section/i);
    expect(headerRow.children.item(2)).toHaveTextContent(/row/i);
    expect(headerRow.children.item(3)).toHaveTextContent(/column/i);
    expect(headerRow.children.item(4)).toHaveTextContent(/material/i);
    expect(headerRow.children.item(5)).toHaveTextContent(/year installed/i);
    expect(headerRow.children.item(6)).toHaveTextContent(/is tracking/i);
    expect(headerRow.children.item(7)).toHaveTextContent(/edit/i);
    expect(headerRow.children.item(8)).toHaveTextContent(/delete/i);

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
        panels[index].tracking ? 'Yes' : 'No'
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
