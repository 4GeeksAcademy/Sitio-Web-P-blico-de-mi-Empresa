const form = document.querySelector('#application-form');

if (form) {
  const successMessage = document.querySelector('#form-success');
  const touchedFields = {};

  const fields = {
    fullName: {
      input: document.querySelector('#fullName'),
      feedback: document.querySelector('#fullName-error'),
      hint: 'Incluye nombre y apellido para identificar mejor tu perfil.',
      success: 'Nombre completo correcto.'
    },
    email: {
      input: document.querySelector('#email'),
      feedback: document.querySelector('#email-error'),
      hint: 'Usa un email profesional para facilitar el contacto.',
      success: 'Email válido.'
    },
    phone: {
      input: document.querySelector('#phone'),
      feedback: document.querySelector('#phone-error'),
      hint: 'Añade un teléfono activo con prefijo internacional si aplica.',
      success: 'Teléfono registrado correctamente.'
    },
    location: {
      input: document.querySelector('#location'),
      feedback: document.querySelector('#location-error'),
      hint: 'Ejemplo: Valencia, España o Miami, Estados Unidos.',
      success: 'Ubicación registrada.'
    },
    interestArea: {
      input: document.querySelector('#interestArea'),
      feedback: document.querySelector('#interestArea-error'),
      hint: 'Selecciona el área donde más aportas valor.',
      success: 'Área de interés seleccionada.'
    },
    experienceYears: {
      input: document.querySelector('#experienceYears'),
      feedback: document.querySelector('#experienceYears-error'),
      hint: 'Introduce años completos de experiencia profesional.',
      success: 'Experiencia registrada.'
    },
    sector: {
      input: document.querySelector('#sector'),
      feedback: document.querySelector('#sector-error'),
      hint: 'Indica tu sector principal: tech, retail, finanzas, etc.',
      success: 'Sector principal registrado.'
    },
    motivation: {
      input: document.querySelector('#motivation'),
      feedback: document.querySelector('#motivation-error'),
      hint: 'Comparte en al menos 20 caracteres tu motivación para unirte a Nexova.',
      success: 'Motivación completa y clara.'
    }
  };

  const feedbackToneClasses = {
    info: 'mt-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700',
    warning: 'mt-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700',
    success: 'mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'
  };

  const inputStateClasses = {
    warning: ['border-amber-300', 'focus:border-amber-400', 'focus:ring-amber-200'],
    success: ['border-emerald-300', 'focus:border-emerald-400', 'focus:ring-emerald-200']
  };

  const clearInputStateClasses = (input) => {
    Object.values(inputStateClasses).forEach((classList) => {
      input.classList.remove(...classList);
    });
  };

  const setFieldState = (fieldName, state) => {
    const field = fields[fieldName];

    if (!field) {
      return false;
    }

    field.feedback.textContent = state.message;
    field.feedback.className = feedbackToneClasses[state.tone];

    clearInputStateClasses(field.input);

    if (state.tone === 'warning') {
      field.input.setAttribute('aria-invalid', 'true');
      field.input.classList.add(...inputStateClasses.warning);
    } else if (state.tone === 'success') {
      field.input.setAttribute('aria-invalid', 'false');
      field.input.classList.add(...inputStateClasses.success);
    } else {
      field.input.setAttribute('aria-invalid', 'false');
    }

    return state.tone !== 'warning';
  };

  const getFieldState = (fieldName, options = {}) => {
    const { strict = false } = options;
    const field = fields[fieldName];

    if (!field) {
      return { tone: 'info', message: '', valid: true };
    }

    const value = field.input.value.trim();
    const isTouched = Boolean(touchedFields[fieldName]);
    const shouldWarn = strict || isTouched;

    if (fieldName === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        return shouldWarn
          ? { tone: 'warning', message: 'El email es obligatorio.', valid: false }
          : { tone: 'info', message: field.hint, valid: false };
      }

      if (!emailPattern.test(value)) {
        return { tone: 'warning', message: 'Introduce un email con formato válido.', valid: false };
      }

      return { tone: 'success', message: field.success, valid: true };
    }

    if (fieldName === 'interestArea') {
      if (!value) {
        return shouldWarn
          ? { tone: 'warning', message: 'Selecciona un área de interés.', valid: false }
          : { tone: 'info', message: field.hint, valid: false };
      }

      return { tone: 'success', message: field.success, valid: true };
    }

    if (fieldName === 'experienceYears') {
      if (!value) {
        return shouldWarn
          ? { tone: 'warning', message: 'Los años de experiencia son obligatorios.', valid: false }
          : { tone: 'info', message: field.hint, valid: false };
      }

      const parsedValue = Number(value);

      if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return { tone: 'warning', message: 'Introduce un número válido de años de experiencia.', valid: false };
      }

      return { tone: 'success', message: field.success, valid: true };
    }

    if (fieldName === 'motivation') {
      if (!value) {
        return shouldWarn
          ? { tone: 'warning', message: 'La motivación es obligatoria.', valid: false }
          : { tone: 'info', message: field.hint, valid: false };
      }

      if (value.length < 20) {
        const missingChars = 20 - value.length;
        return {
          tone: 'warning',
          message: `Te faltan ${missingChars} caracteres para completar una motivación sólida.`,
          valid: false
        };
      }

      return { tone: 'success', message: field.success, valid: true };
    }

    if (!value) {
      const requiredMessageMap = {
        fullName: 'El nombre completo es obligatorio.',
        phone: 'El teléfono es obligatorio.',
        location: 'La ciudad o país es obligatoria.',
        sector: 'El sector principal es obligatorio.'
      };

      return shouldWarn
        ? { tone: 'warning', message: requiredMessageMap[fieldName], valid: false }
        : { tone: 'info', message: field.hint, valid: false };
    }

    return { tone: 'success', message: field.success, valid: true };
  };

  const validateField = (fieldName, options = {}) => {
    const fieldState = getFieldState(fieldName, options);
    const isValid = setFieldState(fieldName, fieldState);
    return isValid && fieldState.valid;
  };

  const validateForm = () => {
    Object.keys(fields).forEach((fieldName) => {
      touchedFields[fieldName] = true;
    });

    return Object.keys(fields).every((fieldName) => validateField(fieldName, { strict: true }));
  };

  Object.entries(fields).forEach(([fieldName, field]) => {
    const eventName = field.input.tagName === 'SELECT' ? 'change' : 'input';

    field.input.addEventListener(eventName, () => {
      validateField(fieldName, { strict: false });

      if (successMessage) {
        successMessage.classList.add('hidden');
        successMessage.textContent = '';
      }
    });

    field.input.addEventListener('blur', () => {
      touchedFields[fieldName] = true;
      validateField(fieldName, { strict: false });
    });
  });

  Object.keys(fields).forEach((fieldName) => {
    validateField(fieldName, { strict: false });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      if (successMessage) {
        successMessage.classList.add('hidden');
        successMessage.textContent = '';
      }

      return;
    }

    if (successMessage) {
      successMessage.textContent = 'Aplicación enviada correctamente (simulada).';
      successMessage.classList.remove('hidden');
    }

    alert('Aplicación enviada correctamente (simulada)');
    form.reset();

    Object.keys(fields).forEach((fieldName) => {
      touchedFields[fieldName] = false;
      validateField(fieldName, { strict: false });
    });
  });

  form.addEventListener('reset', () => {
    if (successMessage) {
      successMessage.classList.add('hidden');
      successMessage.textContent = '';
    }

    Object.keys(fields).forEach((fieldName) => {
      touchedFields[fieldName] = false;
      validateField(fieldName, { strict: false });
    });
  });
}