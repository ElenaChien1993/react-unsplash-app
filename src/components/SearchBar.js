import React from 'react';

class SearchBar extends React.Component {
  state = { value: '' };

  onFormSubmit = e => {
    e.preventDefault();
    this.props.searchSubmit(this.state.value);
  }

  onInputChange = e => {
    this.setState({ value: e.target.value });
  }
  
  render() {
    return (
      <div className="ui segment">
        <form onSubmit={ this.onFormSubmit } className="ui form">
          <div className="field">
            <label>Image Search</label>
            <input 
              type="search" 
              placeholder="type to search"
              value={ this.state.value } 
              onChange={ this.onInputChange } 
            />
          </div>
        </form>
      </div>
    )
  }
}

export default SearchBar;