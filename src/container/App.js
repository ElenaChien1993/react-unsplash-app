import React from 'react';
import unsplash from '../api/unsplash';
import SearchBar from '../components/SearchBar';
import ImageList from '../components/ImageList';

class App extends React.Component {
  state = { images: [] };

  onSearchSubmit = async (value) => {
    const respond = await unsplash.get('/search/photos?per_page=30', {
      params: { query: value },
    });

    this.setState({ images: respond.data.results });
  }

  

  render() {
    return (
      <div className="ui container" style={{ marginTop: '10px' }}>
        <SearchBar searchSubmit={ this.onSearchSubmit } />
        <ImageList images={ this.state.images }/>
      </div>
    )
  }
}

export default App;