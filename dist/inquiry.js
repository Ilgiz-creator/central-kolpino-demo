document.querySelectorAll('.inquiry').forEach(root => {
  const form = root.querySelector('form');
  const result = root.querySelector('.inquiry-result');
  const date = form.elements.date;
  if (date) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [`Здравствуйте! Хочу обратиться в ${root.dataset.business}.`];
    const labels = {occasion:'Повод',date:'Дата',guests:'Гостей',time:'Время',duration:'Длительность',checkout:'Выезд',wishes:'Пожелания'};
    for (const [key, value] of data) if (String(value).trim()) {
      const formatted = (key === 'date' || key === 'checkout') ? String(value).split('-').reverse().join('.') : value;
      lines.push(`${labels[key] || key}: ${formatted}`);
    }
    lines.push('Подскажите, пожалуйста, доступность, меню и условия.');
    const message = lines.join('\n');
    root.querySelector('.inquiry-message').textContent = message;
    const send = root.querySelector('.inquiry-send');
    if (root.dataset.whatsapp) send.href = `https://wa.me/${root.dataset.whatsapp}?text=${encodeURIComponent(message)}`;
    form.hidden = true;
    result.hidden = false;
    result.focus();
  });
  root.querySelector('.inquiry-edit').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    form.elements.occasion.focus();
  });
  document.querySelectorAll('[data-occasion]').forEach(link => link.addEventListener('click', () => {
    form.elements.occasion.value = link.dataset.occasion;
    result.hidden = true;
    form.hidden = false;
  }));
});
