SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for register
-- ----------------------------
DROP TABLE IF EXISTS `register`;
CREATE TABLE `register` (
  `id` varchar(255) CHARACTER SET utf8 NOT NULL,
  `house_id` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '报名楼盘id',
  `is_homeless` tinyint(1) DEFAULT NULL COMMENT '是否是无房家庭',
  `buyers_idnumber` varchar(30) CHARACTER SET utf8 DEFAULT NULL COMMENT '购房人身份证',
  `buyers_name` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '登记购房人',
  `other_buyers_idnumber` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '其他购房人身份证',
  `other_buyers_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '其他购房人',
  `record_number` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '查档编号',
  `serial_number` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '报名序号',
  `rank` int(6) DEFAULT NULL COMMENT '选房序号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
SET FOREIGN_KEY_CHECKS=1;
