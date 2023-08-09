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
