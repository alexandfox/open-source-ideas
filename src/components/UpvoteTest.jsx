import React, { Component } from 'react';
import { upvoteIdea, updateOneIdea } from "../api/apiHandler";

class UpvoteDownvote extends Component {
  constructor(props){
    super(props)
    this.state = {
      loggedUser: props.loggedUser,
			upvotes: props.idea.upvotes,
			downvotes: props.idea.downvotes,
      hasUpvoted: false,
      hasDownvoted: false,
      upvotedUsers: props.idea.upvotedUsers,
      downvotedUsers: props.idea.downvotedUsers,
    }
		console.log("props: ", props)
  }

  componentDidMount(){
    this.setState({
			hasUpvoted: (this.props.loggedUser && this.checkIfAlreadyUpvoted(this.props.loggedUser._id, this.props.idea)),
			hasDownvoted: (this.props.loggedUser && this.checkIfAlreadyDownvoted(this.props.loggedUser._id, this.props.idea))
		});
  }  

  checkIfAlreadyUpvoted = (userId, idea) => {
    var upvotedUsers = idea.upvotedUsers
    if (!upvotedUsers) return false
    return upvotedUsers.includes(userId)
  }

  checkIfAlreadyDownvoted = (userId, idea) => {
    var downvotedUsers = idea.downvotedUsers
    if (!downvotedUsers) return false
    return downvotedUsers.includes(userId)
  }

  upvoteOne = () => {
    upvoteIdea(this.props.idea._id, this.state)
  } 

	downvoteOne = () => {
    updateOneIdea(this.props.idea._id, this.state)
  } 

  handleUpvote = () => {
    if(!this.state.hasUpvoted && !this.state.hasDownvoted) {
			this.setState({ 
        upvotes: this.state.upvotes + 1, 
        upvotedUsers: [...this.state.upvotedUsers, this.state.loggedUser._id], 
				hasUpvoted: true,
    	}, this.upvoteOne);
    } else if (this.state.hasUpvoted && !this.state.hasDownvoted){
      this.setState({ 
        upvotes: this.state.upvotes - 1, 
        upvotedUsers: this.state.upvotedUsers.filter(id => id !== this.state.loggedUser._id), 
				hasUpvoted: false,
      }, this.upvoteOne);
    } else if (!this.state.hasUpvoted && this.state.hasDownvoted){
      this.setState({ 
        upvotes: this.state.upvotes + 1, 
        downvotes: this.state.downvotes - 1, 
        upvotedUsers: [...this.state.upvotedUsers, this.state.loggedUser._id], 
				downvotedUsers: this.state.downvotedUsers.filter(id => id !== this.state.loggedUser._id),
				hasUpvoted: false,
    }, this.upvoteOne);
    }
  };

  handleDownvote = () => {
    if(!this.state.hasDownvoted && !this.state.hasUpvoted) {
      this.setState({ 
        downvotes: this.state.downvotes + 1, 
        downvotedUsers: [...this.state.downvotedUsers, 
				this.state.loggedUser._id],
				hasDownvoted: true,
    }, this.downvoteOne);
    } else if (this.state.hasDownvoted && !this.state.hasUpvoted) {
      this.setState({ 
        downvotes: this.state.downvotes - 1, 
        downvotedUsers: this.state.downvotedUsers.filter(id => id !== this.state.loggedUser._id),
				hasDownvoted: false
      }, this.downvoteOne);
    } else if (!this.state.hasDownvoted && this.state.hasUpvoted) {
      //
    }
  };

  suggestLogin = () => {
    alert("Oops! that option requires login :)")
  }

  render(){
    return (
      <React.Fragment>
      <p>
        Upvotes:{this.state.upvotes}
        <button onClick={this.state.loggedUser ? this.handleUpvote : this.suggestLogin}>upvote!</button>
      </p>
      <p>
        Downvotes:{this.state.downvotes}
        <button onClick={this.state.loggedUser ? this.handleDownvote : this.suggestLogin}>downvote!</button>
      </p>
    </React.Fragment>
    )
  }
}

export default UpvoteDownvote;

