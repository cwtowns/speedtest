import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './react-tabs.css';

import logo from './logo.svg';
import './App.css';
import MovieList from './movies/MovieList';
import MovieInput from './movies/AddMovie';

function DefaultReactApp() { 
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const App = () => {  
  return (
      <Tabs>
        <TabList>
          <Tab>Hello React</Tab>
          <Tab>Movie List</Tab>
          <Tab>Add Movie</Tab>
        </TabList>

        <TabPanel>
          <DefaultReactApp />
        </TabPanel>
        <TabPanel>
          <MovieList />
        </TabPanel>
        <TabPanel>
          <MovieInput />
        </TabPanel>
      </Tabs>
  );
}

export default App;
