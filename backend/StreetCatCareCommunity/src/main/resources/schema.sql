CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     openid VARCHAR(128) UNIQUE COMMENT '微信OpenID',
    union_id VARCHAR(128) COMMENT '微信UnionID',
    nickname VARCHAR(100) COMMENT '用户昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    status ENUM('ACTIVE','BANNED') DEFAULT 'ACTIVE',
    last_login_time DATETIME COMMENT '最后登录时间',
    home_location POINT SRID 4326 NOT NULL DEFAULT (ST_GeomFromText('POINT(0 0)',4326)) COMMENT '常驻地-经纬度',
    home_address VARCHAR(200) COMMENT '常驻地-详细地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_openid (openid),
    INDEX idx_role_status (status),
    SPATIAL INDEX idx_home_loc (home_location)
    ) COMMENT '用户信息表';

CREATE TABLE IF NOT EXISTS shelters (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        name VARCHAR(200) NOT NULL COMMENT '救助站名称',
    contact_person VARCHAR(100) COMMENT '联系人',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    location POINT SRID 4326 NOT NULL DEFAULT (ST_GeomFromText('POINT(0 0)',4326)) COMMENT '经纬度',
    address VARCHAR(200) COMMENT '详细地址',
    description TEXT COMMENT '描述',
    license_number VARCHAR(100) COMMENT '许可证号',
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    manager_id BIGINT NOT NULL COMMENT '救助站管理员id',
    capacity INT NOT NULL COMMENT '猫最大容量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    SPATIAL INDEX idx_shelter_location (location),
    INDEX idx_status (status)
    ) COMMENT '救助站信息表';

CREATE TABLE IF NOT EXISTS community_posts (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    post_type ENUM('DISCUSSION','EXPERIENCE','HELP') DEFAULT 'DISCUSSION',
    images TEXT COMMENT '图片列表JSON字符串',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    favorite_count INT DEFAULT 0 COMMENT '收藏数',
    is_top BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    is_elite BOOLEAN DEFAULT FALSE COMMENT '是否精华',
    status ENUM('PUBLISHED', 'PENDING', 'REJECTED') DEFAULT 'PENDING',
    mark VARCHAR(500) COMMENT '审核备注/未通过理由',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_author_type (author_id, post_type),
    INDEX idx_status_created (status, created_at),
    INDEX idx_top_elite (is_top, is_elite),
    FULLTEXT INDEX idx_content_search (title, content),
    FOREIGN KEY (author_id) REFERENCES users(id)
    ) COMMENT '社区帖子表';

CREATE TABLE IF NOT EXISTS stray_cats (
                                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                          name VARCHAR(100) COMMENT '猫咪名称',
    breed VARCHAR(50) COMMENT '品种',
    gender ENUM('MALE','FEMALE') NOT NULL,
    age_months INT COMMENT '年龄（单位：月）',
    health_status ENUM('HEALTHY','SICK','INJURED','CRITICAL') DEFAULT 'HEALTHY',
    description TEXT COMMENT '详细描述',
    photos TEXT COMMENT '照片URL列表',
    is_neutered BOOLEAN DEFAULT FALSE COMMENT '是否绝育',
    vaccination_status ENUM('NONE','PARTIAL','COMPLETE') DEFAULT 'NONE',
    status ENUM('ACTIVE','ADOPTED','DECEASED','REMOVED') DEFAULT 'ACTIVE',
    shelter_id BIGINT NOT NULL COMMENT '归属救助站ID',
    created_by BIGINT COMMENT '录入帖子ID',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    favorite_count INT DEFAULT 0 COMMENT '收藏数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status_created (status, created_at),
    INDEX idx_breed_gender (breed, gender),
    INDEX idx_shelter (shelter_id),
    INDEX idx_created_by (created_by),
    CONSTRAINT fk_cat_shelter FOREIGN KEY (shelter_id) REFERENCES shelters(id),
    CONSTRAINT fk_cat_creator FOREIGN KEY (created_by) REFERENCES community_posts(id)
    ) COMMENT '在档流浪猫基本信息表';

