import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Accordion, Alert } from 'react-bootstrap';
import FileStructTable from '../components/FileStructTable';
import Head from 'next/head';
export default class Support extends Component {
  render = () => (
    <>
      <Head>
        <meta name="description" content="获得 PocketMine 工具的支持" />
      </Head>
      <Layout title="Support" showNav={true}>
        <h1>帮助</h1>
        <h2>FAQ</h2>
        <Accordion className="mb-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>为什么我的插件在使用 X 后无法工作？</Accordion.Header>
            <Accordion.Body>
              <strong>创建 <code>.phar</code></strong>
              <br />
              在上传 <code>.zip</code> 文件之前，请确保插件的内容位于根目录或与 <code>.zip</code> 文件同名的目录中。
              <FileStructTable exTitles={false} />
              <strong>解压 <code>.phar</code></strong><br />
              在将转换后的 <code>.zip</code> 文件移至 <code>plugins/</code> 目录之前，记得解压。
              <br />
              <strong>API 注入器</strong><br />
              在以前版本的 PocketMine Tools（v2 及更低版本）中，API 注入器会修改您的插件的代码以使其与较新的 API 版本兼容。从 v3 开始，PocketMine Tools 仅更改 <code>plugin.yml</code> 中的 API 版本。这意味着您必须手动进行 API 适配。
              <br />
              <strong>解码 <code>.pmf</code></strong><br />
              解码 <code>.pmf</code> 仅解码您的 <code>.pmf</code> 插件。 它不会在后台进行任何更改来使您的插件与较新的 PocketMine-MP 版本兼容。
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>I need help with plugin development</Accordion.Header>
            <Accordion.Body>
              <p>Check out these official resources from the PMMP team.</p>
              <ul>
                <li><a href="https://forums.pmmp.io/">Forums</a></li>
                <li><a href="https://discord.com/invite/bmSAZBG">Discord server</a></li>
                <li><a href="https://doc.pmmp.io/en/rtfd/index.html">Documentation</a></li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>How can I report a bug?</Accordion.Header>
            <Accordion.Body>
              You can report a bug at our <a href="https://github.com/pmt-mcpe-fun/website/issues">GitHub repository</a>.
              Please include your browser and device with your bug report.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>How can I make a feature request?</Accordion.Header>
            <Accordion.Body>
              You can request a feature at our <a href="https://github.com/pmt-mcpe-fun/website/issues">GitHub
              repository</a>. Please include a full description of the feature you are requesting.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <h2>Troubleshooting errors</h2>
        <Alert variant="info"><strong>Note: </strong>Before troubleshooting, please check your internet connection.
          PocketMine Tools requires an internet connection to work.</Alert>
        <h3 id="decode-crashdump-error">Sorry, an error occurred decoding your crashdump.</h3>
        <p>
          This error occurs when the crashdump body is invalid or doesn&apos;t exist.
          <ul>
            <li>Check that your crashdump was pasted in full. Missing characters can make the crashdump invalid.</li>
            <li>Check that your crashdump was produced by an official version of PocketMine-MP. Spoons/forks are not
              supported.
            </li>
          </ul>
        </p>
        <h3 id="convert-error">An error occurred while converting your plugin.</h3>
        <p>
          This error occurs when your plugin cannot be converted. Often this error is caused by uploading the wrong file
          type.
          <ul>
            <li><strong>Make <code>.phar</code></strong><br />Required file type: <code>.zip</code></li>
            <li><strong>Extract <code>.phar</code></strong><br />Required file type: <code>.phar</code></li>
          </ul>
          <span
            className="text-bg-info">Note that simply changing the file extension will not change the file type.</span>
        </p>
        <h3 id="generate-error">An error occurred while generating your plugin.</h3>
        <p>This error occurs when there is an error generating your plugin. Please file a bug report if you experience
          this error. Make sure to include your browser, device, plugin name and plugin API.</p>
        <h3 id="inject-directory-error">An error occurred while injecting your plugin. Ensure that the plugin is in the
          root directory of the zip.</h3>
        <p>This error occurs when a <code>plugin.yml</code> file is not located in the root directory of the uploaded
          plugin.
          <ul>
            <li>Use the <em>Extract <code>.phar</code></em> tool to extract your plugin to a <code>.zip</code> file.
            </li>
            <li>Unzip the <code>.zip</code> file.</li>
            <li>
              Check that the plugin&apos;s contents are in the root directory of the <code>.zip</code> file or a
              directory with the same name as the <code>.zip</code> file.
              <FileStructTable exTitles />
            </li>
            <li>If your folder structure looks like <strong>Example 3 or 4</strong>, move your files into the root of
              the <code>.zip</code> file. Your file structure should look like <strong>Example 1</strong>.
            </li>
            <li>Use the <em>Create <code>.phar</code></em> tool to convert your plugin back to <code>.phar</code>.</li>
          </ul>
        </p>
        <h3 id="inject-error">An error occurred while injecting your plugin.</h3>
        <p>
          This error occurs when your plugin cannot be injected. Often this error is caused by uploading the wrong file
          type.
          <ul>
            <li><strong>API Injector</strong><br />Required file type: <code>.phar</code></li>
          </ul>
          <span
            className="text-bg-info">Note that simply changing the file extension will not change the file type.</span>
        </p>
        <h3 id="pmf-decode-error">Sorry, there was an error decoding your file.</h3>
        <p>
          This error occurs when there an an error decoding your <code>.pmf</code> plugin. Check that your plugin is
          valid and not corrupted.
        </p>
        <h3 id="pmf-beautify-error">Sorry, there was an error beautifying your code. Try turning off beautify
          output.</h3>
        <p>This error often occurs when the PHP code in the <code>.pmf</code> plugin has an invalid syntax. Try
          uploading a different plugin or turn of beautify output to get the original code.</p>
        <h3 id="pmf-size-error">Sorry, your .pmf plugin is too large. The maximum size is 5 megabytes.</h3>
        <p>This error occurs when you upload a <code>.pmf</code> plugin bigger than 5 megabytes. Please upload a smaller
          plugin.</p>
        <h3 id="pmf-ext-error">Sorry, only .pmf plugins are allowed.</h3>
        <p>This error occurs when you upload a plugin not ending in <code>.pmf</code>. Please ensure your plugin has the
          correct extension and is a <code>.pmf</code> plugin.</p>
        <h3 id="ping-error-host">Sorry, an error occurred pinging your server. Ensure you have the correct
          hostname.</h3>
        <p>This error is shown when your server&apos;s DNS record cannot be found.</p>
        <ol>
          <li>Check that you have an <code>A</code> record pointing to your server&apos;s IP address.</li>
          <li>Check that the hostname and port are entered correctly.</li>
        </ol>
        <h3 id="ping-error">Sorry, an error occurred pinging your server.</h3>
        <p>This error occurs when your server cannot be pinged. Check that the server is online and the hostname and
          port are entered correctly. If you continue to experience errors, file a bug report and make sure to include
          the affected hostname and port.</p>
        <h2>Contact me</h2>
        <p className="text-bg-info">To file a bug report, please see the FAQ section at the top of the page.</p>
        <p>For other inquiries, please email me at <a
          href={`mailto:${process.env.CONTACT_EMAIL}`}>{process.env.CONTACT_EMAIL}</a>. Note that this email is not for
          support with plugin development. Emails of this nature will be ignored.</p>
      </Layout>
    </>
  );
}
