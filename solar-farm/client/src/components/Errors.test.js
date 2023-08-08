import { render, screen } from '@testing-library/react';
import Errors from './Errors';

describe('Errors', () => {
  it('should a list of error messages', () => {
    const errors = ['Error message 1', 'Error message 2'];
    render(<Errors errors={errors} />);
    const errorMessageOne = screen.getByText(/Error message 1/i);
    const errorMessageTwo = screen.getByText(/Error message 2/i);
    expect(errorMessageOne).toBeInTheDocument();
    expect(errorMessageTwo).toBeInTheDocument();
  });

  it('should not render content if there are no error messages', () => {
    const { container } = render(<Errors errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render content if passed an unexpected data type', () => {
    const { container } = render(<Errors errors={{}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
