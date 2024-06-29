import { IdAndName } from './general.models';

export interface Space extends IdAndName {
  description: string;
  ownerUserId: number;
}

export interface ExtendedSpace extends Space {
  userId: number;
  userEmail: string;
  userName: string;
  userPic: string;
  joined: boolean;
}

export type CreateSpaceRequest = Space;
