const loanAmount = document.querySelector('#loanAmount');
const interestRate = document.querySelector('#interestRate');
const loanTerm = document.querySelector('#loanTerm');
const amountRange = document.querySelector('#amountRange');
const rateRange = document.querySelector('#rateRange');
const termRange = document.querySelector('#termRange');

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const controls = [
  { input: loanAmount, range: amountRange },
  { input: interestRate, range: rateRange },
  { input: loanTerm, range: termRange }
];

function formatCurrency(value) {
  return currency.format(Math.round(value));
}

function updateRangeFill(range) {
  const min = Number(range.min);
  const max = Number(range.max);
  const value = Number(range.value);
  const progress = ((value - min) / (max - min)) * 100;
  range.style.setProperty('--progress', `${progress}%`);
}

function calculateEmi() {
  const principal = Math.max(0, Number(loanAmount.value) || 0);
  const annualRate = Math.max(0, Number(interestRate.value) || 0);
  const years = Math.max(0, Number(loanTerm.value) || 0);
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 1200;
  const emi = months === 0
    ? 0
    : monthlyRate === 0
      ? principal / months
      : principal * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
  const total = emi * months;
  const interest = Math.max(0, total - principal);
  const principalShare = total > 0 ? (principal / total) * 100 : 0;

  document.querySelector('#emiValue').innerHTML = `${formatCurrency(emi)}<span> / month</span>`;
  document.querySelector('#principalValue').textContent = formatCurrency(principal);
  document.querySelector('#interestValue').textContent = formatCurrency(interest);
  document.querySelector('#totalValue').textContent = formatCurrency(total);
  document.querySelector('#monthsValue').textContent = `${months} monthly ${months === 1 ? 'payment' : 'payments'}`;
  document.querySelector('#principalSegment').style.width = `${principalShare}%`;
  document.querySelector('#interestSegment').style.width = `${100 - principalShare}%`;
  document.querySelector('.breakdown-bar').setAttribute(
    'aria-label',
    `Repayment breakdown: ${Math.round(principalShare)} percent principal and ${Math.round(100 - principalShare)} percent interest`
  );
}

function syncFromInput(input, range) {
  const value = Number(input.value);
  const min = Number(input.min);
  const max = Number(input.max);
  if (!Number.isFinite(value)) return;
  const clampedValue = Math.min(max, Math.max(min, value));
  range.value = String(clampedValue);
  updateRangeFill(range);
  calculateEmi();
}

controls.forEach(({ input, range }) => {
  input.addEventListener('input', () => syncFromInput(input, range));
  input.addEventListener('change', () => {
    const value = Number(input.value);
    input.value = String(Math.min(Number(input.max), Math.max(Number(input.min), Number.isFinite(value) ? value : Number(input.min))));
    syncFromInput(input, range);
  });
  range.addEventListener('input', () => {
    input.value = range.value;
    updateRangeFill(range);
    calculateEmi();
  });
  updateRangeFill(range);
});

calculateEmi();
