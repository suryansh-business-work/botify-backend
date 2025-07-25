import { Router } from 'express';
import {
  createCredential,
  getCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
} from './manage-credentials.controllers';
import { authenticateJWT } from '../auth/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, createCredential);
router.get('/', authenticateJWT, getCredentials);
router.get('/:credentialId', authenticateJWT, getCredentialById);
router.put('/:credentialId', authenticateJWT, updateCredential);
router.delete('/:credentialId', authenticateJWT, deleteCredential);

export default router;
