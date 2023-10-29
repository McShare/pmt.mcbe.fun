import React, { Component } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
export default class Home extends Component {
  render = () => (
    <>
      <Head>
        <meta name="description" content="在线转换PocketMine-MP插件" />
      </Head>
      <Layout title={null} showNav={true}>
        <h1>欢迎来到 PocketMine 工具箱！</h1>
        <p>
          在线转换 PocketMine-MP 插件
        </p>
      </Layout>
    </>
  );
}
