document.getElementById('year').textContent = new Date().getFullYear();

const counterLine = document.getElementById('counterLine');
const counterLede = document.getElementById('counterLede');

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

async function loadCount() {
  try {
    const res = await fetch('/api/signup');
    if (!res.ok) return;
    const data = await res.json();
    if (typeof data.count === 'number') {
      const next = data.count + 1;
      counterLine.textContent = `You'd be the ${ordinal(next)} founding member to join.`;
      counterLede.textContent = `${data.count} people have already joined the priority list — spots are limited since every seat is guided 1:1.`;
    }
  } catch (e) {
    // fail silently, static copy already in the HTML covers this
  }
}
loadCount();

const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  if (!name || !email) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Joining...';
  formStatus.classList.remove('error');
  formStatus.textContent = '';

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Something went wrong');

    formStatus.textContent = `You're in! You're the ${ordinal(data.position)} founding member on the priority list.`;
    form.reset();
    counterLine.textContent = `${data.position - 1} people have already joined the priority list.`;
  } catch (err) {
    formStatus.classList.add('error');
    formStatus.textContent = "Couldn't save that — mind trying again in a moment?";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Join Priority List';
  }
});
