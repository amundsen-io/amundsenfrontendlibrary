import axios from 'axios';

import * as React from 'react';
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';
// import { Graph } from 'components/common/flytegraph';
import DagreGraph from 'components/common/DagreGraph';
import Select from 'react-select';

const NODE_LIMIT = 9;
// TODO: Use css-modules instead of 'import'
import './styles.scss';

import NotifyLineageForm from './NotifyLineageForm';

/*export interface StateFromProps {
  previewData: PreviewData;
  status: LoadingStatus;
  tableData: TableMetadata;
}

export interface DispatchFromProps {
  getPreviewData: (queryParams: PreviewQueryParams) => void;
}*/

export interface ComponentProps {
  modalTitle: string;
}

type LineageButtonProps = ComponentProps;

interface LineageButtonState {
  showModal: boolean;
  showForm: boolean;
  managedSchemas: string[];
  notificationDisabled: boolean;
  selectedOption: string;
  lineageJSON: any;
  currentTables: any;
}

export class LineageButton extends React.Component<LineageButtonProps, LineageButtonState> {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showForm: false,
      selectedOption: 'all',
      notificationDisabled: true,
      managedSchemas: [],
      lineageJSON: {
        name: '',
        targetTables: {},
        readPipelines: [],
        writePipelines: [],
      },
      currentTables: {}
    };
  }

  componentDidMount = () => {
    axios.post('/lineage', {
      table_name: this.props.modalTitle,
    }).then((response) => {
      const lineageJSON = response.data;
      lineageJSON.name =
      this.setState({
        lineageJSON: {
          name: this.sanitizeId(lineageJSON.name),
          targetTables: lineageJSON.targetTables || {},
          writePipelines: lineageJSON.writePipelines || [],
          readPipelines: lineageJSON.readPipelines || [],
        },
        currentTables: lineageJSON.targetTables
      });
    });

    axios.get('/managedSchemas').then((response) => {
      this.setState({ managedSchemas: response.data });
    });
  }

  sanitizeId = (id) => {
    return id.replace("warehouse.", "");
  }

  handleClose = () => {
   this.setState({ showModal: false, showForm: false, selectedOption: 'all', notificationDisabled: true, currentTables: this.state.lineageJSON.targetTables });
  };

  handleClick = (e) => {
    this.setState({ showModal: true });
  };

  generateParentNodeLabel = (parentNodeId) => {
    let parentNodeLabel = `<div><h4>${parentNodeId}</h4>`;
    this.state.lineageJSON.writePipelines.forEach((task) => {
      parentNodeLabel += `<div>Written by: ${task}</div>`;
    });
    parentNodeLabel += `</div>`;
    return parentNodeLabel;
  }

  generateChildNodeLabel = (id) => {
    const pieces = id.split('.');
    let childNodeLabel = `<div><h4>${pieces[1]}.${pieces[2]}</h4>`;
    const task = `${pieces[1]}/${pieces[2]}.config`;
    if (this.state.lineageJSON.readPipelines.indexOf(task) > -1) {
      childNodeLabel += `<div>Written by: ${task}</div>`;
    }
    childNodeLabel += `</div>`;
    return childNodeLabel;
  }

  appendChildNodes = (nodes) => {
    const children = Object.keys(this.state.currentTables);

    for (var i = 0; i < Math.min(children.length, NODE_LIMIT); i++) {
      const tableId = children[i];
      if (tableId != this.state.lineageJSON.name) {
        const newNode = {
          id: tableId,
          label: this.generateChildNodeLabel(tableId),
          labelType: 'html',
          class: 'lineage-nodes',
        }
        nodes.push(newNode);
      }
      else {
        i--;
      }
    };
    if (children.length > NODE_LIMIT) {
      const extraNode = {
        id: 'extra',
        label: `<div><h4>+${children.length - NODE_LIMIT} tables...</h4></div>`,
        labelType: 'html',
        class: 'lineage-nodes',
      }
      nodes.push(extraNode);
    }
    return nodes;
  }

  generateLinks = (parentNodeId) => {
    let links = [];
    const children = Object.keys(this.state.currentTables);

    for (var i = 0; i < Math.min(children.length, NODE_LIMIT); i++) {
      const tableId = children[i];
      if (tableId != this.state.lineageJSON.name) {
        const newLink = { source: parentNodeId, target: tableId, label: '' };
        links.push(newLink);
      }
      else {
        i--;
      }
    };
    if (children.length > NODE_LIMIT) {
      links.push({ source: parentNodeId, target: 'extra', label: '' })
    }
    return links;
  }

  renderModalBody = () => {
    const parentNodeId = this.state.lineageJSON.name;
    const nodeData = [
      {
        id: parentNodeId,
        label: this.generateParentNodeLabel(parentNodeId),
        labelType: 'html',
        class: 'lineage-nodes',
      }
    ];

    // @ts-ignore
    const dummyData = {
      nodes: this.appendChildNodes(nodeData),
      links: this.generateLinks(parentNodeId)
    };

    return (
      // @ts-ignore
      <DagreGraph
        className='lineage-graph'
        nodes={dummyData.nodes}
        links={dummyData.links}
        rankdir='LR'
        width='900'
        height='600'
        animate={250}
        fitBoundaries={false}
        zoomable={true}
        onNodeClick={e => console.log(e)}
        onRelationshipClick={e => console.log(e)}
      />
    )
  }

  renderLineageButton() {
    return (
      <button
        className="btn btn-default btn-lg"
        onClick={ this.handleClick }
      >
        View Lineage
      </button>
    );
  }

  managedFilter = (tables) => {
    return Object.keys(tables).filter(table => {
      const schema = table.split('.')[1];
      return this.state.managedSchemas.indexOf(schema) > -1;
    }).reduce((obj, key) => {
      obj[key] = {};
      return obj;
    }, {});
  }

  /*goToTableDetail = (id: string) => {
    this.closeForm();
    if (id !== "extra") {
      const pieces = id.split('.');
      this.props.history.push(`/table_detail/gold/hive/${pieces[1]}/${pieces[2]}`)
    }
  }*/

  handleSelectChange = (data) => {
    const value = data.value;
    const currentTables = value === 'all' ? this.state.lineageJSON.targetTables : this.managedFilter(this.state.lineageJSON.targetTables);
    this.setState({ currentTables,  notificationDisabled: value != 'all_managed' })
  }

  closeForm = () => {
    this.setState({ showForm: false})
  }

  showForm = () => {
    this.setState({ showForm: true })
  }

  render() {
    const selectOptions = [
      { value: 'all', label: 'All' },
      { value: 'all_managed', label: 'Managed Schemas' },
      { value: 'popular', label: 'Popular', disabled: true },
    ];
    const styles = {
      option: (styles, state) => ({
        ...styles,
        // $gray15 then $gray5
        backgroundColor: state.isSelected ? "#D8D8E4" : (state.isFocused ? "#F4F4FA" : ""),
      })
    };
    return (
      <>
        { this.renderLineageButton() }
        <Modal show={ this.state.showModal } onHide={ this.handleClose }>
          <Modal.Header className="text-center" closeButton={ true }>
            <div style={{ display: 'flex' }}>
              <h4 style={{ margin: 'auto auto auto 0' }}>{ this.props.modalTitle }</h4>
              <button
                style={{ marginRight: '24px'}}
                disabled={this.state.notificationDisabled}
                className="btn btn-default"
                onClick={this.showForm}
              >
                Notify DownStream Owners
              </button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Select
                className="basic-single lineage-select"
                classNamePrefix="amundsen"
                defaultValue={selectOptions[0]}
                isClearable={false}
                isSearchable={false}
                onChange={this.handleSelectChange}
                options={selectOptions}
                isOptionDisabled={(option) => option.disabled === true}
                styles={styles}
              />
            </div>
            { this.renderModalBody() }
            {
              this.state.showForm &&
              // @ts-ignore
              <NotifyLineageForm
                onClose={this.closeForm}
              />
            }
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default LineageButton;
