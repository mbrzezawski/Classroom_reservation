import { useEffect } from 'react';

export function FetchRoomsDemo() {
  useEffect(() => {
    fetch('http://localhost:8080/rooms')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Rooms JSON:', data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  }, []);

  return null; // nic nie renderujemy
}
