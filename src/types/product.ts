export enum ProductStatus {
  ONLINE = 1,
  OFFLINE = 0,
}

export enum ProductType {
  Other = 0,
  Gold = 1,
  Platinum = 2,
  Diamond = 3,
}

export const ProductTypeMap = {
  [ProductType.Other]: "其他",
  [ProductType.Gold]: "金卡套餐",
  [ProductType.Platinum]: "铂金套餐",
  [ProductType.Diamond]: "钻石套餐",
}

export const typeColorMap = {
  [ProductType.Gold]: "#159A00",
  [ProductType.Platinum]: "#AB8014",
  [ProductType.Diamond]: "#1786B6",
  [ProductType.Other]: "#4A3AFF",
}

