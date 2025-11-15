export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateProject = (project) => {
  const errors = {};

  if (!project.name.trim()) {
    errors.name = "Project name is required";
  }

  if (
    project.startDate &&
    project.endDate &&
    new Date(project.startDate) > new Date(project.endDate)
  ) {
    errors.endDate = "End date must be after start date";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTask = (task) => {
  const errors = {};

  if (!task.title.trim()) {
    errors.title = "Task title is required";
  }

  if (task.dueDate && new Date(task.dueDate) < new Date()) {
    errors.dueDate = "Due date cannot be in the past";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
