import { AppMessageUserTypes } from '../enums';

export interface UserPayload {
  userId: string;
  email: string;
  userType: AppMessageUserTypes;
  firstName: string;
  lastName: string;
  workspaceId: string;
  userImage: string;
  permissions: any[];
}
