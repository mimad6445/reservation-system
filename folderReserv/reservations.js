document.addEventListener('DOMContentLoaded', () => {
    fetchReservations();
  });
  
  function fetchReservations() {
    fetch('http://localhost:8000/api/reservations/mine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: '68320d988fc2de5eda3aafa5' })
    })
      .then(res => res.json())
      .then(data => {
        renderReservations(data);
      })
      .catch(err => {
        console.error('Error loading reservations:', err);
        alert('Could not load reservations.');
      });
  }
  
  function renderReservations(reservations) {
    const tbody = document.getElementById('reservationsBody');
    tbody.innerHTML = ''; // clear existing
  
    reservations.forEach(res => {
      const tr = document.createElement('tr');
  
      tr.innerHTML = `
        <td>${res.product?.name || 'Unknown'}</td>
        <td>${res.user?.name || 'Me'}</td>
        <td>${new Date(res.startdate).toLocaleDateString()}</td>
        <td>${new Date(res.enddate).toLocaleDateString()}</td>
        <td>
          ${res.status || 'Confirmed'}
        </td>
        <td>
        ${
            res.status.toLowerCase() !== 'cancelled'
              ? `<button class="delete-btn" data-id="${res._id}" data-name="${res.product?.name}">🗑️</button>`
              : ''
          }
        </td>
      `;
  
      tbody.appendChild(tr);
    });
  
    attachDeleteListeners();
  }
  
  function attachDeleteListeners() {
    const buttons = document.querySelectorAll('.delete-btn');
  
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const productName = btn.dataset.name;
  
        const confirmText = prompt(`Type "drop ${productName}" to confirm deletion:`);
        console.log("confirmText",confirmText);
        if (confirmText === null) {
            alert('Deletion canceled.');
            return;
        }

        if (confirmText === `drop ${productName}`) {
          deleteReservation(id);
        } else {
          alert('Deletion canceled or incorrect input.');
        }
      });
    });
  }
  
  function deleteReservation(id) {
    fetch(`http://localhost:8000/api/reservations/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        return res.json();
      })
      .then(() => {
        alert('Reservation deleted.');
        fetchReservations();
      })
      .catch(err => {
        console.error(err);
        alert('Error deleting reservation.');
      });
  }
  

  async function fetchUserInfo() {
    try {
      const res = await fetch('http://localhost:8000/api/auth/getinfo/68320d988fc2de5eda3aafa5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      const userInfoEl = document.getElementById('user-info');
      if (data && data.name && data.points != null) {
        userInfoEl.textContent = `${data.name} (${data.points} pts)`;
      }
    } catch (err) {
      console.error('Failed to load user info:', err);
    }
  }
  
  fetchUserInfo();