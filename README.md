# Dev10 After Hours: React Testing

## React Testing Part 1

### Our First Simple Test

> _Note: If you have the client or server apps running, stop them. We don't want to rely upon the backend/server when writing and running our React component unit tests._

If your project doesn't have a `setupTests.js` file, then add this file inside of the `src` folder with the following contents:

**src/setupTests.js**

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

Now add a `Header.test.js` file as a sibling to the `Header.js` component file:

**Header.test.js**

```js
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render a welcome message', () => {
    render(<Header />);
    const element = screen.getByText(/Welcome to Solar Farm!/i);
    expect(element).toBeInTheDocument();
  });
});
```

> _Note: If you have ESLint configured, it'll complain about not being able to find the `it` and `expect` functions. To fix these linting errors, we need to add `"jest": true` to the `.eslintrc.json` configuration:_

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "jest": true
  },
  "extends": ["airbnb", "plugin:prettier/recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "comma-dangle": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "linebreak-style": 0,
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/react-in-jsx-scope": 0
  }
}
```

Run the `npm test` command to run our tests. The test should pass.

> _Note: `npm test` is configured to only run test for files that have changed since your last Git commit (assuming that your React project is contained within a Git repository). If you don't currently have any changed files, no tests will run (the message "No tests found related to files changed since last commit" will display). You can then press `a` to run all tests, or run `npm test` with `--watchAll`._

Things to notice about this test:

* The use of the `describe` method to give contexts
* The use of `it` to write a test (`it` is an alias of the `test` method)
* The use of `render` to render a component
* The use of `screen` to find elements on the page (`screen` is bound to `document.body`)
* The use of `expect` to assert

Our test follows the basic structure of any unit test:

* Arrange (`render`)
* Act (query for elements, fire events)
* Assert (`expect`)

You can also select an element by its role:

```js
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
```

When querying elements, the creators of Testing Library want you to think about how your users would find the element. More often times than not, users would identify an element by its text, not its type or role. But querying elements by its text alone doesn't take into account users who are using assistive technologies like screen readers. Given that, Testing Library wants you to give first priority to querying elements by their role using `getByRole()`.

List of ARIA roles: [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles)

### Jest and React Testing Library

Jest is a JavaScript testing framework providing:

* Test runner
* Assertions
* Code coverage
* Mocking
* Includes `jsdom` for a non-browser-based DOM implementation

React Testing Library (or any of the `@testing-library` family of packages) helps you test UI components in a user-centric way.

**See the [Testing Library docs Introduction page](https://testing-library.com/docs/) for an overview of Testing Library.**

### Testing a Component That Accepts Props

Start with this `Errors` component:

**Errors.js**

```js
function Errors({ errors }) {
  return (
    <div>
      <p>The following errors were found:</p>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export default Errors;
```

Then test that the `Errors` component:

* Renders the expected messages when passed an array of messages
* Doesn't render content if passed an empty array
* Gracefully handles an unexpected prop type

> `screen.debug()` will print the what is currently rendered to the screen.

**Errors.js**

```js
function Errors({ errors }) {
  if (!errors || !Array.isArray(errors) || errors.length === 0) {
    return null;
  }

  return (
    <div>
      <p>The following errors were found:</p>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export default Errors;
```

**Errors.test.js**

```js
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
```

### Testing a Component That Requires a Router

Now let's test the `Nav` component.

```js
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/list">View Panels</Link>
        </li>
        <li>
          <Link to="/add">Add a Panel</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
```

```js
import { render, screen } from '@testing-library/react';
import Nav from './Nav';

describe('Nav', () => {
  it('should render three links', () => {
    // Act
    render(<Nav />);

    // Arrange
    const listItems = screen.getAllByRole('listitem');

    // Assert
    expect(listItems).toHaveLength(3);
  });
});
```

Running this test results in the following error:

```
TypeError: Cannot destructure property 'basename' of 'React__namespace.useContext(...)' as it is null.
```

In order to render a `Link`, our component must be a child of a React Router context provider. The recommended way of doing that within a test, is to use `MemoryRouter`:

```js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from './Nav';

describe('Nav', () => {
  it('should render three links', () => {
    // Act
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    // Arrange
    const listItems = screen.getAllByRole('listitem');

    // Assert
    expect(listItems).toHaveLength(3);
  });
});
```

We've checked that the `Nav` renders three links, but how can we determine if those links are the ones that we expect?

Testing Library gives an interesting and powerful method, `screen.logTestingPlaygroundURL()`, that allows us to interact with what is currently rendered to the screen and to determine what queries would work best.

```js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from './Nav';

describe('Nav', () => {
  it('should render three links', () => {
    // Act
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    // Arrange
    const listItems = screen.getAllByRole('listitem');

    // Assert
    expect(listItems).toHaveLength(3);
  });

  it('should render home, view panels, and add panel links', () => {
    // Act
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    screen.logTestingPlaygroundURL();
  });
});
```

Clicking on the "Home" link, we can see that the testing playground is recommending that we use `getByRole` with the `name` option defined.

```js
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
```

Notice that we defined a `renderComponent()` function to DRY up our code a bit.
