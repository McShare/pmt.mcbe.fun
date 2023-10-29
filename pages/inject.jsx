import React, { Component } from 'react';
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
export default class Inject extends Component {
  state = {
    files: [],
    apiVersion: '',
    warningModal: false,
    warningRead: false,
    warningThreeWords: false,
    originalPluginYml: {},
    error: null,
    errorLink: null,
    loading: false,
  };
  handleChange = (event) => {
    this.setState({
      files: event.target.files,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      error: null,
      loading: true,
    });
    const { files, apiVersion } = this.state;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const Archive = (await import('phar')).Archive;
        const phar = new Archive();
        phar.loadPharData(new Uint8Array(reader.result));
        const yaml = (await import('js-yaml')).default;
        const originalPluginYml = phar.getFile('plugin.yml');
        if (!originalPluginYml) {
          return this.setState({
            error:
              '注入插件时发生错误。确保插件位于 zip 的根目录中。',
            errorLink: '/support#inject-directory-error'
          });
        }
        const pluginYml = yaml.load(originalPluginYml.getContents());
        this.setState({
          originalPluginYml: pluginYml,
        });
        pluginYml.api = apiVersion;
        phar.removeFile('plugin.yml');
        const File = (await import('phar')).File;
        phar.addFile(new File('plugin.yml', yaml.dump(pluginYml)));
        saveAs(
          new Blob([phar.savePharData()], {
            type: 'application/octet-stream',
          }),
          `${files[0].name
            .split('.')
            .slice(0, -1)
            .join('.')}-${apiVersion}.phar`,
        );
      } catch {
        this.setState({
          error: '注入插件时发生错误。',
          errorLink: '/support#inject-error'
        });
      } finally {
        this.setState({
          warningModal: false,
          warningThreeWords: false,
          warningRead: false,
          loading: false,
        });
      }
    };
    reader.readAsArrayBuffer(files[0]);
  };
  render = () => {
    const {
      files,
      apiVersion,
      warningModal,
      warningThreeWords,
      error,
      errorLink,
      loading,
    } = this.state;
    return (
      <>
        <Head>
          <meta name="description" content="注入新版 API" />
        </Head>
        <Layout title="API 注入器" showNav={true}>
          {error ? <Alert variant="danger">{error} <Link href={errorLink}>更多信息</Link></Alert> : null}
          <Form>
            <Form.Label>插件 (<code>.phar</code> 文件)</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="file"
                accept=".phar"
                onChange={this.handleChange}
              />
            </InputGroup>
            <Form.Group className="mb-3">
              <Form.Label>API 版本</Form.Label>
              <Form.Control
                type="text"
                value={apiVersion}
                onChange={(event) =>
                  this.setState({ apiVersion: event.target.value })
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() =>
                this.setState({
                  warningModal: true
                })
              }
              disabled={files.length < 1 || apiVersion.length < 1}
            >
              注入
            </Button>
          </Form>
          <Modal
            show={warningModal}
            onHide={() => this.setState({ warningModal: false })}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-danger">这很危险</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ol>
                <li>
                  这个工具仅强行修改插件使其支持<code>{apiVersion}</code>版本的API。但它无法解决实际的不兼容问题。
                </li>
                <li>
                  如果加载下载的插件后出现错误，请立即卸载并联系插件开发人员寻求支持。
                </li>
                <li>
                  如果你已确定知悉上述事项，请点击{' '}
                  <em onClick={() => this.setState({ warningThreeWords: true })}>
                    【此处】
                  </em>{' '}
                  进行确认
                </li>
              </ol>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={this.handleSubmit}
                disabled={!warningThreeWords || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-1" />{' '}
                    注入中
                    <span className="dots" />
                  </>
                ) : (
                  '注入'
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </Layout>
      </>
    );
  };
}
