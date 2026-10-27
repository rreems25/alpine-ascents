(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);

  // Visitor count
  const visitKey = 'alpineAscents.visits';
  let visits = Number(localStorage.getItem(visitKey) || 0) + 1;
  localStorage.setItem(visitKey, String(visits));
  $('visitorCount').textContent = visits.toLocaleString();

  // Bottom screen scroll
  const ticker = document.querySelector('.ticker');
  const track = ticker && ticker.querySelector('.ticker-track');
  const group = track && track.querySelector('.ticker-group');
  const setLive = (name, text) => {
    document.querySelectorAll(`[data-live="${name}"]`).forEach((el) => { el.textContent = text; });
  };
  if (group) {
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    copy.querySelectorAll('a, button, [tabindex]').forEach((el) => { el.tabIndex = -1; });
    track.appendChild(copy);
    // Scroll speed
    const setSpeed = () => {
      ticker.style.setProperty('--ticker-duration', `${Math.max(15, group.offsetWidth / 60)}s`);
    };
    setSpeed();
    window.addEventListener('resize', setSpeed);
  }

  // Live local date and time
  const updateClock = () => {
    setLive('datetime', new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium', timeStyle: 'medium'
    }).format(new Date()));
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  // Login/register flow
  const overlay = $('loginOverlay');
  const form = $('loginForm');
  let registering = false;
  const openLogin = () => { overlay.hidden = false; $('loginEmail').focus(); };
  const closeLogin = () => { overlay.hidden = true; $('loginMessage').textContent = ''; };
  $('openLogin').addEventListener('click', openLogin);
  $('closeLogin').addEventListener('click', closeLogin);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) closeLogin(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) closeLogin(); });
  $('registerToggle').addEventListener('click', () => {
    registering = !registering;
    $('loginTitle').innerHTML = registering ? 'Start your <em>ascent.</em>' : 'Your next <em>ascent.</em>';
    form.querySelector('button[type="submit"]').textContent = registering ? 'Create demo account' : 'Sign in to demo';
    $('registerToggle').textContent = registering ? 'Already registered? Sign in' : 'New here? Create a demo account';
    $('loginMessage').textContent = '';
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = $('loginEmail').value.trim().toLowerCase();
    const password = $('loginPassword').value;
    const accounts = JSON.parse(localStorage.getItem('alpineAscents.demoAccounts') || '{}');
    if (registering) {
      if (accounts[email]) { $('loginMessage').textContent = 'A demo account with that email already exists.'; return; }
      accounts[email] = password;
      localStorage.setItem('alpineAscents.demoAccounts', JSON.stringify(accounts));
      $('loginMessage').textContent = 'Demo account created. You can now sign in.';
      registering = false;
      $('loginTitle').innerHTML = 'Your next <em>ascent.</em>';
      form.querySelector('button[type="submit"]').textContent = 'Sign in to demo';
      $('registerToggle').textContent = 'New here? Create a demo account';
    } else if (accounts[email] === password) {
      $('loginMessage').textContent = `Signed in as ${email} (demo only).`;
    } else {
      $('loginMessage').textContent = 'No matching demo account. Create one first, or check your details.';
    }
  });

  // Interactive Leaflet map with example club markers.
  let map = null;
  if (window.L && $('clubMap')) {
    map = L.map('clubMap').setView([25, 10], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    [
      [47.6062, -122.3321, 'The Mountaineers — Seattle, USA'],
      [39.7555, -105.2211, 'American Alpine Club — Colorado, USA'],
      [53.4808, -2.2426, 'British Mountaineering Council — Manchester, UK']
    ].forEach(([lat, lon, label]) => L.marker([lat, lon]).addTo(map).bindPopup(label));
  } else {
    $('locationStatus').textContent = 'Map library could not load. Check your internet connection.';
  }

  $('locateMe').addEventListener('click', () => {
    if (!navigator.geolocation) { $('locationStatus').textContent = 'Geolocation is not supported by this browser.'; return; }
    $('locationStatus').textContent = 'Requesting location permission…';
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLive('location', `Location: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
      $('locationStatus').textContent = 'Your location is shown on this device only.';
      if (map) {
        map.setView([latitude, longitude], 10);
        L.marker([latitude, longitude]).addTo(map).bindPopup('Your current location').openPopup();
      }
    }, (error) => {
      const messages = { 1: 'Location permission was denied.', 2: 'Your location is unavailable.', 3: 'Location request timed out.' };
      $('locationStatus').textContent = messages[error.code] || 'Could not get your location.';
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  });
})();

// Location Permission
document.getElementById("locationButton").addEventListener("click", function () {
    const locationText = document.getElementById("liveLocation");

    if (!navigator.geolocation) {
        locationText.textContent = "Location is not supported by this browser.";
        return;
    }

    locationText.textContent = "Requesting location permission...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            locationText.textContent =
                "Location: " + latitude.toFixed(4) +
                ", " + longitude.toFixed(4);
        },
        function (error) {
            if (error.code === error.PERMISSION_DENIED) {
                locationText.textContent = "Location permission denied.";
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                locationText.textContent = "Location unavailable.";
            } else {
                locationText.textContent = "Location request timed out.";
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});