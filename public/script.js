let token = localStorage.getItem('token');
let isRegistering = false;

// UI Elements
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const linksList = document.getElementById('links-list');

// Auth Handlers
document.getElementById('toggle-auth').addEventListener('click', () => {
    isRegistering = !isRegistering;
    document.getElementById('auth-title').innerText = isRegistering ? 'Create Account' : 'Welcome Back';
    document.getElementById('login-btn').innerText = isRegistering ? 'Sign Up' : 'Login';
    document.getElementById('toggle-auth').innerText = isRegistering ? 'Already have an account?' : 'Create account';
});

document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        if (isRegistering) {
            isRegistering = false;
            alert('Registered! Please login.');
            location.reload();
        } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            showDashboard();
        }
    } catch (e) {
        alert(e.message);
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Shortener Handlers
document.getElementById('shorten-btn').addEventListener('click', async () => {
    const originalUrl = document.getElementById('long-url').value;
    const customCode = document.getElementById('custom-code').value;
    
    try {
        const res = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ originalUrl, customCode })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error);
        }
        
        document.getElementById('long-url').value = '';
        document.getElementById('custom-code').value = '';
        fetchLinks();
    } catch (e) {
        alert(e.message);
    }
});

async function fetchLinks() {
    const res = await fetch('/api/my-links', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const links = await res.json();
    renderLinks(links);
}

function renderLinks(links) {
    linksList.innerHTML = links.length ? '' : '<p style="text-align:center;color:#64748b">No links yet</p>';
    links.forEach(link => {
        const div = document.createElement('div');
        div.className = 'link-item';
        div.innerHTML = `
            <div class="link-info">
                <a href="/${link.code}" class="short-link" target="_blank">${location.host}/${link.code}</a>
                <span class="long-link">${link.originalUrl}</span>
            </div>
            <div class="stats">
                Clicks: <span class="count">${link.clicks}</span>
            </div>
        `;
        linksList.appendChild(div);
    });
}

function showDashboard() {
    authScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    document.getElementById('display-user').innerText = localStorage.getItem('username');
    fetchLinks();
}

// Initial State
if (localStorage.getItem('token')) {
    showDashboard();
}
