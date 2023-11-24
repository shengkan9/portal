// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Page,
  Row,
  Col,
  Space,
  Button,
  Card,
  Flex,
  Steps,
  FormilyForm,
  FormilyInput,
  FormilySelect,
  FormilyTextArea,
  FormilyFormItem,
  Typography,
  Table,
  Input,
  Status,
  Divider,
} from '@tenx-ui/materials';

import { useLocation, matchPath } from '@umijs/max';
import { DataProvider } from 'shared-components';
import qs from 'query-string';
import { getUnifiedHistory } from '@tenx-ui/utils/es/UnifiedLink/index.prod';

import utils, { RefsManager } from '../../utils/__utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../__constants';

import './index.css';

class Create$$Page extends React.Component {
  get location() {
    return this.props.self?.location;
  }
  get match() {
    return this.props.self?.match;
  }
  get history() {
    return this.props.self?.history;
  }
  get appHelper() {
    return this.props.self?.appHelper;
  }

  _context = this;

  get constants() {
    return __$$constants || {};
  }

  constructor(props, context) {
    super(props);

    this.utils = utils;

    this._refsManager = new RefsManager();

    __$$i18n._inject2(this);

    this.state = {
      currentStep: 0,
      submited: false,
      embedderList: [],
      dataSetDataList: [],
      dataSetFileList: [
        {
          path: '/path/to/file.txt',
        },
      ],
      form: {
        version: '',
        dataSet: '',
        name: '',
      },
      formValue: [],
      dataSet: '',
      version: '',
      selectFiles: [],
      nextFileList: [],
    };
  }

  $ = refName => {
    return this._refsManager.get(refName);
  };

  $$ = refName => {
    return this._refsManager.getAll(refName);
  };

  componentWillUnmount() {
    console.log('will unmount');
  }

  testFunc() {
    console.log('test aliLowcode func');
    return <div className="test-aliLowcode-func">{this.state.test}</div>;
  }

  handleSave(v) {
    console.log(v, 'aaaaaaaaaaaaaaaaaaaa');
  }

  getStatus() {
    return {
      type: 'success',
      id: 'success',
      children: ' ',
    };
  }

  onStepChange(value) {
    this.setState({
      currentStep: value,
    });
  }

  handleStep(event, { action }) {
    // console.log(this.state.currentStep, action)
    if (action === 'next') {
      this.checkFileds();
    } else {
      this.setState({
        currentStep: this.state.currentStep - 1,
      });
    }
  }

  checkFileds() {
    const form = this.$('formily_iwuyzsdvrhg')?.formRef?.current?.form;
    // console.log(form.value)
    form.submit(async values => {
      this.setState({
        currentStep: this.state.currentStep + 1,
        formValue: values,
      });
    });
  }

  handleSubmit() {
    this.setState(
      {
        submited: true,
      },
      () => {
        // form.submit(async values => {
        // console.log(form, this.$('step_form'), values)
        const { embedderList, selectFiles, dataSetFileList, formValue } = this.state;
        const { displayName, dataSetContain, description, embedder } = formValue;
        const { dataSet, version } = dataSetContain;
        const embedderItem = embedderList.find(item => item.value === embedder);
        const fileGroups = [
          {
            source: {
              kind: 'VersionedDataset',
              Name: version,
              Namespace: this.utils.getAuthData().project,
            },
            path: selectFiles,
          },
        ];
        this.utils.bff.createKnowledgeBase({
          input: {
            displayName,
            name: displayName,
            description,
            embedder: embedderItem,
            fileGroups,
            namespace: this.utils.getAuthData().project,
          },
        });
      }
    );
    // })
  }

  async getDataSet() {
    const res = await this.utils.bff.listDatasets({
      input: {
        namespace: this.utils.getAuthData().project, //'abc'
      },

      versionsInput: {
        namespace: this.utils.getAuthData().project, //'abc'
      },

      filesInput: {
        keyword: '',
        pageSize: 1,
        page: 999999,
      },
    });
    const datasetlist = res.Dataset.listDatasets.nodes.map(item => {
      const versions = item.versions.nodes.map(i => ({
        label: i.displayName,
        value: i.name,
        files: i.files.nodes,
      }));
      return {
        label: item.name,
        value: item.name,
        versions: versions,
      };
    });
    this.setState(
      {
        dataSetDataList: datasetlist,
      },
      () => {
        // const values = this.form('createDataHandleStep2')?.values;
        // this.getTableList(values?.pre_data_set_name, values?.pre_data_set_version)
      }
    );
    return {
      datasetlist,
    };
  }

