import { render, screen } from '@testing-library/react';
import Errors from './Errors';

describe('Errors', () => {
  it('should render a list item for each provided error', () => {
    const errors = ['Error message 1', 'Error message 2'];

    // Arrange
    render(<Errors errors={errors} />);

    // Act
    const messageElement = screen.getByText(/the following errors were found/i);
    const listItemElements = screen.getAllByRole('listitem');

    // Assert
    expect(messageElement).toBeInTheDocument();
    expect(listItemElements).toHaveLength(2);

    errors.forEach((error) => {
      const errorListItem = screen.getByText(error);
      expect(errorListItem).toBeInTheDocument();
    });
  });

  it('should not render content if there are no error messages', () => {
    const { container } = render(<Errors errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render content is passed an unexpected data type', () => {
    const { container } = render(<Errors errors={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render content is passed no props', () => {
    const { container } = render(<Errors />);
    expect(container).toBeEmptyDOMElement();
  });
});
