import React, { Component } from 'react';
import TrucksList from "./components/TrucksList";
import Header from "./components/Header";
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<TrucksList />
			</div>
		);
	}
}

export default App;
