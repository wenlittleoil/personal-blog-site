import React from 'react';
import { Spin } from 'antd';
import style from 'styled-components';

const Cont = style.div`
  text-align: center;
  background: inherit;
  padding-top: 200px;
`;

const ModuleLoading = () => {
  return (
    <Cont className="example">
      <Spin tip="加载中..." size="large" />
    </Cont>
  );
}

export default ModuleLoading;
