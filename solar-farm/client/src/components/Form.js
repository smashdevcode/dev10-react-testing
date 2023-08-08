import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import Errors from './Errors';

function Form() {
  const params = useParams();
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);

  const [section, setSection] = useState('');
  const [row, setRow] = useState('');
  const [column, setColumn] = useState('');
  const [yearInstalled, setYearInstalled] = useState('');
  const [material, setMaterial] = useState('POLY_SI');
  const [tracking, setTracking] = useState(false);

  const resetState = () => {
    setSection('');
    setRow('');
    setColumn('');
    setYearInstalled('');
    setMaterial('POLY_SI');
    setTracking(false);
  };

  useEffect(() => {
    if (params.id !== undefined) {
      fetch(`http://localhost:8080/api/solarpanel/${params.id}`).then(
        (response) => {
          if (response.ok) {
            response.json().then((panel) => {
              setSection(panel.section);
              setRow(panel.row);
              setColumn(panel.column);
              setYearInstalled(panel.yearInstalled);
              setMaterial(panel.material);
              setTracking(panel.tracking);
            });
          } else {
            // is it a 404?
            // is it a 500?
            // is it something else?
            console.log(`Unexpected response status code: ${response.status}`);
          }
        }
      );
    } else {
      resetState();
    }
  }, [params.id]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const newPanel = {
      section,
      row,
      column,
      yearInstalled,
      material,
      tracking,
    };

    let url = null;
    let method = null;

    if (params.id !== undefined) {
      newPanel.id = params.id;
      url = `http://localhost:8080/api/solarpanel/${params.id}`;
      method = 'PUT';
    } else {
      url = 'http://localhost:8080/api/solarpanel';
      method = 'POST';
    }

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(newPanel),
    }).then((response) => {
      if (response.ok) {
        navigate('/list');
        resetState();
      } else {
        response.json().then((errorsData) => {
          if (Array.isArray(errorsData)) {
            setErrors(errorsData);
          } else {
            setErrors([errorsData]);
          }
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Errors errors={errors} />

      <fieldset>
        <label htmlFor="section-input">Section: </label>
        <input
          id="section-input"
          value={section}
          onChange={(evt) => setSection(evt.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="row-input">Row: </label>
        <input
          id="row-input"
          type="number"
          value={row}
          onChange={(evt) => setRow(evt.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="column-input">Column: </label>
        <input
          id="column-input"
          type="number"
          value={column}
          onChange={(evt) => setColumn(evt.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="material-input">Material:</label>
        <select
          id="material-input"
          value={material}
          onChange={(evt) => setMaterial(evt.target.value)}
        >
          <option value="POLY_SI">Multicrystalline Silicon</option>
          <option value="CIGS">Cool Indigo Go-for-it Son</option>
        </select>
      </fieldset>

      <fieldset>
        <label htmlFor="yearInstalled-input">Year installed: </label>
        <input
          id="yearInstalled-input"
          type="number"
          value={yearInstalled}
          onChange={(evt) => setYearInstalled(evt.target.value)}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="tracking-input">Is tracking?</label>
        <input
          id="tracking-input"
          type="checkbox"
          checked={tracking}
          onChange={(evt) => setTracking(evt.target.checked)}
        />
      </fieldset>

      <button type="submit">Save!</button>
      <Link to="/list">Cancel</Link>
    </form>
  );
}

export default Form;
