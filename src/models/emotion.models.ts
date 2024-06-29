export interface Emotion {
  id: number;
  userId: number;
  emotion: string;
  status: string;
  regdate: string;
}

export interface SpaceEmotion {
  userId: number;
  userName: string;
  userPic: string;
  emotions: Emotion[];
}

export interface ExtendedSpaceEmotion extends SpaceEmotion {
  showHistory?: boolean;
}

export type CreateEmotionRequest = Emotion;