  async getTableList(pre_data_set_name, pre_data_set_version) {
    //'abc'
    const res = await this.utils.bff.getVersionedDataset({
      name: pre_data_set_version,
      namespace: this.utils.getAuthData().project,
    });
    const { getVersionedDataset } = res.VersionedDataset || {};
    const { files } = getVersionedDataset;
    this.setState(
      {
        dataSetFileList: files.nodes || [],
      },
      () => {
        // console.log(files,  this.state)
      }
    );
  }

  onDataSetChange(v) {
    // console.log(form.setValues, 'form.setValues')
    const form = this.$('formily_iwuyzsdvrhg')?.formRef?.current?.form;
    this.setState({
      dataSet: v,
      dataSetFileList: [], // 清空表格
    });

    form.setValues({
      dataSetContain: {
        version: null,
      },
    });
    this.setDataSetAndDataSetVersionsSource(v);
  }

  setDataSetAndDataSetVersionsSource(v) {
    const form = this.$('formily_iwuyzsdvrhg')?.formRef?.current?.form;
    const obj = this.state.dataSetDataList.find(item => item.value === v);
    const genOptionList = obj.versions;
    // form.setFieldState('version', { dataSource: genOptionList })
    form.setFieldState('dataSetContain.version', state => {
      state.dataSource = genOptionList;
    });
  }

  onVersionChange(v) {
    const form = this.$('formily_iwuyzsdvrhg')?.formRef?.current?.form;
    // form.setFieldState('version', { dataSource: [{label: 'v2', value: 'v2'}] })
    this.setState({
      version: v,
    });
    this.getTableList(this.state.dataSet, v);
  }

  async getEmbedder() {
    const project = JSON.parse(localStorage.getItem('authData')).project;
    const params = {
      input: {
        namespace: project,
        page: 1,
        pageSize: 99999,
      },
    };
    const { Embedder } = await this.utils.bff.listEmbedders(params);
    const { nodes } = Embedder?.listEmbedders || {};
    this.setState(
      {
        embedderList: nodes,
      },
      () => {
        //  console.log(nodes, 'data', this.state.embedderList)
      }
    );
    return {
      nodes,
    };
  }

  getCheckBox(rows) {
    const { version } = this.state;
    this.setState({
      selectFiles: rows,
      nextFileList: rows.map(item => {
        return {
          ...this.state.dataSetFileList.find(_item => _item.path === item),
          version,
        };
      }),
    });
  }