CREATE TABLE IF NOT EXISTS feeding_records (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               cat_id BIGINT NOT NULL COMMENT '猫咪ID',
                                               shelter_id BIGINT NOT NULL COMMENT '救助站ID',
                                               user_id BIGINT NOT NULL COMMENT '投喂用户ID',
                                               feeding_time DATETIME NOT NULL COMMENT '投喂时间',
                                               food_type VARCHAR(100) COMMENT '食物类型',
    food_amount INTEGER null comment '食物分量',
    notes TEXT COMMENT '备注信息',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cat_user_time (cat_id, user_id, feeding_time),
    INDEX idx_user_time (user_id, feeding_time),
    INDEX idx_shelter (shelter_id),
    FOREIGN KEY (cat_id) REFERENCES stray_cats(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
    ) COMMENT '投喂记录表';

CREATE TABLE IF NOT EXISTS adoption_applications (
                                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                     cat_id BIGINT NOT NULL COMMENT '猫咪ID',
                                                     applicant_id BIGINT NOT NULL COMMENT '申请人ID',
                                                     shelter_id BIGINT NOT NULL COMMENT '救助站ID',
                                                     name VARCHAR(255) NOT NULL COMMENT '申请人姓名',
    age INT COMMENT '申请人年龄',
    phone VARCHAR(20) COMMENT '申请人电话',
    address VARCHAR(255) COMMENT '申请人地址',
    experience VARCHAR(255) COMMENT '申请人养猫经验',
    reason VARCHAR(255) COMMENT '申请人领养原因',
    status ENUM('PENDING', 'UNDER_REVIEW', 'INTERVIEW', 'HOME_VISIT', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    review_notes TEXT COMMENT '审核备注',
    reviewer_id BIGINT COMMENT '审核人ID',
    reviewed_at DATETIME COMMENT '审核时间',
    contract_url VARCHAR(500) COMMENT '领养合同URL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cat_status (cat_id, status),
    INDEX idx_applicant_status (applicant_id, status),
    INDEX idx_shelter_status (shelter_id, status),
    FOREIGN KEY (cat_id) REFERENCES stray_cats(id),
    FOREIGN KEY (applicant_id) REFERENCES users(id),
    FOREIGN KEY (shelter_id) REFERENCES shelters(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
    ) COMMENT='领养申请表';

CREATE TABLE IF NOT EXISTS user_favorites (
                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              user_id BIGINT NOT NULL,
                                              target_type ENUM('Cat', 'POST') NOT NULL,
    target_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_unique_favorite (user_id, target_type, target_id),
    INDEX idx_user_target (user_id, target_type),
    FOREIGN KEY (user_id) REFERENCES users(id)
    ) COMMENT '用户收藏关系表';

CREATE TABLE IF NOT EXISTS comments (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        content TEXT NOT NULL,
                                        author_id BIGINT NOT NULL,
                                        target_type ENUM('Cat', 'POST') NOT NULL,
    target_id BIGINT NOT NULL,
    photos TEXT COMMENT '图片列表JSON字符串',
    parent_id BIGINT COMMENT '父评论ID',
    like_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_target (target_type, target_id),
    INDEX idx_author (author_id),
    INDEX idx_parent (parent_id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
    ) COMMENT '评论表';

-- 救助站员工表
CREATE TABLE IF NOT EXISTS shelter_staff (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             shelter_id BIGINT NOT NULL COMMENT '所属救助站ID',
                                             user_id BIGINT NOT NULL COMMENT '关联账号ID',
                                             real_name VARCHAR(100) NOT NULL COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '站内联系方式',
    email VARCHAR(100) COMMENT '站内邮箱',
    hire_status ENUM('ONBOARD','RESIGNED','SUSPENDED') DEFAULT 'ONBOARD' COMMENT '在职状态',
    hired_at DATE COMMENT '入职日期',
    resigned_at DATE COMMENT '离职日期',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_unique_user_shelter (user_id, shelter_id),
    INDEX idx_shelter_status (shelter_id, hire_status),
    INDEX idx_hire_status (hire_status),
    FOREIGN KEY (shelter_id) REFERENCES shelters(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) COMMENT '救助站员工表';

CREATE TABLE IF NOT EXISTS sys_admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20)  NOT NULL COMMENT '登录手机号',
    password CHAR(60)     NOT NULL COMMENT 'bcrypt/argon2 等哈希后的密码',
    role ENUM('SHELTER_MEMBER','SHELTER_MANAGER','SYSTEM_ADMIN') DEFAULT 'SYSTEM_ADMIN',
    real_name VARCHAR(50)  COMMENT '姓名',
    login_fail TINYINT UNSIGNED DEFAULT 0 COMMENT '连续登录失败次数',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_phone (phone)
    ) COMMENT='系统后台管理员账号';
CREATE TABLE IF NOT EXISTS likes (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       user_id BIGINT NOT NULL,
                       target_type VARCHAR(50) NOT NULL, -- 'POST' 或 'CAT'
                       target_id BIGINT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);