SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for house
-- ----------------------------
DROP TABLE IF EXISTS `house`;
CREATE TABLE `house` (
  `id` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `house_name` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '摇号楼盘',
  `lottery_time` datetime DEFAULT NULL COMMENT '摇号时间',
  `status` tinyint(4) DEFAULT NULL COMMENT '摇号状态，1已摇号，0待摇号',
  `homeless_number` int(11) DEFAULT NULL COMMENT '无房家庭套数',
  `total_people` int(11) DEFAULT NULL COMMENT '申购家庭登记总数',
  `house_number` int(11) DEFAULT NULL COMMENT '可售房源套数',
  `homeless_people` int(11) DEFAULT NULL COMMENT '申购无房家庭总数',
  `reg_sync` tinyint(1) DEFAULT '0' COMMENT '登记报名表是否同步，1是0否',
  `result_sync` tinyint(1) DEFAULT '0' COMMENT '摇号结果是否同步，1是0否',
  `alias` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '楼盘推广名',
  `remark` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
SET FOREIGN_KEY_CHECKS=1;
