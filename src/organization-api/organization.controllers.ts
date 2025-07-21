import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import * as service from "./organization.services";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "./organization.validators";
import {
  successResponse,
  errorResponse,
  noContentResponse,
  successResponseArr,
} from '../utils/response-object';
import { UserOrganizationMappingModel } from '../user-organization-mapping/user-organization-mapping.model';

// Helper function to handle validation
const handleValidation = async (dto: any, res: Response) => {
  const errors = await validate(dto, { skipMissingProperties: true });
  if (errors.length) {
    errorResponse(res, errors, "Validation failed");
    return false;
  }
  return true;
};

// Create organization
export const createOrganization = async (req: Request, res: Response) => {
  const session = await UserOrganizationMappingModel.startSession();
  session.startTransaction();
  try {
    const dto = plainToClass(CreateOrganizationDTO, req.body);
    if (!(await handleValidation(dto, res))) {
      await session.abortTransaction();
      session.endSession();
      return;
    }
    const organization = await service.createOrganization(dto);

    // Get userId from req.body or req.user (adjust as per your auth)
    const userId = (req as any).userId;
    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, null, "userId is required in request body");
    }

    // Set all previous mappings for this user to selected: false
    await UserOrganizationMappingModel.updateMany(
      { userId },
      { $set: { selected: false } },
      { session }
    );

    // Create new mapping with selected: true
    await UserOrganizationMappingModel.create(
      [
        {
          userId,
          organizationId: organization.organizationId,
          selected: true
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    successResponse(res, organization, "Organization created successfully");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    errorResponse(res, err, "Failed to create organization");
  }
};

// Get organization by ID
export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await service.getOrganizationById(id);
    if (!organization) {
      return noContentResponse(res, null, "Organization not found");
    }
    successResponse(res, organization, "Organization retrieved successfully");
  } catch (err) {
    errorResponse(res, err, "Failed to get organization");
  }
};

// Update organization
export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dto = plainToClass(UpdateOrganizationDTO, req.body);
    if (!(await handleValidation(dto, res))) return;
    const organization = await service.updateOrganization(id, dto);
    if (!organization) {
      return noContentResponse(res, null, "Organization not found");
    }
    successResponse(res, organization, "Organization updated successfully");
  } catch (err) {
    errorResponse(res, err, "Failed to update organization");
  }
};

// Delete organization
export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await service.deleteOrganization(id);
    if (!organization) {
      return noContentResponse(res, null, "Organization not found");
    }
    successResponse(res, null, "Organization deleted successfully");
  } catch (err) {
    errorResponse(res, err, "Failed to delete organization");
  }
};

// Regenerate API key
export const regenerateApiKey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await service.regenerateApiKey(id);
    if (!organization) {
      return noContentResponse(res, null, "Organization not found");
    }
    successResponse(res, { organizationApiKey: organization.organizationApiKey }, "API key regenerated successfully");
  } catch (err) {
    errorResponse(res, err, "Failed to regenerate API key");
  }
};

// Get public organizations
export const getPublicOrganizations = async (_req: Request, res: Response) => {
  try {
    const organizations = await service.getPublicOrganizations();
    if (!organizations.length) {
      return noContentResponse(res, [], "No public organizations found");
    }
    successResponse(res, organizations, "Public organizations retrieved successfully");
  } catch (err) {
    errorResponse(res, err, "Failed to get public organizations");
  }
};

// Get organizations for a specific user
export const getOrganizationsByUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return errorResponse(res, null, "userId is required in request body");
    }

    // Aggregate to join mappings with organizations and include 'selected'
    const organizations = await UserOrganizationMappingModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'organizations',
          localField: 'organizationId',
          foreignField: 'organizationId',
          as: 'organization'
        }
      },
      { $unwind: '$organization' },
      {
        $addFields: {
          'organization.selected': '$selected'
        }
      },
      { $replaceRoot: { newRoot: '$organization' } }
    ]);

    if (!organizations.length) {
      return noContentResponse(res, [], "No organizations found for this user");
    }
    return successResponseArr(res, organizations, {}, "Organizations fetched successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, err, "Failed to fetch organizations for user");
  }
};

// Update selected organization
export const updateSelectedOrganization = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const { organizationId } = req.body;
    if (!userId || !organizationId) {
      return errorResponse(res, null, 'userId and organizationId are required');
    }
    // Set all mappings for this user to selected: false
    await UserOrganizationMappingModel.updateMany(
      { userId },
      { $set: { selected: false } }
    );
    // Set selected: true for the specified mapping
    const result = await UserOrganizationMappingModel.findOneAndUpdate(
      { userId, organizationId },
      { $set: { selected: true } },
      { new: true }
    );
    if (!result) {
      return errorResponse(res, null, 'Mapping not found');
    }
    return successResponse(res, result, 'Selected organization updated successfully');
  } catch (err) {
    return errorResponse(res, err, 'Failed to update selected organization');
  }
};
