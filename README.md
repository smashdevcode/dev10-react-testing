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

**src/components/Header.test.js**

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

> _Note: If you have ESLint configured, it'll complain about not being able to find the `it` and `expect` functions. To fix these linting errors, we need to add `"jest": true` to the `.eslintrc.json` configuration file:_

**.eslintrc.json**

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

**src/components/Header.test.js**

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

**src/components/Errors.js**

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

**src/components/Errors.js**

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

**src/components/Errors.test.js**

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

**src/components/Nav.js**

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

**src/components/Nav.test.js**

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

**src/components/Nav.test.js**

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

**src/components/Nav.test.js**

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

**src/components/Nav.test.js**

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

## React Testing Part 2

### Testing a Component That Requires an API

Now let's try testing the `List` component.

**src/components/List.test.js**

```js
import { render, screen } from '@testing-library/react';
import List from './List';

describe('List', () => {
  it('should render a table row for each panel', () => {
    render(<List />);

    screen.debug();
  });
});
```

`screen.debug()` produces the following output:

```html
console.log
  <body>
    <div>
      <table>
        <thead>
          <tr>
            <th>
              ID
            </th>
            <th>
              Section
            </th>
            <th>
              Row
            </th>
            <th>
              Column
            </th>
            <th>
              Material
            </th>
            <th>
              Year Installed
            </th>
            <th>
              Is Tracking?
            </th>
            <th>
              Edit?
            </th>
            <th>
              Delete?
            </th>
          </tr>
        </thead>
        <tbody />
      </table>
    </div>
  </body>
```

Where are the panels? If we look at the component, we can see that it's using `fetch` to retrieve the list of panels:

**src/components/List.js**

```js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function List() {
  const [panels, setPanels] = useState([]);

  const loadPanels = () => {
    fetch('http://localhost:8080/api/solarpanel')
      .then((response) => response.json())
      .then((payload) => setPanels(payload));
  };

  useEffect(loadPanels, []); // call my callback function when the component loads

  return (
    <table>
     {/* snip! */}
    </table>
  );
}

export default List;
```

To test the `List` component, we need to mock the API.

