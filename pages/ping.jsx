import React, { Component } from 'react';
import { Alert, Button, Col, Form, Row, Table } from 'react-bootstrap';
import Layout from '../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
export default class CrashdumpParser extends Component {
  state = {
    pingError: null,
    pingErrorLink: null,
    host: null,
    port: null,
    loading: false,
    data: null
  };
  handleHostChange = (event) => {
    this.setState({
      host: event.currentTarget.value,
    });
  };
  handlePortChange = (event) => {
    this.setState({
      port: event.currentTarget.value,
    });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      pingError: null,
      pingErrorLink: null,
      data: null,
    });
    const { host, port } = this.state;
    const response = await fetch(`/api/ping/?host=${host}&port=${port}`);
    const json = await response.json();
    if (response.status === 200){
      this.setState({
        data: json,
        loading: false
      });
    } else if (response.status === 400) {
      if (json.code === 'DNS_LOOKUP_FAILED') {
        this.setState({
          pingError: 'Sorry, an error occurred pinging your server. Ensure you have the correct hostname.',
          pingErrorLink: '/support#ping-error-host',
          loading: false
        });
      } else {
        this.setState({
          pingError: 'Sorry, an error occurred pinging your server.',
          pingErrorLink: '/support#ping-error',
          loading: false
        });
      }
    } else {
      this.setState({
        pingError: 'Sorry, an error occurred pinging your server.',
        pingErrorLink: '/support#ping-error',
        loading: false
      });
    }
  };
  render() {
    const {
      pingError,
      pingErrorLink,
      host,
      port,
      loading,
      data
    } = this.state;
    return (
      <>
        <Head>
          <meta name="description" content="Ping Minecraft 服务器" />
        </Head>
        <Layout title="Ping 服务器" showNav={true}>
          {pingError ? <Alert variant="danger">{pingError} <Link href={pingErrorLink}>更多信息</Link></Alert> : null}
          <Form onSubmit={this.handleSubmit}>
            <Row className="mb-3 align-items-center mt">
              <Col xs="auto">
                <Form.Label>主机</Form.Label>
                <Form.Control type="text" placeholder="play.lbsg.net" onChange={this.handleHostChange} />
              </Col>
              <Col xs="auto">
                <Form.Label className="mt-3 mt-md-0">端口</Form.Label>
                <Form.Control type="number" placeholder="19132" onChange={this.handlePortChange} />
              </Col>
            </Row>
            <Button
              variant="primary"
              type="submit"
              disabled={!host || !port || loading}
              className="mb-3"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-1" />{' '}
                  Pinging
                  <span className="dots" />
                </>
              ) : (
                'Ping'
              )}
            </Button>
          </Form>
          {data ? (
            <Table responsive>
              <tbody>
              <tr>
                <td>MOTD</td>
                <td>{data.name} <a href={`/motd-generator/?motd=${data.name}`} target="_blank">在MOTD生成器中打开</a></td>
              </tr>
              <tr>
                <td>MCPE 版本</td>
                <td>v{data.mcpeVersion}</td>
              </tr>
              <tr>
                <td>当前玩家</td>
                <td>{data.currentPlayers}</td>
              </tr>
              <tr>
                <td>玩家上限</td>
                <td>{data.maxPlayers}</td>
              </tr>
              </tbody>
            </Table>
          ) : null}
        </Layout>
      </>
    );
  }
}
