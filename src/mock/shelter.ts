import Mock from 'mockjs';

// 列表数据
const shelterListMock = () => {
  return Mock.mock({
    'data|23': [
      {
        'name': '@cname',
        'contactPerson': '@cname',
        'phone': /^1[3-9]\d{9}$/, 
        'email': '@email',
        'location': {
          'lat': '@float(30, 40, 6, 6)',
          'lng': '@float(110, 120, 6, 6)'
        },
        'address': '@county(true)',
        'description': '@cparagraph(1, 3)',
        'licenseNumber': '@string("number", 8)',
        'managerId': '@guid',
        'capacity|100-500': 1,
        'id': () => Mock.Random.string('abcdefghijklmnopqrstuvwxyz0123456789', 5), 
        'createdAt': '@datetime',
        'updatedAt': '@datetime',
        'distance|0-1000': 1,
        'currentCatNumber|0-100': 1
      }
    ],
  });
};

// 详情数据
const shelterDetailMock = (id: string) => {
  return Mock.mock({
    'name': '@cname',
    'contactPerson': '@cname',
    'phone': /^1[3-9]\d{9}$/, 
    'email': '@email',
    'location': {
      'lat': '@float(30, 40, 6, 6)',
      'lng': '@float(110, 120, 6, 6)'
    },
    'address': '@county(true)',
    'description': '@cparagraph(1, 3)',
    'licenseNumber': '@string("number", 8)',
    'managerId': '@guid',
    'capacity|100-500': 1,
    'id': id,
    'createdAt': '@datetime',
    'updatedAt': '@datetime',
    'distance|0-1000': 1,
    'currentCatNumber|0-100': 1
  });
};

export const getShelterList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shelterListMock()); // 返回完整数据
    }, 500);
  });
};

export const getShelterDetail = (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id || typeof id !== 'string') {
        reject({ code: 400, message: 'Invalid ID' });
        return;
      }
      resolve(shelterDetailMock(id));
    }, 500);
  });
};