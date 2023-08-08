import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function ConfirmDelete() {
  const params = useParams();
  const navigate = useNavigate();

  const [panel, setPanel] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/solarpanel/${params.id}`).then(
      (response) => {
        if (response.ok) {
          response.json().then(setPanel);
        } else {
          // we didn't find a panel for some reason
          navigate('/not-found');
        }
      }
    );
  }, [params.id]);

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/solarpanel/${params.id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        navigate('/list');
      } else {
        console.log(`Unexpected response status code: ${response.status}`);
      }
    });
  };

  // if we don't have a panel yet then don't attempt to render the confirmation information
  if (panel === null) {
    return null;
  }

  return (
    <>
      <h2>Confirm Delete</h2>
      <p>Delete this panel?</p>
      <ul>
        <li>Section: {panel.section}</li>
        <li>Row: {panel.row}</li>
        <li>Column: {panel.column}</li>
      </ul>
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
      <Link to="/list">Cancel</Link>
    </>
  );
}

export default ConfirmDelete;
