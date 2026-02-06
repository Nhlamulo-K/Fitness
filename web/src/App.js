import {useEffect, useState} from "react";

function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/goals")
      .then((res) => res.json())
      .then((data) => {
        console.log("fetched goals: ", data);
        setGoals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching goals: ", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Fitness App</h1>
      <h2>Your fitness accountability partner!</h2>

      {loading && <p>Loading goals...</p>}

      <ul>
        {Array.isArray(goals) && goals.length > 0 ? (
          goals.map((goal) => (
            <li key={goal.id}>
              <strong>{goal.type}</strong> - Target: {goal.target} - Active:{" "}
              {goal.active ? "Yes" : "No"}
            </li>
          ))
        ) : (
          !loading && <p>No goals yet</p>
        )}
      </ul>

    </div>
  );
}

export default App;