Start with installing [Mock Service Worker](https://www.npmjs.com/package/msw) as a dev dependency:

```
npm install msw --save-dev
```

How does MSW work? From MSW's documentation:

_"In-browser usage is what sets Mock Service Worker apart from other tools. Utilizing the Service Worker API, which can intercept requests for the purpose of caching, Mock Service Worker responds to captured requests with your mock definition on the network level. This way your application knows nothing about the mocking."_

We're not using MSW within the browser, but it still works the same within our tests by intercept requests at the network level. This means that we don't need to mock `fetch` or make any changes to our component code.

Now that we have the package installed, let's create a directory in `src` called `test`, and inside `test` a file called `server.js`, where we'll put the code for our mock testing server.

**src/test/server.js**

```js
import { setupServer } from 'msw/node';

const server = setupServer();

export default server;
```

_Note: To keep ESLint from complaining about the import from `devDependencies`, add this rule to your `.eslintrc.json` file:_

**.eslintrc.json**

```json
"import/no-extraneous-dependencies": [
  "error", 
  {
    "devDependencies": true
  }
]
```

We need to configure the server to return the JSON for the panels when a GET request is made to `http://localhost:8080/api/solarpanel`. We can use our actual server to get the JSON by starting the backend in IntelliJ and using REST Client in VS Code to send an HTTP request.

With the panels JSON in hand, add a file named `panels.json` to the `src/test` folder:

**src/test/panels.json**

```json
[
  {
    "id": 3,
    "section": "Flats",
    "row": 1,
    "column": 1,
    "yearInstalled": 2017,
    "material": "A_SI",
    "tracking": true
  },
  {
    "id": 4,
    "section": "Flats",
    "row": 2,
    "column": 6,
    "yearInstalled": 2017,
    "material": "CD_TE",
    "tracking": true
  },
  {
    "id": 5,
    "section": "Flats",
    "row": 3,
    "column": 7,
    "yearInstalled": 2000,
    "material": "CIGS",
    "tracking": false
  },
  {
    "id": 1,
    "section": "The Ridge",
    "row": 1,
    "column": 1,
    "yearInstalled": 2020,
    "material": "POLY_SI",
    "tracking": true
  },
  {
    "id": 2,
    "section": "The Ridge",
    "row": 1,
    "column": 2,
    "yearInstalled": 2019,
    "material": "MONO_SI",
    "tracking": true
  }
]
```

Then update the `server.js` file:

**src/test/server.js**

```js
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import panels from './panels.json';

const BASE_URL = 'http://localhost:8080/api/solarpanel';

const server = setupServer(
  rest.get(BASE_URL, (_req, res, ctx) => {
    return res(ctx.json(panels));
  })
);

export default server;
```

The `rest.get()` method accepts a URL as the first argument, and a request resolver as the second argument. The request resolver is a function defined with three parameters:

* `req` contains information about the request (such as request parameters, which we'll investigate later)
* `res` allows us to create a mocked response
* `ctx` helps us create context for the mocked response, such as a status code, headers, and body.

Next, we need to integrate the mock server into our test:

**src/components/List.test.js**

```js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import server from '../test/server';
import List from './List';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

function renderComponent() {
  render(
    <MemoryRouter>
      <List />
    </MemoryRouter>
  );
}

describe('List', () => {
  it('should render a table row for each panel', async () => {
    renderComponent();

    // This doesn't work as the <table> element is rendered regardless if data has been loaded or not.
    // const table = await screen.findByRole('table');
    // expect(table).toBeInTheDocument();

    const editLinks = await screen.findAllByRole('link', {
      name: /edit/i,
    });
    expect(editLinks).toHaveLength(5);

    screen.debug();
  });
});
```

Notice the use of `beforeAll()`, `beforeEach()`, and `afterAll()` to manage the mock server:

```js
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
```

Also notice that we need to make our `it` callback method `async` so that we can `await` the `findAllByRole()` method call. The `findBy` query methods return a Promise, so they can be awaited. They also keep querying for an element (i.e. retrying) every `50ms` until `1000ms` has elapsed.

For more information about Testing Library's async API, see: https://testing-library.com/docs/dom-testing-library/api-async

If we update the `List` component to render an initial "Loading..." message, we can update our test to wait for that message to disappear (removed from the DOM) before we attempt to query and assert an expectations about the table of panels.

**src/components/List.js**

```js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function List() {
  const [panels, setPanels] = useState(null);

  const loadPanels = () => {
    fetch('http://localhost:8080/api/solarpanel')
      .then((response) => response.json())
      .then((payload) => setPanels(payload));
  };

  useEffect(loadPanels, []); // call my callback function when the component loads

  if (panels === null) {
    return <p>Loading...</p>;
  }

  if (panels.length === 0) {
    return <p>No panels to display.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Section</th>
          <th>Row</th>
          <th>Column</th>
          <th>Material</th>
          <th>Year Installed</th>
          <th>Is Tracking?</th>
          <th>Edit?</th>
          <th>Delete?</th>
        </tr>
      </thead>

      <tbody>
        {panels.map((panel) => (
          <tr key={panel.id}>
            <td>{panel.id}</td>
            <td>{panel.section}</td>
            <td>{panel.row}</td>
            <td>{panel.column}</td>
            <td>{panel.material}</td>
            <td>{panel.yearInstalled}</td>
            <td>{panel.tracking ? 'Yes' : 'No'}</td>
            <td>
              <Link to={`/edit/${panel.id}`}>Edit</Link>
            </td>
            <td>
              <Link to={`/delete/${panel.id}`}>Delete</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default List;
```

**src/components/List.test.js**

```js
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import server from '../test/server';
import List from './List';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

function renderComponent() {
  render(
    <MemoryRouter>
      <List />
    </MemoryRouter>
  );
}

describe('List', () => {
  it('should render a table row for each panel', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    screen.debug();
  });
});
```

The `waitForElementToBeRemoved()` method will return when the specified element has been removed from the document.

Here's what a complete test that checks the content of each table row, including the table header row, might look like:

**src/components/List.test.js**

```js
import {
  getByRole,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import server from '../test/server';

import List from './List';
import panels from '../test/panels.json';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

function renderComponent() {
  render(
    <MemoryRouter>
      <List />
    </MemoryRouter>
  );
}

describe('List', () => {
  it('should render a table row for each panel', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const tableRows = screen.getAllByRole('row');

    expect(tableRows).toHaveLength(6); // 5 rows (one per panel) plus header row

    // Remove the header row.
    const headerRow = tableRows.shift();

    expect(headerRow.children.item(0)).toHaveTextContent(/id/i);
    expect(headerRow.children.item(1)).toHaveTextContent(/section/i);
    expect(headerRow.children.item(2)).toHaveTextContent(/row/i);
    expect(headerRow.children.item(3)).toHaveTextContent(/column/i);
    expect(headerRow.children.item(4)).toHaveTextContent(/material/i);
    expect(headerRow.children.item(5)).toHaveTextContent(/year installed/i);
    expect(headerRow.children.item(6)).toHaveTextContent(/is tracking\?/i);
    expect(headerRow.children.item(7)).toHaveTextContent(/edit\?/i);
    expect(headerRow.children.item(8)).toHaveTextContent(/delete\?/i);

    // Now check that each of the panel rows contains the expected content...
    tableRows.forEach((row, index) => {
      expect(row.children.item(0)).toHaveTextContent(panels[index].id);
      expect(row.children.item(1)).toHaveTextContent(panels[index].section);
      expect(row.children.item(2)).toHaveTextContent(panels[index].row);
      expect(row.children.item(3)).toHaveTextContent(panels[index].column);
      expect(row.children.item(4)).toHaveTextContent(panels[index].material);
      expect(row.children.item(5)).toHaveTextContent(
        panels[index].yearInstalled
      );
      expect(row.children.item(6)).toHaveTextContent(
        panels[index].tracking ? /yes/i : /no/i
      );

      const editLink = getByRole(row, 'link', { name: /edit/i });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', `/edit/${panels[index].id}`);

      const deleteLink = getByRole(row, 'link', { name: /delete/i });
      expect(deleteLink).toBeInTheDocument();
      expect(deleteLink).toHaveAttribute('href', `/delete/${panels[index].id}`);
    });
  });
});
```

Let's also write tests to check that:

* A "loading" message is displayed initially
* A "no records" message is displayed if there are no records

For the first test, we can use `getByText()` to check if the `List` component initially renders the "loading" message. This works because `getByText()` synchronously checks the DOM for the matching text before the `fetch` method call is completed.

**src/components/List.test.js**

```js
it('should initially render a loading message', () => {
  renderComponent();

  const loading = screen.getByText(/loading/i);

  expect(loading).toBeInTheDocument();
});
```

For the second test, we need to override the mock server request handler to return an empty array to simulate a "no results" or "no records" response. We can do that by calling the [MSW `server.use()` method](https://mswjs.io/docs/api/setup-server/use) and providing an "override" to the `GET /api/solarpanel` endpoint:

**src/components/List.test.js**

```js
it('should render no records found message when panels are not returned from the API', async () => {
  server.use(
    rest.get('http://localhost:8080/api/solarpanel', (_req, res, ctx) => {
      return res(ctx.json([]));
    })
  );

  renderComponent();

  const noPanelsMessage = await screen.findByText(/no panels to display/i);

  expect(noPanelsMessage).toBeInTheDocument();
});
```

This request handler will be removed when the [MSW `server.resetHandlers()` method](https://mswjs.io/docs/api/setup-server/reset-handlers) is called in the `afterEach()` method:

```js
afterEach(() => server.resetHandlers());
```

Here's the completed `List.test.js` test file:

**src/components/List.test.js**

```js
import {
  getByRole,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import server from '../test/server';

import List from './List';
import panels from '../test/panels.json';

function renderComponent() {
  render(
    <MemoryRouter>
      <List />
    </MemoryRouter>
  );
}

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('List', () => {
  it('should render a table row for each panel', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    const tableRows = screen.getAllByRole('row');

    expect(tableRows).toHaveLength(6); // 5 rows (one per panel) plus header row

    // Remove the header row.
    const headerRow = tableRows.shift();

    expect(headerRow.children.item(0)).toHaveTextContent(/id/i);
    expect(headerRow.children.item(1)).toHaveTextContent(/section/i);
    expect(headerRow.children.item(2)).toHaveTextContent(/row/i);
    expect(headerRow.children.item(3)).toHaveTextContent(/column/i);
    expect(headerRow.children.item(4)).toHaveTextContent(/material/i);
    expect(headerRow.children.item(5)).toHaveTextContent(/year installed/i);
    expect(headerRow.children.item(6)).toHaveTextContent(/is tracking\?/i);
    expect(headerRow.children.item(7)).toHaveTextContent(/edit\?/i);
    expect(headerRow.children.item(8)).toHaveTextContent(/delete\?/i);

    // Now check that each of the panel rows contains the expected content...
    tableRows.forEach((row, index) => {
      expect(row.children.item(0)).toHaveTextContent(panels[index].id);
      expect(row.children.item(1)).toHaveTextContent(panels[index].section);
      expect(row.children.item(2)).toHaveTextContent(panels[index].row);
      expect(row.children.item(3)).toHaveTextContent(panels[index].column);
      expect(row.children.item(4)).toHaveTextContent(panels[index].material);
      expect(row.children.item(5)).toHaveTextContent(
        panels[index].yearInstalled
      );
      expect(row.children.item(6)).toHaveTextContent(
        panels[index].tracking ? /yes/i : /no/i
      );

      const editLink = getByRole(row, 'link', { name: /edit/i });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', `/edit/${panels[index].id}`);

      const deleteLink = getByRole(row, 'link', { name: /delete/i });
      expect(deleteLink).toBeInTheDocument();
      expect(deleteLink).toHaveAttribute('href', `/delete/${panels[index].id}`);
    });
  });

  it('should initially render a loading message', () => {
    renderComponent();

    const loading = screen.getByText(/loading/i);

    expect(loading).toBeInTheDocument();
  });

  it('should render no records found message when panels are not returned from the API', async () => {
    server.use(
      rest.get('http://localhost:8080/api/solarpanel', (_req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    renderComponent();

    const noPanelsMessage = await screen.findByText(/no panels to display/i);

    expect(noPanelsMessage).toBeInTheDocument();
  });
});
```

## React Testing Part 3

### Testing a Component That Requires User Actions

Next, we'll test the `Form` component. This will require us to program user interactions with the screen.

We'll start with testing adding a panel, specifically that the component correctly updates form input element values.

Before we add our new test file, let's add two request handlers to our mock server:

**src/test/server.js**

```js
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import panels from './panels.json';

const BASE_URL = 'http://localhost:8080/api/solarpanel';

const server = setupServer(
  rest.get(BASE_URL, (_req, res, ctx) => {
    return res(ctx.json(panels));
  }),

  // NEW!!! Handler to mock requests for a single panel
  rest.get(`${BASE_URL}/:panelId`, (req, res, ctx) => {
    const { panelId } = req.params;
    const panel = panels.find((p) => p.panelId === parseInt(panelId, 10));
    if (panel) {
      return res(ctx.json(panel));
    }
    return res(ctx.status(404));
  }),

  // NEW!!! Handler to mock requests to create a panel
  rest.post(BASE_URL, (_req, res, ctx) => {
    return res(ctx.status(201));
  })
);

export default server;
```

Then add a test file named `Form.test.js` with the following starter code:

**src/components/Form.test.js**

```js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import server from '../test/server';

import Form from './Form';

function renderComponent() {
  render(
    <MemoryRouter>
      <Form />
    </MemoryRouter>
  );
}

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('Form', () => {
  it('should update form input elements with the correct values', () => {
    renderComponent();
  });
});
```

Now that we've stubbed out our component test file, we can move onto seeing how we can use Testing Library to "click" the "Save" button in our `Form` component.

Let's make sure we have React Testing Library and `user-event` version 14 installed, as the transition from 13.5 to 14 had some major updates.

In your terminal, press `ctrl-c` or `q` to quit to stop the test runner. Run the following:

```
npm install @testing-library/react@14 @testing-library/user-event@14
```

Verify that the dependencies in your `package.json` have been updated. Run `npm test` again to restart the test runner.

Import `userEvent`:

```js
import userEvent from '@testing-library/user-event';
```

Call the `userEvent.setup()` method to start a user session:

```js
const user = userEvent.setup();
```

The `user` object that's returned from `userEvent.setup()` provides a collection of methods that we can use to simulate user interactions with the screen, including typing into input elements and clicking submit buttons.

Get a reference to the input element:

```js
const sectionInput = screen.getByLabelText(/section/i);
```

Then use the `user.click()` method to click on the section input element and the `user.keyboard()` method to type some text:

```js
await user.click(sectionInput);
await user.keyboard('Test');
```

We can also use the `user.type()` method to do both of these things with one method call:

```js
await user.type(sectionInput, 'Test');
```

After typing some text into an input element, we can assert that the input element has the expected value:

```js
expect(sectionInput).toHaveValue('Test');
```

Now let's use `user` to type into each of the form input elements and check that each input element has the expected value:

```js
const sectionInput = screen.getByLabelText(/section/i);
const rowInput = screen.getByLabelText(/row/i);
const columnInput = screen.getByLabelText(/column/i);
const materialSelect = screen.getByLabelText(/material/i);
const yearInstalledInput = screen.getByLabelText(/year installed/i);
const trackingInput = screen.getByLabelText(/tracking/i);

await user.type(sectionInput, 'Test');
await user.type(rowInput, '1');
await user.type(columnInput, '2');
await user.selectOptions(materialSelect, 'POLY_SI');
await user.type(yearInstalledInput, '2000');
await user.click(trackingInput);

expect(sectionInput).toHaveValue('Test');
expect(rowInput).toHaveValue(1);
expect(columnInput).toHaveValue(2);
expect(materialSelect).toHaveValue('POLY_SI');
expect(yearInstalledInput).toHaveValue(2000);
expect(trackingInput).toBeChecked();
```

Notice the differences between text inputs, selects, and checkboxes. Another interesting bit is that Jest's `toHaveValue()` method will parse number input element values to the `Number` type, so you need to pass a number to the `toHaveValue()` method, not a string.

Here's the complete `Form.test.js` file at this point:

**src/components/Form.test.js**

```js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import server from '../test/server';

import Form from './Form';

function renderComponent() {
  render(
    <MemoryRouter>
      <Form />
    </MemoryRouter>
  );
}

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('Form', () => {
  it('should update form input elements with the correct values', async () => {
    const user = userEvent.setup();
    renderComponent();

    const sectionInput = screen.getByLabelText(/section/i);
    const rowInput = screen.getByLabelText(/row/i);
    const columnInput = screen.getByLabelText(/column/i);
    const materialSelect = screen.getByLabelText(/material/i);
    const yearInstalledInput = screen.getByLabelText(/year installed/i);
    const trackingInput = screen.getByLabelText(/tracking/i);

    await user.type(sectionInput, 'Test');
    await user.type(rowInput, '1');
    await user.type(columnInput, '2');
    await user.selectOptions(materialSelect, 'POLY_SI');
    await user.type(yearInstalledInput, '2000');
    await user.click(trackingInput);

    expect(sectionInput).toHaveValue('Test');
    expect(rowInput).toHaveValue(1);
    expect(columnInput).toHaveValue(2);
    expect(materialSelect).toHaveValue('POLY_SI');
    expect(yearInstalledInput).toHaveValue(2000);
    expect(trackingInput).toBeChecked();
  });
});
```

Now let's add a new test that checks that a complete, valid form submission is handled correctly.

Update `renderComponent()` to accept the initial route and render routes for add, update, and list:

```js
function renderComponent(route) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/add" element={<Form />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </MemoryRouter>
  );
}
```

Then update the `renderComponent()` function calls:

```js
renderComponent('/add');
```

And let's define a `fillForm()` helper function to help keep our code DRY:

```js
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
  const trackingInput = screen.getByLabelText(/tracking/i);

  await user.type(sectionInput, section);
  await user.type(rowInput, `${row}`);
  await user.type(columnInput, `${column}`);
  await user.selectOptions(materialSelect, material);
  await user.type(yearInstalledInput, `${yearInstalled}`);
  if (isTracking) {
    await user.click(trackingInput);
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
```

Here's the complete `Form.test.js` file with our second test stubbed out:

**src/components/Form.test.js**

```js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import server from '../test/server';

import Form from './Form';
import List from './List';

function renderComponent(route) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/add" element={<Form />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="/list" element={<List />} />
      </Routes>
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
  const trackingInput = screen.getByLabelText(/tracking/i);

  await user.type(sectionInput, section);
  await user.type(rowInput, `${row}`);
  await user.type(columnInput, `${column}`);
  await user.selectOptions(materialSelect, material);
  await user.type(yearInstalledInput, `${yearInstalled}`);
  if (isTracking) {
    await user.click(trackingInput);
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

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

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

    // TODO finish test...
  });
});
```

To submit the form, we need to query for the submit button and click it:

```js
const submitButton = screen.getByRole('button', { name: /save/i });
await user.click(submitButton);
```

Our test is passing, but we still need to check if the user is redirected to the list page.

Since we don't have headings on our pages that we could look for, let's update our `renderComponent()` function so that we have access to the current location pathname.

Import `useLocation` from `react-router-dom`, define a `LocationDisplay` component, and render that component within `renderComponent()`:

```js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation, MemoryRouter, Routes, Route } from 'react-router-dom';
import server from '../test/server';

import Form from './Form';
import List from './List';

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
```

Now within our test, we can wait for the form to not be in the document, then get use the `screen.getByTestId()` function to get the `<div>` element that contains the current location pathname:

```js
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
```

Excellent! Now we have our second `Form` component test passing.

Is it possible to check if the form state is reset after submitting the form? Yes!

First, import `Link` from `react-router-dom` and add a link to the `renderComponent()` function:

```js
function renderComponent(route) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Link to="/add">Add</Link>
      <Routes>
        <Route path="/add" element={<Form />} />
        <Route path="/edit/:id" element={<Form />} />
        <Route path="/list" element={<List />} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>
  );
}
```

After confirming that the user is now viewing the list page, we can click the "Add" link and then assert that all of the form fields are back to their default values:

```js
await user.click(screen.getByRole('link', { name: /add/i }));

expect(screen.getByLabelText(/section/i)).toHaveValue('');
expect(screen.getByLabelText(/row/i)).toHaveValue(null);
expect(screen.getByLabelText(/column/i)).toHaveValue(null);
expect(screen.getByLabelText(/material/i)).toHaveValue('POLY_SI');
expect(screen.getByLabelText(/year installed/i)).toHaveValue(null);
expect(screen.getByLabelText(/tracking/i)).not.toBeChecked();
```

Here's the complete `Form.test.js` file:

**src/components/Form.test.js**

```js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  useLocation,
  Link,
  MemoryRouter,
  Routes,
  Route,
} from 'react-router-dom';
import server from '../test/server';

import Form from './Form';
import List from './List';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}

function renderComponent(route) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Link to="/add">Add</Link>
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
  const trackingInput = screen.getByLabelText(/tracking/i);

  await user.type(sectionInput, section);
  await user.type(rowInput, `${row}`);
  await user.type(columnInput, `${column}`);
  await user.selectOptions(materialSelect, material);
  await user.type(yearInstalledInput, `${yearInstalled}`);
  if (isTracking) {
    await user.click(trackingInput);
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

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

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

    await user.click(screen.getByRole('link', { name: /add/i }));

    expect(screen.getByLabelText(/section/i)).toHaveValue('');
    expect(screen.getByLabelText(/row/i)).toHaveValue(null);
    expect(screen.getByLabelText(/column/i)).toHaveValue(null);
    expect(screen.getByLabelText(/material/i)).toHaveValue('POLY_SI');
    expect(screen.getByLabelText(/year installed/i)).toHaveValue(null);
    expect(screen.getByLabelText(/tracking/i)).not.toBeChecked();
  });
});
```

### Next Steps or Things to Try On Your Own

_Try fleshing out the `Form` component tests..._

* Add a new test that checks that a cancel link is present and has the expected path

* Test unhappy paths...
  * 400 response... does the component display API validation messages?
  * 500 response on POST... our code doesn't handle this scenario... but it should

* Test updating a panel...
  * Test that the panel loads the panel into the form correctly
  * Test that an update can be completed successfully
  * 404 response when loading the panel... our code doesn't handle this scenario... but it should

_Try testing the `ConfirmDelete` component..._

### Testing Error

Remember when I was getting `TypeError: Cannot read properties of null (reading '_location')` warnings/errors running my form tests?

After some experimentation and debugging I was able to determine why this was happening.

The form test that was causing the issue was this test:

```js
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
```

Clicking the form submit button results in a POST request being sent to the mock server. After the mock server returns a 201 response, the user is redirected to the solar panels list page. When the `List` component loads, it makes a GET request to the mock server. The `TypeError: Cannot read properties of null (reading '_location')` warning/error is the result of the test exiting before the GET request completes and the `List` component state is updated. If we use the `waitForElementToBeRemoved()` method to detect when the `List` component's "loading..." message has been removed from the DOM, then we can ensure that all asynchronous processes have completed before our test exits.

Here's what the fixed test looks like (there's just one more line of code added to the end):

```js
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

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
});
```

With that change in place, every run of tests finishes without any errors or warnings.

The takeaway here is to be extra careful to allow all asynchronous processes to complete within your tests.
