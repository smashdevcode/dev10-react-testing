import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render a welcome message', () => {
    render(<Header />);
    const h1 = screen.getByText(/Welcome to Solar Farm!/i);
    expect(h1).toBeInTheDocument();
  });
});
