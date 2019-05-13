import React, {Component} from "react"
import { updateOneUser } from "../api/apiHandler";

// PROPS
// loggedUser --> user

class editProfile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			
		}
	}

	handleInput = evt => {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  };

	handleSubmit = evt => {
    evt.preventDefault();
		var { contact_name, website, facebook, twitter, linkedIn, bio, location} = this.state
		var updateUser = {
			location,
			bio,
			social : {
				contact_name,
				website,
				facebook,
				twitter,
				linkedIn
			}
		}
		console.log("clicked!")
    updateOneUser(this.props.loggedUser._id, updateUser)
      .then(res => {
				console.log("here's what was updated: ", updateUser)
        console.log("res.data: ", res.data);
      })
      .catch(err => console.error(err.response));
  };

	render() {
		console.log("new state: ", this.state)
		return(
			<div id="edit-profile">
				<img id="upload-profile" src="http://www.bagherra.eu/wp-content/uploads/2016/11/orionthemes-placeholder-image-1.png" alt="profile-picture"/>
				<h3 className="username">@{this.props.loggedUser.name}</h3>

				{/* User Details */}
				<div id="edit-profile-details">
					<label htmlFor="contact_name" className="label">name</label>
					<input id="contact_name" name="contact_name" type="text" className="input" onChange={this.handleInput}/>
					<label htmlFor="location" className="label">Location</label>
					<input id="location" name="location" type="text" className="input" onChange={this.handleInput}/>
					<label htmlFor="Bio" className="label">Bio</label>
					<textarea id="Bio" name="bio" className="input" onChange={this.handleInput} />
				</div>
				
				{/* Social */}
				<div id="edit-social-details">
					<label htmlFor="website" className="label">Website</label>
					<input id="website" name="website" type="text" className="input" onChange={this.handleInput}/>
					<label htmlFor="facebook" className="label">facebook</label>
					<input id="facebook" name="facebook" type="text" className="input" onChange={this.handleInput}/>
					<label htmlFor="twitter" className="label">twitter</label>
					<input id="twitter" name="twitter" type="textarea" className="input" onChange={this.handleInput}/>
					<label htmlFor="linkedin" className="label">linkedin</label>
					<input id="linkedin" name="linkedin" type="textarea" className="input" onChange={this.handleInput}/>
				</div>

				<button className="button save" onClick={this.handleSubmit}>Save</button>
			</div>
		)
	}
}

export default editProfile