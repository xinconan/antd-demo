import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import DiyImg from 'diyimg';

import './img.scss';
class ImgList extends Component {
  render() { 
    return ( 
      <div className="x-bg">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="正常显示图片" bordered={false}>
              <DiyImg src="http://file.ituring.com.cn/SmallCover/1808a9c62d5828afd2d8"/>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="使用默认图片" bordered={false}>
              <DiyImg src="http://no.com/noexist" defaultSrc="http://file.ituring.com.cn/SmallCover/1808776dceb935954e20"/>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="使用errorSrc" bordered={false}>
              <DiyImg src="http://no.com/noexist" errorSrc="http://file.ituring.com.cn/SmallCover/0100a7c5ff69a12ad680"/>
            </Card>
          </Col>
        </Row>
      </div>
     );
  }
}
 
export default ImgList;