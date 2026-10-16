/**
 * Evaluates grade based on percentage rules:
 * A: >= 90
 * B: >= 80 and < 90
 * C: >= 70 and < 80
 * D: >= 60 and < 70
 * E: >= 40 and < 60
 * F: < 40
 */
function determineGrade(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
}

function calculateTotal(marks) {
  return marks.reduce((sum, current) => sum + current, 0);
}

function calculatePercentage(totalMarks, maxMarks = 500) {
  return (totalMarks / maxMarks) * 100;
}

function validateMark(rawValue, label) {
  const trimmed = rawValue !== null && rawValue !== undefined ? String(rawValue).trim() : '';
  if (trimmed === '') {
    return { valid: false, message: `${label} mark is required.` };
  }
  const num = Number(trimmed);
  if (Number.isNaN(num)) {
    return { valid: false, message: 'Enter a valid numeric value.' };
  }
  if (num < 0 || num > 100) {
    return { valid: false, message: 'Mark must be between 0 and 100.' };
  }
  return { valid: true, value: num };
}

function initCalculator() {
  const form = document.getElementById('marks-form');
  const resetBtn = document.getElementById('btn-reset');
  const generalError = document.getElementById('general-error');
  const resultsPanel = document.getElementById('results-panel');

  const valTotal = document.getElementById('val-total');
  const valPercentage = document.getElementById('val-percentage');
  const valGrade = document.getElementById('val-grade');

  if (!form || !resetBtn || !generalError || !resultsPanel) return;

  const subjects = [
    { id: 'mark-english', errId: 'err-english', label: 'English' },
    { id: 'mark-maths', errId: 'err-maths', label: 'Mathematics' },
    { id: 'mark-science', errId: 'err-science', label: 'Science' },
    { id: 'mark-computer', errId: 'err-computer', label: 'Computer Science' },
    { id: 'mark-social', errId: 'err-social', label: 'Social Studies' }
  ];

  /**
   * Resets error state for all fields and removes the top general banner
   */
  function clearErrors() {
    generalError.hidden = true;
    generalError.textContent = '';

    subjects.forEach((subj) => {
      const input = document.getElementById(subj.id);
      const errSpan = document.getElementById(subj.errId);
      if (input) input.classList.remove('input-error');
      if (errSpan) errSpan.textContent = '';
    });
  }

  /**
   * Hides results to prevent showing stale outputs
   */
  function hideResults() {
    resultsPanel.hidden = true;
    if (valTotal) valTotal.textContent = '0 / 500';
    if (valPercentage) valPercentage.textContent = '0.00%';
    if (valGrade) {
      valGrade.textContent = '-';
      valGrade.className = 'result-value grade-badge';
    }
  }

  /**
   * Validates inputs, calculates results and assigns grade
   */
  function handleCalculate(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Invalidate prior errors and results immediately
    clearErrors();
    hideResults();

    let hasErrors = false;
    const marks = [];

    subjects.forEach((subj) => {
      const input = document.getElementById(subj.id);
      const errSpan = document.getElementById(subj.errId);
      const rawValue = input ? input.value : '';

      const validation = validateMark(rawValue, subj.label);

      if (!validation.valid) {
        if (input) input.classList.add('input-error');
        if (errSpan) errSpan.textContent = validation.message;
        hasErrors = true;
      } else {
        marks.push(validation.value);
      }
    });

    if (hasErrors) {
      generalError.textContent = 'Please correct the highlighted errors before calculating results.';
      generalError.hidden = false;
      return;
    }

    const totalMarks = calculateTotal(marks);
    const percentage = calculatePercentage(totalMarks, 500);
    const grade = determineGrade(percentage);

    // Format total marks: strip redundant decimal trailing zeros if integer
    const formattedTotal = Number.isInteger(totalMarks) ? totalMarks : totalMarks.toFixed(2);

    if (valTotal) valTotal.textContent = `${formattedTotal} / 500`;
    if (valPercentage) valPercentage.textContent = `${percentage.toFixed(2)}%`;
    if (valGrade) {
      valGrade.textContent = grade;
      valGrade.className = `result-value grade-badge grade-${grade.toLowerCase()}`;
    }

    resultsPanel.hidden = false;
  }

  /**
   * Resets inputs, error banners, and hides results panel
   */
  function handleReset() {
    form.reset();
    clearErrors();
    hideResults();
  }

  // Clear stale results on input modification
  subjects.forEach((subj) => {
    const input = document.getElementById(subj.id);
    if (input) {
      input.addEventListener('input', () => {
        if (!resultsPanel.hidden) {
          hideResults();
        }
      });
    }
  });

  form.addEventListener('submit', handleCalculate);
  resetBtn.addEventListener('click', handleReset);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    determineGrade,
    calculateTotal,
    calculatePercentage,
    validateMark
  };
}
