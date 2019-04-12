import React, { Component } from 'react';
import "./trucksStyle.sass"

class TrucksList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			isLoading: false,
			error: null,
			showAddForm: false,
			showChangeForm: false,
			name: "",
			price: ""
		};

	this.deleteItem = this.deleteItem.bind(this);
	this.editItem = this.editItem.bind(this);
	this.updateItem = this.updateItem.bind(this);
	this.viewForm = this.viewForm.bind(this);
	this.reRender = this.reRender.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		fetch("https://test.chillicode.ru/trucks")
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					isLoaded: true,
					list: result
				});
			},
			(error) => {
				this.setState({
					isLoaded: true,
					error
				});
			}
		)
	};

	// Удаление грузовика из списка
	deleteItem(e) {
		e.preventDefault();

		const status = response => {
			if (response.status !== 200) {
				return Promise.reject(new Error(response.statusText))
			}
			setTimeout(this.reRender, 300)
			return Promise.resolve(response.status)
		}

		fetch(`https://test.chillicode.ru/truck/${e.target.id}`,
		{
			method: "DELETE"
		})
		.then(status)
		.then(data => {
			console.log('data', data);
		})
		.catch(error => {
			console.log('error', error);
		})
	};

	// Изменение имени и прайса в соответствии с введёнными данными, для дальнейшей отправки
	handleChange(e) {
		if (e.target.name === "TruckName") {
			this.setState({name: e.target.value});
		} else {
			this.setState({price: e.target.value});
		}
	}

	// Добавление грузовика
	handleSubmit(e) {
		e.preventDefault();

		const status = response => {
			if (response.status !== 200) {
				return Promise.reject(new Error(response.statusText))
			} else if (this.state.name.trim() === "" || this.state.price.trim() === "") {
				return alert("Wrong data!")
			}
			fetch("https://test.chillicode.ru/truck/add",
			{
				method: "POST",
				body:JSON.stringify({
					"nameTruck": this.state.name,
					"price": this.state.price
				})
			})
			setTimeout(this.reRender, 300)
			return Promise.resolve(response.status)
		}

		fetch("https://test.chillicode.ru/truck/add")
		.then(status)
		.then(data => {
			console.log('data', data);
		})
		.catch(error => {
			console.log('error', error);
		})

		document.getElementById("changeForm").style.display = "none";
		document.getElementById("addForm").style.display = "none";

		this.setState({
			showAddForm: false,
			showChangeForm: false
		})
	}

	// Вставка текущего прайса в форму при изменении данных
	editItem(e) {
		this.id = e.target.id

		this.viewForm("someone", "change")

		const listPrices = document.getElementsByClassName("price")
		this.setState({name: e.target.innerHTML});

		for (var i=0; i < listPrices.length; i++) {
			if (listPrices[i].id === e.target.id) {
				this.setState({price: listPrices[i].innerHTML});
				console.log(listPrices[i])
			}
		}
	}

	// Отправка новых данных о грузовике
	updateItem(e) {
		e.preventDefault();

		const status = response => {
			if (response.status !== 200) {
				return Promise.reject(new Error(response.statusText))
			} else if (this.state.name.trim() === "" || this.state.price.trim() === "") {
				return alert("Wrong data!")
			}
			fetch(`https://test.chillicode.ru/truck/${this.id}`,
			{
				method: "PATCH",
				body:JSON.stringify({
					"nameTruck": this.state.name,
					"price": this.state.price
				})
			})
			setTimeout(this.reRender, 300)
			document.getElementById("changeForm").style.display = "none";
			document.getElementById("addForm").style.display = "none";

			this.setState({
				showAddForm: false,
				showChangeForm: false
			})
			return Promise.resolve(response.status)
		}

		fetch(`https://test.chillicode.ru/truck/${this.id}`)
		.then(status)
		.then(data => {
			console.log('data', data);
		})
		.catch(error => {
			console.log('error', error);
		})
	};

	// Показ\скрытие форм
	viewForm(e, el) {
		if (el === undefined && this.state.showAddForm) {
			document.getElementById("addForm").style.display = "none";
			this.setState({
				showAddForm: false,
				name: "",
				price: ""
			});
		} else if (el === undefined && !this.state.showAddForm) {
			document.getElementById("changeForm").style.display = "none";
			document.getElementById("addForm").style.display = "flex";
			this.setState({
				showChangeForm: false,
				showAddForm: true,
				name: "",
				price: ""
			});
		} else if (el === "change" && this.showChangeForm) {
			document.getElementById("changeForm").style.display = "none";
			this.setState({
				showChangeForm: false,
				name: "",
				price: ""
			});
		} else if (el === "change" && !this.showChangeForm) {
			document.getElementById("addForm").style.display = "none";
			document.getElementById("changeForm").style.display = "flex";
			this.setState({
				showAddForm: false,
				showChangeForm: true,
				name: "",
				price: ""
			});
		}
	};

	reRender() {
		this.componentDidMount()
		this.render()
	};

	render() {
		const { list, isLoaded, error } = this.state;
		if (error) {
			return alert("Error: " + error.message);
		} else if (!isLoaded) {
			return <div>Loading</div>;
		} else {
			return (
				<React.Fragment>
					<ul>
						{list.map(item => (
							<li key={item.id} className="itemList">
								<div className="nameTruck" >
									<a href="#"
										className="nameTruckItem"
										name="nameTruck"
										id={item.id}
										onClick={this.editItem}>
										{item.nameTruck}
									</a>
								</div>
								<div className="price" id={item.id}>
									{item.price}
								</div>
								<div className="delete">
									<a href="#" className="redBtn" id={item.id} onClick={this.deleteItem}>Delete</a>
								</div>
							</li>
						))}
					</ul>
					<a href="#" id="addTruckBtn" className="greenBtn" onClick={this.viewForm}>Add truck</a>
					<div className="formWrapper">
						<form id="addForm" onSubmit={this.handleSubmit}>
							<h2>New truck data</h2>
							<label>
								<p>Name truck:</p>
								<input type="text" name="TruckName" value={this.state.name} onChange={this.handleChange} />
							</label>
							<label>
								<p>Price:</p>
								<input type="text" name="Price" value={this.state.price} onChange={this.handleChange} />
							</label>

							<input type="submit" value="Enter" />
						</form>
						<form id="changeForm" onSubmit={this.updateItem}>
							<h2>Truck change</h2>
							<label>
								<p>Name truck:</p>
								<input type="text" name="TruckName" value={this.state.name} onChange={this.handleChange} />
							</label>
							<label>
								<p>Price:</p>
								<input type="text" name="Price" value={this.state.price} onChange={this.handleChange} />
							</label>

							<input type="submit" value="Update" />
						</form>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default TrucksList;
