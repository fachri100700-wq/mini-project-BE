export type CouponResponseDTO = {
  id: string;
  code: string;
  discount: number;
  expiredDate: Date;
  userId: string;
  isUsed: boolean;
};
