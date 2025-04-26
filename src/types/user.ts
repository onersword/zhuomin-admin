export interface CSVUser {
  name: string;
  phoneNumber: string;
  idCard: string;
  forms: Record<string, any>;
}

export enum UserStatus {
  NeedReview = 1,
  Reviewd = 2,
}


export const UserStatusMap = {
  [UserStatus.NeedReview]: "待审核",
  [UserStatus.Reviewd]: "已审核",
}

