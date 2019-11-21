import * as React from 'react';
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';
// import { Graph } from 'components/common/flytegraph';
import DagreGraph from 'components/common/DagreGraph';
import Select from 'react-select';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

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

type LineageButtonProps = ComponentProps; // StateFromProps & DispatchFromProps;

interface LineageButtonState {
  showModal: boolean;
  selectedOption: string;
}

export class LineageButton extends React.Component<LineageButtonProps, LineageButtonState> {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      selectedOption: 'all',
    };
  }

  componentDidMount() {
  }

  handleClose = () => {
   this.setState({ showModal: false });
  };

  handleClick = (e) => {
    // logClick(e);
    this.setState({ showModal: true });
  };


  renderModalBody = () => {
    // @ts-ignore
    const dummyData = {
      nodes: [
        {
          id: 'schema.main_table',
          label: '<div><h4>schema.main_table</h4></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
        {
          id: 'schema.table1',
          label: '<div><h4>schema.table1</h4><div>Written by: Task1</div></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
        {
          id: 'schema.table2',
          label: '<div><h4>schema.table2</h4><div>Written by: Task2</div></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
        {
          id: 'schema.table3',
          label: '<div><h4>schema.table3</h4></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
        {
          id: 'schema.table4',
          label: '<div><h4>schema.table4</h4><div>Written by: Task3</div></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
        {
          id: 'schema.table5',
          label: '<div><h4>schema.table5</h4></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
        {
          id: 'schema.table6',
          label: '<div><h4>schema.table6</h4></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
        {
          id: 'schema.table7',
          label: '<div><h4>schema.table7</h4></div>',
          labelType: 'html',
          class: 'lineage-nodes',
        },
      ],
      links: [
        { source: 'schema.main_table', target: 'schema.table1', label: '' },
        { source: 'schema.main_table', target: 'schema.table2', label: '' },
        { source: 'schema.main_table', target: 'schema.table3', label: '' },
        { source: 'schema.main_table', target: 'schema.table4', label: '' },
        { source: 'schema.main_table', target: 'schema.table5', label: '' },
        { source: 'schema.main_table', target: 'schema.table6', label: '' },
        { source: 'schema.main_table', target: 'schema.table7', label: '' },
      ]
    };

    return (
      /*<Graph
        data={customNodeData}
      />*/
      // @ts-ignore
      <DagreGraph
        className='lineage-graph'
        nodes={dummyData.nodes}
        links={dummyData.links}
        rankdir='LR'
        width='900'
        height='600'
        animate={250}
        fitBoundaries={true}
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

  handleSelectChange = (data) => {
    this.setState({ selectedOption: data.value })
  }

  render() {
    const selectOptions = [
      { value: 'all', label: 'All' },
      { value: 'managed', label: 'Managed Schemas' },
      { value: 'popular', label: 'Popular' },
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
                className="btn btn-default"
                onClick={ () => { console.log('click')} }
              >
                Notify Owners
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
                styles={styles}
              />
            </div>
            { this.renderModalBody() }
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default LineageButton;
