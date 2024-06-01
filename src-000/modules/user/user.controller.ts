import express, { Router, Request, Response } from 'express';
import UserService from './user.service';
import { MaskedUser } from '../interfaces';

class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser: MaskedUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async retrieveUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const user: MaskedUser | undefined = await UserService.retrieveUser(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser: MaskedUser = await UserService.updateUser(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const userRouter: Router = express.Router();

userRouter.post('/register', UserController.createUser);
userRouter.get('/user/:id', UserController.retrieveUser);
userRouter.put('/user/:id', UserController.updateUser);
userRouter.delete('/user/:id', UserController.deleteUser);

export default userRouter;
