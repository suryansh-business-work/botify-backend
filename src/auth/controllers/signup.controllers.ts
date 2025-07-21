import { validate } from "class-validator";
import { UserModel } from "../auth.models";
import { SignupDTO } from "../auth.validators";
import { errorResponse, successResponse } from "../../utils/response-object";
import { hashPassword } from "../auth.services";
import { OrganizationModel } from "../../organization-api/organization.models";
import { UserOrganizationMappingModel } from "../../user-organization-mapping/user-organization-mapping.model";
import { SubcriptionModel } from "../../chat-api/subscription-api/subscription-usage.model";
import { sanitizeUser } from "../../utils/sanitize-user";

export const signup = async (req: Request, res: any) => {
  const session = await UserModel.startSession();
  session.startTransaction();
  try {
    const dto = Object.assign(new SignupDTO(), req.body);
    const errors = await validate(dto);
    if (errors.length) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, errors, 'Validation failed');
    }

    const { firstName, lastName, email, password, confirmPassword, profileImage, role, organizationName } = dto;
    if (password !== confirmPassword) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, null, 'Passwords do not match');
    }

    const existing = await UserModel.findOne({ email }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, null, 'User already exists');
    }

    // Create user
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      isUserVerified: false,
      profileImage: profileImage || 'https://ik.imagekit.io/esdata1/botify/botify-logo-1_j7vjRlSiwH.png',
      role: role || "general",
    });
    await user.save({ session });

    // Create organization for user using organizationName from req
    const organization = new OrganizationModel({
      organizationName: organizationName,
      organizationEmail: email,
    });
    await organization.save({ session });

    // Map user to organization
    await UserOrganizationMappingModel.updateMany(
      { userId: user.userId },
      { $set: { selected: false } },
      { session }
    );

    // Then create new mapping with selected: true
    await UserOrganizationMappingModel.create(
      [
        {
          userId: user.userId,
          organizationId: organization.organizationId,
          selected: true
        }
      ],
      { session }
    );

    // Create subscription
    const subcriptionModel = new SubcriptionModel({
      userId: user.userId,
      tokenCount: 1000000,
    });
    await subcriptionModel.save({ session });

    await session.commitTransaction();
    session.endSession();
    return successResponse(res, { user: sanitizeUser(user), organization }, 'User registered successfully');
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return errorResponse(res, err, 'Signup failed');
  }
};
