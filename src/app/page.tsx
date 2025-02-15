// pages/index.tsx
'use client';

import React, { useState } from 'react';

const HomePage = () => {
  // States to manage input fields and response
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState<any[]>([]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Make sure both name and age are provided
    if (!name || !age) {
      setMessage('Both name and age are required');
      return;
    }

    try {
      // Send a POST request to the API route
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success: update message and fetched data
        setMessage('Data added successfully!');
        setData(result);
      } else {
        // Error: display the error message
        setMessage(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Internal server error');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add Data</h1>

      {/* Form for input */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {/* Display success or error message */}
      {message && <p>{message}</p>}

      {/* Display the updated data from JSON file */}
      <h2>Current Data:</h2>
      <ul>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index}>
              {item.name} ({item.age} years old)
            </li>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
