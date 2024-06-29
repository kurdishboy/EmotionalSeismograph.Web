import { Emotion } from './emotion.models';
import { IdAndName } from './general.models';

export enum AccessLevelEnum {
  Admin = 2,
  User = 3,
}

export interface User extends IdAndName {
  googleId: string;
  email: string;
  profilePictureUrl: string;
}

export interface AuthenticatedUserResponse extends User {
  refreshToken: string;
  latestEmotion?: Emotion;
}
