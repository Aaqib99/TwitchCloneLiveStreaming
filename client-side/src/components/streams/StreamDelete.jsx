import React, { useEffect } from 'react';
import Modal from "../Modal"
import history from '../../history';
import { connect } from 'react-redux';
import { fetchStream, deleteStream } from '../../actions';
import "../../App.css"
import { Link } from 'react-router-dom';


class StreamDelete extends React.Component {
  componentDidMount() {
    this.props.fetchStream(this.props.match.params.id)
  }

  renderActions() {
    const { id } = this.props.match.params;
    return (
      <React.Fragment>
        <button onClick={() => this.props.deleteStream(id)} className='ui button negative'>Delete</button>
        <Link to="/" className='ui button'>Cancel</Link>
      </React.Fragment>
    )
  }
  renderContent() {
    if (!this.props.stream) {
      return (
        <div className="delete-container">
          <p className="delete-warning">Are you sure you want to delete this stream?</p>
        </div>
      );
    }

    return (
      <div className="delete-container">
        <p className="delete-warning">
          Are you sure you want to delete the following stream?
        </p>
        <div>
          <p className="title">
            Title: <span className="text">{this.props.stream.title}</span>
          </p>
          <p className="title">
            Description: <span className="text">{this.props.stream.description}</span>
          </p>
        </div>

      </div>
    );
  }


  render() {
    return (
      <Modal
        title="Delete Stream"
        content={this.renderContent()}
        actions={this.renderActions()}
        onDismiss={() => { history.push("/") }}
      />
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  return { stream: state.streams[ownprops.match.params.id] }
}

export default connect(mapStateToProps, { fetchStream, deleteStream })(StreamDelete);