  getFileNameFromPath(path) {
    // 使用正则表达式匹配文件名
    const regex = /\/[^/]*$/;
    const filename = path.match(regex)[0].replace(/\//g, '');
    return filename;
  }

  componentDidMount() {
    console.log('did mount', this);
    this.getEmbedder();
    this.getDataSet();
    // this.getTableList()
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <Page>
        <Row wrap={true} __component_name="Row">
          <Col span={24} __component_name="Col">
            <Space align="center" direction="horizontal" __component_name="Space">
              <Button.Back
                name="返回"
                path="/knowledge"
                type="primary"
                title="新增知识库"
                __component_name="Button.Back"
              />
            </Space>
          </Col>
          <Col span={24} __component_name="Col">
            <Card
              size="default"
              type="inner"
              actions={[]}
              loading={false}
              bordered={false}
              hoverable={false}
              __component_name="Card"
            >
              <Flex style={{ marginBottom: '40px' }} justify="center" __component_name="Flex">
                <Steps
                  items={[{ title: '基本信息', subTitle: '' }, { title: '文件预览' }]}
                  style={{ width: '500px' }}
                  current={__$$eval(() => this.state.currentStep)}
                  onChange={function () {
                    return this.onStepChange.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this)}
                  __component_name="Steps"
                />
              </Flex>
              <FormilyForm
                ref={this._refsManager.linkRef('step_form')}
                style={{}}
                formHelper={{ autoFocus: true }}
                componentProps={{
                  colon: false,
                  layout: 'horizontal',
                  labelCol: 2,
                  labelAlign: 'left',
                  wrapperCol: 12,
                }}
                __component_name="FormilyForm"
              >
                {!!__$$eval(() => this.state.currentStep === 0 && !this.state.submited) && (
                  <Row wrap={true} __component_name="Row">
                    <Col span={16} __component_name="Col">
                      <FormilyForm
                        ref={this._refsManager.linkRef('formily_iwuyzsdvrhg')}
                        formHelper={{ autoFocus: true }}
                        componentProps={{
                          colon: false,
                          layout: 'horizontal',
                          labelAlign: 'left',
                          wrapperCol: 12,
                          labelWidth: '130px',
                        }}
                        createFormProps={{
                          values: null,
                          initialValues: __$$eval(() => this.state.form),
                        }}
                        __component_name="FormilyForm"
                      >
                        <FormilyInput
                          fieldProps={{
                            name: 'displayName',
                            title: '知识库名称',
                            required: true,
                            'x-validator': [],
                          }}
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-sy5aawos') /* 请输入知识库名称 */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilyInput"
                        />
                        <FormilySelect
                          fieldProps={{
                            enum: [],
                            name: 'embedder',
                            title: '向量化模型',
                            required: true,
                            'x-validator': [],
                            _unsafe_MixedSetter_enum_select: 'ArraySetter',
                          }}
                          componentProps={{
                            'x-component-props': {
                              disabled: false,
                              allowClear: false,
                              _sdkSwrGetFunc: {
                                func: __$$eval(() => this.getEmbedder),
                                label: 'displayName',
                                value: 'name',
                                resKey: __$$eval(() => ['nodes']),
                              },
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilySelect"
                        />
                        <FormilyTextArea
                          fieldProps={{
                            name: 'description',
                            title: this.i18n('i18n-txt5kh4m') /* 描述 */,
                            'x-component': 'Input.TextArea',
                            'x-validator': [],
                          }}
                          componentProps={{
                            'x-component-props': {
                              placeholder: this.i18n('i18n-o0qitjur') /* 请输入描述 */,
                            },
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilyTextArea"
                        />
                        <FormilyFormItem
                          fieldProps={{
                            name: 'dataSetContain',
                            title: '处理数据集',
                            required: true,
                            'x-component': 'FormilyFormItem',
                            'x-validator': [],
                          }}
                          decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                          __component_name="FormilyFormItem"
                        >
                          <Row wrap={true} __component_name="Row">
                            <Col span={12} __component_name="Col">
                              <FormilySelect
                                fieldProps={{
                                  name: 'dataSet',
                                  title: '',
                                  description: '',
                                  'x-validator': [],
                                }}
                                componentProps={{
                                  'x-component-props': {
                                    disabled: false,
                                    onChange: function () {
                                      return this.onDataSetChange.apply(
                                        this,
                                        Array.prototype.slice.call(arguments).concat([])
                                      );
                                    }.bind(this),
                                    allowClear: false,
                                    placeholder: '请选择数据集',
                                    _sdkSwrGetFunc: {
                                      func: __$$eval(() => this.getDataSet),
                                      label: 'label',
                                      value: 'value',
                                      resKey: __$$eval(() => ['datasetlist']),
                                    },
                                  },
                                }}
                                decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                                __component_name="FormilySelect"
                              />
                            </Col>
                            <Col span={12} __component_name="Col">
                              <FormilySelect
                                fieldProps={{
                                  name: 'version',
                                  title: '',
                                  _unsafe_MixedSetter_enum_select: 'ExpressionSetter',
                                  '_unsafe_MixedSetter_x-validator_select': 'ExpressionSetter',
                                }}
                                componentProps={{
                                  'x-component-props': {
                                    disabled: false,
                                    onChange: function () {
                                      return this.onVersionChange.apply(
                                        this,
                                        Array.prototype.slice.call(arguments).concat([])
                                      );
                                    }.bind(this),
                                    allowClear: false,
                                    showSearch: false,
                                    placeholder: '请选择版本',
                                    _sdkSwrGetFunc: { label: 'label', value: 'value' },
                                    _unsafe_MixedSetter__sdkSwrGetFunc_select: 'ObjectSetter',
                                  },
                                }}
                                decoratorProps={{ 'x-decorator-props': { labelEllipsis: true } }}
                                __component_name="FormilySelect"
                              />
                            </Col>
                          </Row>
                        </FormilyFormItem>
                      </FormilyForm>
                    </Col>
                  </Row>
                )}
              </FormilyForm>
              {!!__$$eval(() => this.state.currentStep === 0 && !this.state.submited) && (
                <Row wrap={false} __component_name="Row">
                  <Col flex="130px" __component_name="Col">
                    <Typography.Text
                      style={{ fontSize: '', marginLeft: '0px', paddingLeft: '10px' }}
                      strong={false}
                      disabled={false}
                      ellipsis={true}
                      __component_name="Typography.Text"
                    >
                      文件选择
                    </Typography.Text>
                  </Col>
                  <Col flex="auto" __component_name="Col">
                    <Table
                      size="middle"
                      rowKey="path"
                      scroll={{ scrollToFirstRowOnChange: true }}
                      columns={[
                        {
                          key: '',
                          title: '名称',
                          dataIndex: 'path',
                          render: (text, record, index) =>
                            (__$$context => (
                              <Typography.Text
                                __component_name="Typography.Text"
                                ellipsis={true}
                                style={{ fontSize: '' }}
                                disabled={false}
                                strong={false}
                              >
                                {__$$eval(() => __$$context.getFileNameFromPath(text))}
                              </Typography.Text>
                            ))(__$$createChildContext(__$$context, { text, record, index })),
                        },
                        { key: '', title: '类型', dataIndex: 'fileType' },
                        { title: '数据量', dataIndex: 'count' },
                        { title: '大小', dataIndex: 'size' },
                      ]}
                      dataSource={__$$eval(() => this.state.dataSetFileList)}
                      pagination={false}
                      showHeader={true}
                      rowSelection={{
                        type: 'checkbox',
                        onChange: function () {
                          return this.getCheckBox.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      }}
                      __component_name="Table"
                    />
                  </Col>
                </Row>
              )}
              {!!__$$eval(() => this.state.currentStep === 1 && !this.state.submited) && (
                <Flex wrap="nowrap" justify="right" vertical={true} __component_name="Flex">
                  <Row
                    wrap={false}
                    style={{ marginBottom: '25px' }}
                    justify="space-between"
                    __component_name="Row"
                  >
                    <Col __component_name="Col">
                      <Typography.Text
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        {__$$eval(() => `共有文件：${this.state.nextFileList.length}`)}
                      </Typography.Text>
                    </Col>
                    <Col __component_name="Col">
                      <Input.Search placeholder="请输入" __component_name="Input.Search" />
                    </Col>
                  </Row>
                  {__$$evalArray(() => this.state.nextFileList).map((item, index) =>
                    (__$$context => (
                      <Row wrap={false} style={{ marginBottom: '8px' }} __component_name="Row">
                        <Col flex="auto" __component_name="Col">
                          <Row
                            wrap={true}
                            align="stretch"
                            style={{
                              height: '44px',
                              background: '#FAFAFA',
                              lineHeight: '44px',
                              borderRadius: '0px 0px 0px 0px',
                            }}
                            __component_name="Row"
                          >
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item.path)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => `文件来源：${item.source || '--'}`)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => `类型：${item.fileTpye || '--'}`)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => `数据量：${item.datacount || '--'}`)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item.fileSize)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Button
                                icon=""
                                block={false}
                                ghost={false}
                                shape="default"
                                danger={false}
                                disabled={false}
                                __component_name="Button"
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))(__$$createChildContext(__$$context, { item, index }))
                  )}
                </Flex>
              )}
              {!!__$$eval(() => this.state.submited) && (
                <Flex wrap="nowrap" justify="right" vertical={true} __component_name="Flex">
                  <Row
                    wrap={false}
                    style={{ marginBottom: '25px' }}
                    justify="space-between"
                    __component_name="Row"
                  >
                    <Col __component_name="Col">
                      <Typography.Text
                        style={{ fontSize: '' }}
                        strong={false}
                        disabled={false}
                        ellipsis={true}
                        __component_name="Typography.Text"
                      >
                        共有文件：113 文件向量化成功：10
                      </Typography.Text>
                    </Col>
                    <Col __component_name="Col">
                      <Input.Search placeholder="请输入" __component_name="Input.Search" />
                    </Col>
                  </Row>
                  {__$$evalArray(() => [
                    {
                      log: '123',
                      icon: 'success',
                      type: 'QA文本',
                      title: 'Kubernetes入门文档.pdf',
                      source: '文件来源：数据集1-v1',
                      fileSize: 1024,
                      datacount: 100,
                    },
                    {
                      log: '123',
                      icon: 'success',
                      type: 'QA文本',
                      title: 'Kubernetes入门文档.pdf',
                      source: '文件来源：数据集1-v1',
                      fileSize: 1024,
                      datacount: 100,
                    },
                    {
                      log: '123',
                      icon: 'success',
                      type: 'QA文本',
                      title: 'Kubernetes入门文档.pdf',
                      source: '文件来源：数据集1-v1',
                      fileSize: 1024,
                      datacount: 100,
                    },
                  ]).map((item, index) =>
                    (__$$context => (
                      <Row wrap={false} style={{ marginBottom: '8px' }} __component_name="Row">
                        <Col
                          flex="20px"
                          style={{ lineHeight: '44px', marginRight: '12px' }}
                          __component_name="Col"
                        >
                          <Status
                            id="disabled"
                            types={[{ id: 'disabled', type: 'disabled', children: '未知' }]}
                            getTypes={function () {
                              return this.getStatus.apply(
                                this,
                                Array.prototype.slice.call(arguments).concat([])
                              );
                            }.bind(__$$context)}
                            __component_name="Status"
                          />
                        </Col>
                        <Col flex="auto" __component_name="Col">
                          <Row
                            wrap={true}
                            align="stretch"
                            style={{
                              height: '44px',
                              background: '#FAFAFA',
                              lineHeight: '44px',
                              borderRadius: '0px 0px 0px 0px',
                            }}
                            __component_name="Row"
                          >
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item.title)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item.source)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item.type)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item.datacount)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Typography.Text
                                style={{ fontSize: '' }}
                                strong={false}
                                disabled={false}
                                ellipsis={true}
                                __component_name="Typography.Text"
                              >
                                {__$$eval(() => item.fileSize)}
                              </Typography.Text>
                            </Col>
                            <Col span={4} __component_name="Col">
                              <Button
                                icon=""
                                block={false}
                                ghost={false}
                                shape="default"
                                danger={false}
                                disabled={false}
                                __component_name="Button"
                              >
                                日志
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))(__$$createChildContext(__$$context, { item, index }))
                  )}
                </Flex>
              )}
              <Divider
                mode="line"
                style={{ left: '-24px', width: 'calc(100% + 48px)', position: 'relative' }}
                dashed={false}
                defaultOpen={false}
                __component_name="Divider"
              />
              <Flex justify="center" __component_name="Flex">
                <Button
                  href="/knowledge"
                  icon=""
                  block={false}
                  ghost={false}
                  shape="default"
                  style={{ marginRight: '10px' }}
                  danger={false}
                  disabled={false}
                  __component_name="Button"
                >
                  {__$$eval(() => `${this.state.submited ? '返回' : '取消'}`)}
                </Button>
                {!!__$$eval(() => this.state.currentStep > 0 && !this.state.submited) && (
                  <Button
                    block={false}
                    ghost={false}
                    shape="default"
                    style={{ marginRight: '10px' }}
                    danger={false}
                    onClick={function () {
                      return this.handleStep.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([
                          {
                            action: 'pre',
                          },
                        ])
                      );
                    }.bind(this)}
                    disabled={false}
                    __component_name="Button"
                  >
                    上一步
                  </Button>
                )}
                {!!__$$eval(() => this.state.currentStep !== 1) && (
                  <Button
                    block={false}
                    ghost={false}
                    shape="default"
                    style={{ marginRight: '10px' }}
                    danger={false}
                    onClick={function () {
                      return this.handleStep.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([
                          {
                            action: 'next',
                          },
                        ])
                      );
                    }.bind(this)}
                    disabled={false}
                    __component_name="Button"
                  >
                    下一步
                  </Button>
                )}
                {!!__$$eval(() => this.state.currentStep === 1 && !this.state.submited) && (
                  <Button
                    icon=""
                    type="primary"
                    block={false}
                    ghost={false}
                    shape="default"
                    danger={false}
                    onClick={function () {
                      return this.handleSubmit.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    disabled={false}
                    __component_name="Button"
                  >
                    确认
                  </Button>
                )}
              </Flex>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

const PageWrapper = (props = {}) => {
  const location = useLocation();
  const history = getUnifiedHistory();
  const match = matchPath({ path: '/create' }, location.pathname);
  history.match = match;
  history.query = qs.parse(location.search);
  const appHelper = {
    utils,
    location,
    match,
    history,
  };
  const self = {
    appHelper,
    ...appHelper,
  };
  return (
    <DataProvider
      self={self}
      sdkInitFunc={{
        enabled: undefined,
        func: 'undefined',
        params: undefined,
      }}
      sdkSwrFuncs={[
        {
          func: 'undefined',
          params: undefined,
          enableLocationSearch: undefined,
        },
      ]}
      render={dataProps => (
        <Create$$Page {...props} {...dataProps} self={self} appHelper={appHelper} />
      )}
    />
  );
};
export default PageWrapper;

function __$$eval(expr) {
  try {
    return expr();
  } catch (error) { }
}

function __$$evalArray(expr) {
  const res = __$$eval(expr);
  return Array.isArray(res) ? res : [];
}

function __$$createChildContext(oldContext, ext) {
  const childContext = {
    ...oldContext,
    ...ext,
  };
  childContext.__proto__ = oldContext;
  return childContext;
}
