import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from './Nav';

function renderComponent() {
  render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>
  );
}

describe('Nav', () => {
  it('should render three links', () => {
    renderComponent();

    const listItemElements = screen.getAllByRole('listitem');

    expect(listItemElements).toHaveLength(3);
  });

  it('should render home, view panels, and add panel links', () => {
    renderComponent();

    // screen.debug();
    // screen.logTestingPlaygroundURL();

    const homeLinkElement = screen.getByRole('link', {
      name: /home/i,
    });
    const viewPanelsLinkElement = screen.getByRole('link', {
      name: /view panels/i,
    });
    const addPanelLinkElement = screen.getByRole('link', {
      name: /add a panel/i,
    });

    const assertLink = (element, path) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('href', path);
    };

    assertLink(homeLinkElement, '/');
    assertLink(viewPanelsLinkElement, '/list');
    assertLink(addPanelLinkElement, '/add');
  });
});
