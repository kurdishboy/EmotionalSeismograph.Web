import {
  CreateEmotionRequest,
  Emotion,
  SpaceEmotion,
} from 'src/models/emotion.models';
import { CreateSpaceRequest, ExtendedSpace } from 'src/models/space.models';
import { api } from 'src/services/api.services';

const baseURL = 'user';

export const userApis = {
  async getAllSpaces() {
    return await api.get<ExtendedSpace[]>(`${baseURL}/getAllSpaces`);
  },

  async createSpace(request: CreateSpaceRequest) {
    return await api.post<CreateSpaceRequest, null>(
      `${baseURL}/createSpace`,
      request
    );
  },

  async joinSpace(spaceId: number) {
    return await api.post<{ spaceId: number }, null>(`${baseURL}/joinSpace`, {
      spaceId: spaceId,
    });
  },

  async createEmotion(request: CreateEmotionRequest) {
    return await api.post<CreateEmotionRequest, null>(
      `${baseURL}/createEmotion`,
      request
    );
  },

  async getUserEmotions(userId: number, startDate: string, endDate: string) {
    return await api.get<Emotion[]>(
      `${baseURL}/getUserEmotions?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
    );
  },

  async getSpaceUsersTopTenEmotions(spaceId: number) {
    return await api.get<SpaceEmotion[]>(
      `${baseURL}/getSpaceUsersTopTenEmotions?spaceId=${spaceId}`
    );
  },
};
