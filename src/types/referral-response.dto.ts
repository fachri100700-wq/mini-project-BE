export type ReferralRewardHistoryDTO = {
  id: string;
  points: number;
  reason: string;
  startDate: Date;
  expireDate: Date;
}

export type ReferralInfoResponseDTO = {
  availablePoints: number;
  history: ReferralRewardHistoryDTO[];
}
