// src/utils/enum.ts
// 1. 救护站状态枚举（和后端约定的 value 一致）
export enum ShelterStatus {
  PENDING = 'PENDING', // 待审核
  PASSED = 'PASSED',   // 审核通过
  REJECTED = 'REJECTED'// 审核拒绝
}
// 枚举值转中文（辅助函数）
export const getShelterStatusLabel = (status: ShelterStatus): string => {
  const map = {
    [ShelterStatus.PENDING]: '待审核',
    [ShelterStatus.PASSED]: '审核通过',
    [ShelterStatus.REJECTED]: '审核拒绝'
  };
  return map[status] || '未知状态';
};

// 2. 猫咪状态枚举（示例）
export enum CatStatus {
  AVAILABLE = 'AVAILABLE', // 可领养
  ADOPTED = 'ADOPTED',     // 已领养
  TREATING = 'TREATING'    // 治疗中
}

// 3. 枚举值转中文（辅助函数）
export const getCatStatusLabel = (status: CatStatus): string => {
  const map = {
    [CatStatus.AVAILABLE]: '可领养',
    [CatStatus.ADOPTED]: '已领养',
    [CatStatus.TREATING]: '治疗中'
  };
  return map[status] || '未知状态';
};