import express, { Router, Request, Response } from 'express';
import UserService from './user.service';
import { MaskedUser } from '../interfaces';

class UserController {
  static createUser(req: Request, res: Response): void {
    try {
      const user: MaskedUser = UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveUser(req: Request, res: Response): void {
    try {
      const user: MaskedUser | undefined = UserService.retrieveUser(req.params.id);
      res.json(user);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static updateUser(req: Request, res: Response): void {
    try {
      const user: MaskedUser = UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static deleteUser(req: Request, res: Response): void {
    try {
      UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

const userRouter: Router = express.Router();

userRouter.post('/register', UserController.createUser);
userRouter.get('/user/:id', UserController.retrieveUser);
userRouter.put('/user/:id', UserController.updateUser);
userRouter.delete('/user/:id', UserController.deleteUser);

export default userRouter;
