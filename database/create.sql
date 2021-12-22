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