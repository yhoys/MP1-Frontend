// Centralized validation functions
// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Required field validation
export const isRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} es requerido`;
  }
  return "";
};

// String length validation
export const validateLength = (value, min, max, fieldName) => {
  if (!value) return "";
  const length = value.toString().trim().length;
  if (length < min) {
    return `${fieldName} debe tener mínimo ${min} caracteres`;
  }
  if (length > max) {
    return `${fieldName} debe tener máximo ${max} caracteres`;
  }
  return "";
};

// Phone validation (Colombia format or general numeric)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{7,10}$/;
  return phoneRegex.test(phone?.replace(/\D/g, ""));
};

// Document number validation (numeric)
export const isValidDocumentNumber = (number) => {
  const docRegex = /^[0-9a-zA-Z]{5,20}$/;
  return docRegex.test(number);
};

// Date validation
export const isValidDate = (dateString) => {
  if (!dateString) return true;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Age validation (must be at least 18 years old)
export const isValidAge = (birthDate) => {
  if (!birthDate) return true;
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

// Validators object with field-specific validation
export const Validators = {
  nombres: (value) => {
    const error = isRequired(value, "Nombres");
    if (error) return error;
    return validateLength(value, 2, 50, "Nombres");
  },

  apellidos: (value) => {
    const error = isRequired(value, "Apellidos");
    if (error) return error;
    return validateLength(value, 2, 50, "Apellidos");
  },

  email: (value) => {
    const error = isRequired(value, "Email");
    if (error) return error;
    if (!isValidEmail(value)) return "Email no es válido";
    return "";
  },

  numeroDocumento: (value) => {
    const error = isRequired(value, "Número de documento");
    if (error) return error;
    if (!isValidDocumentNumber(value))
      return "Número de documento no válido";
    return "";
  },

  telefono: (value) => {
    const error = isRequired(value, "Teléfono");
    if (error) return error;
    if (!isValidPhone(value)) return "Teléfono no válido (7-10 dígitos)";
    return "";
  },

  fechaNacimiento: (value) => {
    const error = isRequired(value, "Fecha de nacimiento");
    if (error) return error;
    if (!isValidDate(value)) return "Fecha no válida";
    if (!isValidAge(value)) return "Debe ser mayor de 18 años";
    return "";
  },

  codigo: (value) => {
    const error = isRequired(value, "Código");
    if (error) return error;
    return validateLength(value, 1, 10, "Código");
  },

  nombre: (value) => {
    const error = isRequired(value, "Nombre");
    if (error) return error;
    return validateLength(value, 2, 50, "Nombre");
  },

  password: (value) => {
    const error = isRequired(value, "Contraseña");
    if (error) return error;
    if (value.length < 6) return "Contraseña debe tener mínimo 6 caracteres";
    return "";
  },

  rolId: (value) => {
    const error = isRequired(value, "Rol");
    if (error) return error;
    return "";
  },

  tipoDocumentoId: (value) => {
    const error = isRequired(value, "Tipo de documento");
    if (error) return error;
    return "";
  },

  genero: (value) => {
    const error = isRequired(value, "Género");
    if (error) return error;
    return "";
  },
};

// Batch validator for forms
export const validateForm = (formData, requiredFields) => {
  const errors = {};
  requiredFields.forEach((field) => {
    if (Validators[field]) {
      const error = Validators[field](formData[field]);
      if (error) errors[field] = error;
    }
  });
  return errors;
};
