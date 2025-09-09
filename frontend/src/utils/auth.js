export const storeToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

// Handle donorId
export const storeDonorId = (donorId) => {
  localStorage.setItem("donorId", donorId);
};

export const getDonorId = () => {
  return localStorage.getItem("donorId");
};

export const removeDonorId = () => {
  localStorage.removeItem("donorId");
};

export const storeEmail = (email) => {
  localStorage.setItem("email", email);
};

export const getEmail = () => {
  return localStorage.getItem("email");
};

export const removeEmail = () => {
  localStorage.removeItem("email");
};
// Logout function to clear everything]]
export const logout = () => {
  removeToken();
  removeDonorId();
  removeEmail()
};


