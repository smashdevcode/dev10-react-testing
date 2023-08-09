import { render, screen } from '@testing-library/react';
import Errors from './Errors';

describe('Errors', () => {
  it('should a list of error messages', () => {
    const errors = ['Error message 1', 'Error message 2'];

    // Arrange
    render(<Errors errors={errors} />);

    // Act
    // Note: Querying for a <p> element by the role "paragraph" won't work
    // as <p> elements don't have the implicit role of "paragraph". While
    // you could add a "role='paragraph'" attribute to the <p> element
    // it's probably easier to just select that element by its text content.
    // const paragraph = screen.getByRole('paragraph');
    const messageElement = screen.getByText(
      /the following errors were found:/i
    );
    const listItems = screen.getAllByRole('listitem');

    // Assert
    // expect(paragraph).toHaveTextContent(/the following errors were found:/i);
    expect(messageElement).toBeInTheDocument();
    expect(listItems).toHaveLength(2);

    errors.forEach((error) => {
      const errorListItem = screen.getByText(error);
      expect(errorListItem).toBeInTheDocument();
    });
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
