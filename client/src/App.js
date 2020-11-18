import { useEffect, useState } from "react";
import "./App.css";
import { getPassword } from "./api/passwords";
import useAsync from "./hooks/useAsync";

function App() {
  const [passwordName, setPasswordName] = useState("");
  const { data, loading, error, doFetch } = useAsync(() =>
    getPassword(passwordName)
  );

  useEffect(() => {
    doFetch();
  }, []);

  function handleChange(event) {
    setPasswordName(event.target.value);
    console.log(passwordName);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    doFetch();
  }

  return (
    <div className="App">
      <form>
        <input
          type="text"
          placeholder="Password Name"
          onChange={handleChange}
          value={passwordName}
        />
        <button type="button" onClick={handleSubmit}>
          Go!
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      <p>{data}</p>
    </div>
  );
}

export default App;
