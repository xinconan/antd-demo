SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for result
-- ----------------------------
DROP TABLE IF EXISTS `result`;
CREATE TABLE `result` (
  `id` varchar(40) COLLATE utf8mb4_bin NOT NULL,
  `house_id` varchar(40) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '楼盘id',
  `serial_number` varchar(15) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '登记序号',
  `rank` int(6) DEFAULT NULL COMMENT '摇号顺序号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
SET FOREIGN_KEY_CHECKS=1;
