// script.js
let selectedProductId = null;
let selectedProductName = null;

async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:8000/api/products');
    const data = await res.json();
    renderProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  products.forEach(product => {
    const tagsArray = product.tags?.length ? JSON.parse(product.tags[0]) : [];

    const card = document.createElement('div');
    card.className = 'card';

    const badgesHTML = tagsArray.map(tag => `<span class="badge-yellow">${tag}</span>`).join('');

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="http://localhost:8000/uploads/${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='default.png';" />
        <div class="badges">${badgesHTML}</div>
      </div>
      <div class="product-name">${product.name}</div>
      <div class="stars">${renderStars(product.rating)}</div>
      <div class="description">${product.description}</div>
      <div class="price-group">
        <div class="price">${product.priceInPoints} DA / Jour</div>
      </div>
      <div class="bottom">
        <button class="btn" onclick="openReservationModal('${product._id}', '${product.name}')">Reserve Now</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderStars(rating = 0) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="${i <= rating ? '' : 'inactive'}">★</span>`;
  }
  return stars;
}

function openReservationModal(productId, productName) {
  selectedProductId = productId;
  selectedProductName = productName;
  document.getElementById('selectedProductName').innerText = productName;
  document.getElementById('reservationModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('reservationModal').classList.add('hidden');
  selectedProductId = null;
  selectedProductName = null;
}



fetchProducts();

// script.js (update this part)
function submitReservation() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  if (!start || !end || new Date(start) > new Date(end)) {
    alert('Please select a valid date range.');
    return;
  }

  const reservation = {
    productId: selectedProductId,
    startdate: start,
    enddate: end,
    userId: '68320d988fc2de5eda3aafa5'
  };
  console.log("reservation",reservation);
  fetch('http://localhost:8000/api/reservations/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservation)
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.error === 'Not enough points') {
          alert('❌ Reservation failed: Not enough points.');
        } else {
          alert(`❌ Reservation failed: ${errorData.error || 'Unknown error.'}`);
        }
        throw new Error('Reservation failed');
      }
      return res.json();
    })
    .then(data => {
      alert(`✅ Reservation confirmed for ${selectedProductName} from ${start} to ${end}`);
      closeModal();
    })
    .catch(err => {
      console.error('Reservation error:', err);
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

async function handleSearch() {
  const keyword = document.getElementById('searchInput').value.trim();
  if (!keyword) return;

  try {
    console.log("keyword",keyword);
    const res = await fetch('http://localhost:7000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: keyword }),
    });

    if (!res.ok) throw new Error('Failed to fetch search results');
    console.log("res",res);
    
    const data = await res.json();
    console.log("data",data);
    renderProducts(data);
  } catch (err) {
    console.error('Search error:', err);
    alert('Search failed. Please try again.');
  }
}
