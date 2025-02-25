import React from 'react'
import { connect } from 'react-redux'
import { fetchStream, deleteStream } from '../../actions';
import flv from 'flv.js';


class SteamShow extends React.Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef();
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchStream(id);
    this.buildPlayer();
  }
  componentDidUpdate(){
    this.buildPlayer();
  }
  componentWillUnmount() {
      this.props.destroy();
  }
  buildPlayer() {
    if (this.player || !this.props.stream || !this.videoRef.current) { return }
  
    const { id } = this.props.match.params;
    this.player = flv.createPlayer({
      type: 'flv',
      url: `http://localhost:8000/live/${id}.flv` // Make sure this URL matches OBS stream key
    });
  
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
    this.player.play(); // Auto-play
  }
  
  render() {
    if (!this.props.stream) {
      return <div>Loading...</div>
    }
    const { id, title, description } = this.props.stream;
    return (
      <div>
        <div>SteamShow</div>
        <video ref={this.videoRef} style={{ width: "100%" }} controls />
        <div className="item" key={id}>
          <i className="icon camera large middle aligned" />
          <div className="content">
            <h3>{title}</h3>
            <div className="description">{description}</div>
          </div>

        </div>
      </div>

    )
  }
}


const mapStateToProps = (state, ownprops) => {
  const streamId = ownprops.match.params.id
  return { stream: state.streams[streamId] }
};

export default connect(mapStateToProps, { fetchStream })(SteamShow)