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
