export type ProfileResponseDTO = {
  id: string;
  username: string;
  email: string;
  role: string;
  referralCode: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}
