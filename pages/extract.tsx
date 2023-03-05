import React, { Component, type SyntheticEvent } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Layout from '../components/Layout';

type ExtractState = {
  files: FileList | null;
  loading: boolean;
  error: string | null;
};

export default class Extract extends Component<{}, ExtractState> {
  state: ExtractState = {
    files: null,
    loading: false,
    error: null,
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      files: event.currentTarget.files,
    });
  };

  handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    this.setState({
      error: null,
      loading: true,
    });
    const { files } = this.state;
    if (files) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const Archive = (await import('phar')).Archive;
          const phar = new Archive();
          phar.loadPharData(new Uint8Array(reader.result as ArrayBuffer));
          const ZipConverter = (await import('phar')).ZipConverter;
          const data = await ZipConverter.toZip(phar);
          const zip = await data.generateAsync({
            type: 'uint8array',
          });
          saveAs(
            new Blob([zip], {
              type: 'application/zip',
            }),
            `${files[0].name.split('.').slice(0, -1).join('.')}.zip`,
          );
        } catch {
          this.setState({
            error: 'An error occurred while converting your plugin.',
          });
        } finally {
          this.setState({
            loading: false,
          });
        }
      };
      reader.onerror = () => {
        this.setState({
          error: 'An error occurred while converting your plugin.',
          loading: false,
        });
      };
      reader.readAsArrayBuffer(files[0]);
    }
  };

  render = () => {
    const { files, error, loading } = this.state;
    return (
      <Layout title="Extract .phar">
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form onSubmit={this.handleSubmit}>
          <Form.Label>Plugin</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="file"
              accept=".phar"
              onChange={this.handleChange}
            />
          </InputGroup>
          <Button variant="primary" type="submit" disabled={loading || !files}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-1" />{' '}
                Converting
                <span className="dots" />
              </>
            ) : (
              'Extract'
            )}
          </Button>
        </Form>
      </Layout>
    );
  };
}
