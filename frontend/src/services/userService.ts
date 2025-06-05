export const userService = {
  signup: async (email: string, password: string, name: string, role: string) => {
    // Implement your API call here
    console.log("Registering user:", { email, password, name, role });
  },
};
