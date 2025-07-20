import { Request, Response } from 'express';
import { ManageCredential, ManageCredentialDTO } from './manage-credentials.model';
import { validate } from 'class-validator';
import { successResponse, successResponseArr, errorResponse, noContentResponse } from '../utils/response-object';

export const createCredential = async (req: Request, res: Response) => {
  try {
    const dto = Object.assign(new ManageCredentialDTO(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return errorResponse(res, errors, 'Validation failed');
    }
    const credential = await ManageCredential.create(req.body);
    return successResponse(res, credential, 'Credential created successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to create credential');
  }
};

export const getCredentials = async (_req: Request, res: Response) => {
  try {
    const credentials = await ManageCredential.find();
    if (!credentials || credentials.length === 0) {
      return noContentResponse(res, [], 'No credentials found');
    }
    return successResponseArr(res, credentials, {}, 'Credentials fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to fetch credentials');
  }
};

export const getCredentialById = async (req: Request, res: Response) => {
  try {
    const credential = await ManageCredential.findById(req.params.id);
    if (!credential) {
      return noContentResponse(res, null, 'Credential not found');
    }
    return successResponse(res, credential, 'Credential fetched successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to fetch credential');
  }
};

export const updateCredential = async (req: Request, res: Response) => {
  try {
    const dto = Object.assign(new ManageCredentialDTO(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return errorResponse(res, errors, 'Validation failed');
    }
    const credential = await ManageCredential.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!credential) {
      return noContentResponse(res, null, 'Credential not found');
    }
    return successResponse(res, credential, 'Credential updated successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to update credential');
  }
};

export const deleteCredential = async (req: Request, res: Response) => {
  try {
    const credential = await ManageCredential.findByIdAndDelete(req.params.id);
    if (!credential) {
      return noContentResponse(res, null, 'Credential not found');
    }
    return successResponse(res, credential, 'Credential deleted successfully');
  } catch (error) {
    return errorResponse(res, error, 'Failed to delete credential');
  }
};
