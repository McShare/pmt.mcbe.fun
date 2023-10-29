import React, { Component, SyntheticEvent } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import Layout from '../components/Layout';
import { dump } from 'js-yaml';
import { correctNamespacePart } from '../lib/utils';
import { saveAs } from 'file-saver';
import Link from 'next/link';
import Head from 'next/head';
type GenerateState = {
  name: string | null;
  api: string | null;
  nameError: boolean;
  loading: boolean;
  error: string | null;
  errorLink: string | null;
};
export default class Generate extends Component {
  state: GenerateState = {
    name: null,
    api: null,
    nameError: false,
    error: null,
    errorLink: null,
    loading: false,
  };
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.value;
    if (/[^A-Za-z0-9_-]/.test(inputName)) {
      this.setState({
        nameError: true,
      });
    } else {
      this.setState({
        nameError: false,
      });
    }
    this.setState({
      name: event.currentTarget.value,
    });
  };
  handleAPIChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      api: event.currentTarget.value,
    });
  };
  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    this.setState({
      error: null,
      loading: true,
    });
    try {
      const { name, api } = this.state;
      const JSZip = (await import('jszip')).default;
      const plugin = new JSZip();
      const correctedName = correctNamespacePart(name!);
      const namespacePath = 'src/';
      plugin.folder(namespacePath);
      const manifest = dump({
        name,
        version: '0.0.1',
        main: correctedName + '\\Main',
        api,
        'src-namespace-prefix': correctedName,
      });
      plugin.file('plugin.yml', manifest);
      plugin.file(
        namespacePath + 'Main.php',
        `<?php

declare(strict_types=1);

namespace ${correctedName};

use pocketmine\\plugin\\PluginBase;

class Main extends PluginBase{

}`,
      );
      const zip = await plugin.generateAsync({
        type: 'uint8array',
      });
      saveAs(
        new Blob([zip], {
          type: 'application/zip',
        }),
        `${name}.zip`,
      );
    } catch {
      this.setState({
        error: '生成插件时发生错误。',
        errorLink: '/support#generate-error'
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  render = () => {
    const { name, api, nameError, error, errorLink, loading } = this.state;
    return (
      <>
        <Head>
          <meta name="description" content="生成框架插件" />
        </Head>
        <Layout title="Generate plugin" showNav={true}>
          {error ? <Alert variant="danger">{error} <Link href={errorLink!}>更多信息</Link></Alert> : null}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>插件名</Form.Label>
              <Form.Control
                type="text"
                onChange={this.handleNameChange}
                isInvalid={nameError}
              />
              <Form.Control.Feedback type="invalid">
                只允许使用字母、数字、下划线和破折号。
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>插件API版本</Form.Label>
              <Form.Control
                type="text"
                onChange={this.handleAPIChange}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!name || !api || nameError || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-1" />{' '}
                  生成中
                  <span className="dots" />
                </>
              ) : (
                '生成'
              )}
            </Button>
          </Form>
        </Layout>
      </>
    );
  };
}
