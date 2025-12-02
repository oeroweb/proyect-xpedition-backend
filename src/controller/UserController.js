import UserService from "../service/UserService.js";

const userService = new UserService();

class UserController {
  async listUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error interno: " + error.message });
    }
  }

  async getUser(req, res) {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    try {
      const updatedUser = await userService.updateUser(id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      const statusCode = error.statusCode || 404;
      res.status(statusCode).json({ message: error.message });
    }
  }
}

export default new UserController();
