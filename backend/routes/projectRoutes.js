import {Router} from 'express';
import { body } from 'express-validator';
import * as projectController from '../controllers/projectController.js';
import { authUser } from '../middleware/authMiddleware.js';
                                                               

const router = Router();

router.post('/create',
    authUser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
)

router.get('/all', 
    authUser, 
    projectController.getAllProjects);

router.put('/add-user',
    authUser,
    body('projectId').isString().withMessage('Project id is required').bail(),
    body('users').isArray({min: 1}).withMessage('At least one user is required').bail()
    .custom((users)=>users.every(user=>typeof user === 'string')).withMessage('Invalid user id'),
    projectController.addUserToProject
)

router.get('/get-project/:projectId',
    authUser,
    projectController.getProjectById
)


export default router;
