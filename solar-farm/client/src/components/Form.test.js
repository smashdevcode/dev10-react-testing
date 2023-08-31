import { render, screen, waitFor } from '@testing-library/react';
// import { rest } from 'msw';
import userEvent from '@testing-library/user-event';
import { useLocation, MemoryRouter, Routes, Route } from 'react-router-dom';
import server from '../test/server';

import Form from './Form';
import List from './List';

// Start the server listening before any of our tests are ran
beforeAll(() => server.listen());

// Reset the request handlers after each test is ran
afterEach(() => server.resetHandlers());

// Stop the server after all of our tests have ran
afterAll(() => server.close());

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}

function renderComponent(route) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/add" element={<Form />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="/list" element={<List />} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>
  );
}

async function fillForm(
  user,
  section,
  row,
  column,
  material,
  yearInstalled,
  isTracking,
  expectValues = true
) {
  const sectionInput = screen.getByLabelText(/section/i);
  const rowInput = screen.getByLabelText(/row/i);
  const columnInput = screen.getByLabelText(/column/i);
  const materialSelect = screen.getByLabelText(/material/i);
  const yearInstalledInput = screen.getByLabelText(/year installed/i);
  const trackingCheckBox = screen.getByLabelText(/tracking/i);

  await user.type(sectionInput, section);
  await user.type(rowInput, `${row}`);
  await user.type(columnInput, `${column}`);
  await user.selectOptions(materialSelect, material);
  await user.type(yearInstalledInput, `${yearInstalled}`);
  if (isTracking) {
    await user.click(trackingCheckBox);
  }

  if (expectValues) {
    expect(sectionInput).toHaveValue(section);
    expect(rowInput).toHaveValue(row);
    expect(columnInput).toHaveValue(column);
    expect(materialSelect).toHaveValue(material);
    expect(yearInstalledInput).toHaveValue(yearInstalled);
    if (isTracking) {
      expect(trackingCheckBox).toBeChecked();
    } else {
      expect(trackingCheckBox).not.toBeChecked();
    }
  }

  return {
    sectionInput,
    rowInput,
    columnInput,
    materialSelect,
    yearInstalledInput,
    trackingCheckBox,
  };
}

describe('Form', () => {
  it('should update form input elements with the correct values', async () => {
    const user = userEvent.setup();

    renderComponent('/add');

    await fillForm(user, 'Test', 1, 2, 'POLY_SI', 2000, true);
  });

  it('should redirect the user to the list page after successful form submission', async () => {
    const user = userEvent.setup();

    renderComponent('/add');

    await fillForm(user, 'Test', 1, 2, 'POLY_SI', 2000, true);

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('location-display')).toHaveTextContent('/list');
  });
});
