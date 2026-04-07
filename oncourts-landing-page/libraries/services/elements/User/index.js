export const UserService = {
  getUser: () => {
    return Digit.SessionStorage.get("User");
  },
};
