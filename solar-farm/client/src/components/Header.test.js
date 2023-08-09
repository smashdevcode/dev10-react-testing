import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render a welcome message', () => {
    render(<Header />);
    const element = screen.getByText(/Welcome to Solar Farm!/i);
    expect(element).toBeInTheDocument();
  });

  it('should render heading element', () => {
    render(<Header />);
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent('Welcome to Solar Farm!');
  });
});
