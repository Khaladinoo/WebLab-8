const statusEl = document.getElementById('status-code');
const bodyEl = document.getElementById('response-body');
const buttons = document.querySelectorAll('.button-group button');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    const url = button.getAttribute('data-url');
    const method = button.getAttribute('data-method');

    statusEl.textContent = 'Loading...';
    bodyEl.textContent = 'Fetching data...';

    try {
      const response = await fetch(url, { method });
      statusEl.textContent = `${response.status} ${response.statusText}`;

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();
        bodyEl.textContent = JSON.stringify(jsonData, null, 2);
      } else {
        const textData = await response.text();
        bodyEl.textContent = textData;
      }
    } catch (error) {
      statusEl.textContent = 'Network Error';
      bodyEl.textContent = error.message;
    }
  });
});