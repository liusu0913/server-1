DROP DATABASE IF EXISTS `db_test`;

CREATE DATABASE `db_test`;

use db_test;

--
-- Table structure for table `admin_role`
--

CREATE TABLE `admin_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `title` varchar(64) NOT NULL COMMENT '角色称号',
  `disabled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标识',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理端角色';

--
-- Table structure for table `admin_user`
--

CREATE TABLE `admin_user` (
  `id` varchar(64) NOT NULL COMMENT 'Id',
  `password` varchar(64) NOT NULL COMMENT '密码',
  `role_id` int NOT NULL COMMENT '角色ID',
  `email` varchar(255) NOT NULL COMMENT '邮箱地址',
  `phone` varchar(32) NOT NULL COMMENT '手机号码',
  `name` varchar(64) NOT NULL COMMENT '姓名',
  `ext_json` json DEFAULT NULL COMMENT '扩展数据，用以三方登录的数据存储',
  `status` varchar(64) DEFAULT '0' COMMENT '启用状态',
  `disabled` tinyint unsigned DEFAULT '0' COMMENT '删除标识',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `pk_admin_role_id` (`role_id`),
  CONSTRAINT `pk_admin_role_id` FOREIGN KEY (`role_id`) REFERENCES `admin_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理端用户';

CREATE TABLE `t_live` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `live_id` bigint(20) NOT NULL COMMENT '活动id',
  `title` varchar(255) NOT NULL COMMENT '活动标题',
  `url` varchar(255) NOT NULL COMMENT '活动缩略图',
  `type` varchar(255) NOT NULL COMMENT '活动类型',
  `live_state` tinyint(1) NOT NULL COMMENT '直播状态:0未开始，1进行中，2已结束',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `participate_num` bigint(20) NOT NULL COMMENT '参与人数',
  `guest_num` bigint(20) NOT NULL COMMENT '获客数量',
  `belong_company` bigint(20) NOT NULL COMMENT '公司id',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_live_id` (`live_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播表';

CREATE TABLE `t_live_tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `live_id` bigint(20) NOT NULL COMMENT '活动id',
  `tag_id` bigint(20) NOT NULL COMMENT '标签id',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_live_id_tag_id` (`live_id`, `tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动标签关系表';