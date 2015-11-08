import React from 'react';
import Relay from 'react-relay';

class Survey extends React.Component {
  render() {
    return (
      <iframe src={this.props.viewer.survey.BSDData.fullURL} />
    )
  }
}

export default Relay.createContainer(Survey, {
  initialVariables: {
    id: null
  },
  prepareVariables: (prev) =>
  {
    return {id: prev.id}
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        survey(id:$id) {
          BSDData {
            fullURL
          }
        }
      }
    `
  }
})