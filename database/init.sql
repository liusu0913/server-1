insert into `admin_role` (`title`) values ('admin');

insert into `admin_user`  (`id`, `password`, `role_id`, `email`, `phone`, `name`) values ('initialAdmin', 'admin888', 1, 'admin@qq.com', 13800138000, 'admin');