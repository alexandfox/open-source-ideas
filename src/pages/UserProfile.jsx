import React, {Component} from "react"
import IdeaItem from "../components/IdeaListItem"
import { getUserByName, getOneIdea} from "../api/apiHandler";
import EditProfile from "./EditProfile"
import {Redirect} from "react-router-dom";


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      edit: false,
      user_name: this.props.match.params.name,
      user_page: {},
			current_user: this.setLoggedUser(),
      isMyProfile: this.setMyProfile(),
      upvoted_ideas: [],
      myIdeas: [],
      draft_ideas: [],
      public_ideas: [],
    }
  }
  // see if current user (browsing) is the user 
  setLoggedUser() {
    return this.props.loggedUser ? this.props.loggedUser : {}
  }

  setMyProfile() {
    if (this.props.loggedUser) return this.props.loggedUser.name === this.props.match.params.name ? true : false;
    return false
  }

  getUserPage() {
    getUserByName(this.props.match.params.name)
      .then(res => {
        console.log("in getUserPage; res: ", res)
        return res.data;
      })
      .catch(err => {
        console.log(err.response);
      });	
  }

  addIdeaFromId(id, array) {
    getOneIdea(id)
    .then(res => {
      array.push(res.data.idea);
      this.setState({hi: "hi"});
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  editProfile = (e) => {
    e.preventDefault();
    this.setState({
      redirect: true,
      edit: true,
    })
    // return <Redirect to={`/@${this.props.loggedUser.name}/edit`}/>
  }

  async componentDidMount() {
    var user_page = await getUserByName(this.state.user_name)
    user_page = user_page.data
    
    var upvoted_ideas = []
    user_page.upvotedIdeas.forEach( id => {
      this.addIdeaFromId(id, upvoted_ideas)
    })
    
    var myIdeas = user_page.myIdeas

    this.setState({
      user_page,
      upvoted_ideas : upvoted_ideas,
      myIdeas : myIdeas,
      draft_ideas : myIdeas.filter( idea => !idea.isPublic ),
      public_ideas : myIdeas.filter( idea => idea.isPublic ),
    })
  }

  async removeDeletedDrafts(e) {
    // triggers a setState to refresh for the deleted
    var user_page = await getUserByName(this.state.user_name)
    var myIdeas = user_page.data.myIdeas

    this.setState({
      myIdeas : myIdeas,
      draft_ideas : myIdeas.filter( idea => !idea.isPublic ),
    }, () => console.log("here's the new state: ", this.state))
  }

  render() {
    if (this.state.redirect && this.state.edit) {return <Redirect to={`/@${this.props.loggedUser.name}/edit`}/>}
    return (
    <div id="private-profile-container">
			<div className="profileDetails">
				<h2 className="profileName">{this.state.user_name}</h2>
        {this.state.isMyProfile && 
          <button className="buttonEdit" onClick={this.editProfile}>Edit Profile</button>
        }
        {!this.state.isMyProfile && <p>this is not my profile</p>}
			</div>
      {this.state.isMyProfile && (
        <div id="draft-ideas">
          <h3 className="profileHeader">DRAFTS</h3>
          {this.state.draft_ideas && this.state.draft_ideas.length > 0 ?  <div className="draftsContainer">
              {this.state.draft_ideas.map( (idea, index) => (
                <IdeaItem key={index} {...idea} loggedUser={this.props.loggedUser} onDelete={(e) => this.removeDeletedDrafts(e)} />
              ))}
            </div>
          : <p>nothing in progress... share an idea!</p>}
        </div>)
      }
      {/* show "Shared Ideas", on public or private */}
      {this.state.public_ideas && this.state.public_ideas.length > 0 &&
        (<div id="shared-ideas">
          <h3 className="profileHeader">SHARED IDEAS</h3>
          <div className="myIdeasContainer">
            {this.state.public_ideas.map( (idea, index) => (
              <IdeaItem key={index} {...idea} loggedUser={this.props.loggedUser} />
            ))}
          </div>
        </div>
      )}
      {/* if private and no shared ideas, show link to share an idea: */}
      {this.state.isMyProfile && this.state.public_ideas && this.state.public_ideas.length === 0 && (
        <div id="shared-ideas">
          <h3 className="profileHeader">SHARED IDEAS</h3>
          <p>nothing shared yet... share an idea!</p>
        </div>
      )}

      {/* show upvoted ideas */}
      <h3 className="profileHeader">UPVOTES</h3>
      {this.state.user_page.upvotedIdeas && this.state.user_page.upvotedIdeas.length > 0 ? 
        <div id="profile-upvoted">
          { this.state.upvoted_ideas.map( (idea, index) => (
            <IdeaItem key={index} {...idea} loggedUser={this.props.loggedUser}/>
          ))}
        </div>
        : <p>no upvoted ideas yet... browse some!</p>
      }
    </div>
  )}
}

export default Home