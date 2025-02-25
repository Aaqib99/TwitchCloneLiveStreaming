import React from 'react';
import { fetchStreams } from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class StreamList extends React.Component {
  componentDidMount() {
    this.props.fetchStreams();
  }

  renderAdmin(stream) {
    if (!this.props.currentUserId) {
      return null;
    }

    const streamUserId = stream.userId?.userId || stream.userId;
    const currentUserId = this.props.currentUserId?.userId || this.props.currentUserId;

    if (streamUserId && String(streamUserId) === String(currentUserId)) {
      return (
        <div style={{ marginTop: "10px" }} className='right floated content'>
          <Link to={`/streams/edit/${stream.id}`} className="ui button primary">Edit</Link>
          <Link to={`/streams/delete/${stream.id}`} className="ui button negative">Delete</Link>
        </div>
      );
    }

    return null;
  }
  renderCreate() {
    if (this.props.isSignedIn) {
      return (
        <div style={{ textAlign: "right" }}>
          <Link to="/streams/new" className='ui primary button'>Create Stream</Link>
        </div>
      )
    }
  }
  renderList() {
    return this.props.streams.map((stream) => {
      return (
        <div className="item" key={stream.id}>
          <i className="icon camera large middle aligned" />
          <Link to={`/streams/show/${stream.id}`} className="header">
            <h3>{stream.title}</h3>
            <div className="description">{stream.description}</div>
          </Link>
            {this.renderAdmin(stream)}

        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <h2>Streams</h2>
        <div className="ui celled list">{this.renderList()}</div>
        {this.renderCreate()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  streams: Object.values(state.streams),
  currentUserId: state.auth.userId,
  isSignedIn: state.auth.isSignedIn
});

export default connect(mapStateToProps, { fetchStreams })(StreamList);
