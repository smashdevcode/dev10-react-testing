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
    // Act
    renderComponent();

    // Arrange
    const listItems = screen.getAllByRole('listitem');

    // Assert
    expect(listItems).toHaveLength(3);
  });

  it('should render home, view panels, and add panel links', () => {
    // Act
    renderComponent();

    const homeLink = screen.getByRole('link', {
      name: /home/i,
    });
    const viewPanelsLink = screen.getByRole('link', {
      name: /view panels/i,
    });
    const addPanelLink = screen.getByRole('link', {
      name: /add a panel/i,
    });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(viewPanelsLink).toBeInTheDocument();
    expect(viewPanelsLink).toHaveAttribute('href', '/list');
    expect(addPanelLink).toBeInTheDocument();
    expect(addPanelLink).toHaveAttribute('href', '/add');
  });
});
