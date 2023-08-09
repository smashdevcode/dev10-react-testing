import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render a welcome message', () => {
    // Arrange
    render(<Header />);

    // Act
    // const element = screen.getByText(/welcome to solar farm/i);
    const element = screen.getByRole('heading');

    // Assert
    expect(element).toBeInTheDocument();
  });
});
