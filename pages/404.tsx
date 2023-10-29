import React, { Component } from 'react';
import Layout from '../components/Layout';
export default class Custom404 extends Component {
  render = () => (
    <Layout title={null} showNav={false}>
      <h1>404 - 页面不见了！</h1>
    </Layout>
  );
}
