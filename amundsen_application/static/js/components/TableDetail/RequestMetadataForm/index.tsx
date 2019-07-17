import * as React from 'react';
import './styles.scss';

export class RequestMetadataForm extends React.Component{
  render() {
    return (
      <div className="request-component expanded">
        <form>
          <input type="hidden" name="feedback-type" value="Bug Report"/>
          <div className="form-group">
            <input type="text" name="subject" className="form-control" required={ true } />
          </div>
          <div className="form-group">
            <textarea name="bug-summary" className="form-control" required={ true }
                      rows={3} maxLength={ 2000 }/>
          </div>
          <div className="form-group">
            <textarea name="repro-steps" className="form-control" rows={5} required={ true }
                      maxLength={ 2000 }/>
          </div>
          <button className="btn btn-default submit" type="submit">HEY</button>
        </form>
      </div>
    );
  }
}

export default RequestMetadataForm