import React, {Component} from "react"
import IdeaItem from "../components/IdeaListItem"
import { getUserByName, getOneIdea, getAllIdeas } from "../api/apiHandler";

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_name: this.props.match.params.name,
      user_page: {},
			current_user: this.setLoggedUser(),
      isMyProfile: this.setMyProfile(),
      upvoted_ideas: [],
      draft_ideas: [],
      public_ideas: [],
    }
    // console.log("user prof props: ", props)
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

  upvoted_ideas = [];
  draft_ideas = [];
  public_ideas = [];
  my_ideas = [];

  addIdeaFromId(id, array) {
    getOneIdea(id)
    .then(res => {
      array.push(res.data.idea);
      this.setState({});
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  getDraftsAndPublished(idArray) {
    idArray.forEach( id => {
      getOneIdea(id)
      .then( res => {
        var idea = res.data.idea
        idea.isPublic ? this.public_ideas.push(idea) : this.draft_ideas.push(idea)
        console.log("here's the idea: ", idea)
      })
      .catch(err => {
      console.log(err.response);
      })
    })
  }

  returnIdeasArrayFromIdArray(idArray) {
    var ideasArray = []
    idArray.forEach( id => {
      getOneIdea(id)
      .then( res => {
        var idea = res.data.idea
        ideasArray.push(idea)
        console.log("here's the idea: ", idea)
      })
      .catch(err => {
      console.log(err.response);
      })
    })
    return ideasArray
  }

  async componentDidMount() {
    var user_page = await getUserByName(this.state.user_name)
    user_page = user_page.data
    
    var upvoted_ideas = []
    user_page.upvotedIdeas.forEach( id => {
      this.addIdeaFromId(id, this.upvoted_ideas)
    })
    
    user_page.myIdeas.forEach( id => {
      this.addIdeaFromId(id, this.my_ideas)
    })

    // idea.isPublic ? this.public_ideas.push(idea) : this.draft_ideas.push(idea)

    // var myIdeas = this.returnIdeasArrayFromIdArray(user_page.myIdeas)
    // console.log("myIdeas: ", myIdeas)
    // var draft_ideas = myIdeas.filter( idea => !idea.isPublic )
    // var public_ideas = myIdeas.filter( idea => idea.isPublic )

    this.setState({
      user_page,
      upvoted_ideas,
      // draft_ideas,
      // public_ideas
    })


    // getUserByName(this.state.user_name)
    //   .then(res => {
    //     this.setState({ 
    //       user_page: res.data,
    //     }, () => {
    //       res.data.upvotedIdeas.forEach( id => {
    //         this.addIdeaFromId(id, this.upvoted_ideas)
    //       })
    //       this.getDraftsAndPublished(res.data.myIdeas)
    //     }
    //     );
    //   })
    //   .catch(err => {
    //     console.log(err.response);
    //   });	
  }

  render() {
    console.log("state ", this.state)
    // console.log("this.upvoted_ideas", this.upvoted_ideas)
    // console.log("this.draft_ideas", this.draft_ideas)
    // console.log("this.public_ideas", this.public_ideas)

    this.my_ideas.forEach(idea => idea.isPublic ? this.public_ideas.push(idea) : this.draft_ideas.push(idea))

    return (
    <div id="private-profile-container">
			<div className="profileDetails">
				<h2 className="profileName">{this.state.user_name}</h2>
        {this.state.isMyProfile && <p>this is my profile!</p>}
        {!this.state.isMyProfile && <p>this is not my profile</p>}
			</div>
      {this.state.isMyProfile && (
        <div id="profile-drafts">
        <h3 className="profileHeader">DRAFTS</h3>
        {this.draft_ideas && this.draft_ideas.length > 0 ?  <div className="draftsContainer">
            <p>here are the drafts:{this.draft_ideas[0]} </p>
            {this.draft_ideas.map( (idea, index) => (
              <IdeaItem key={index} {...idea} />
            ))}
          </div>
        : <p>no drafts yet... share an idea!</p>}
        </div>
        )
      }
      <h3 className="profileHeader">UPVOTES</h3>
      {this.state.user_page.upvotedIdeas && this.state.user_page.upvotedIdeas.length > 0 ? 
        <div id="profile-upvoted">
          {this.upvoted_ideas.map( (idea, index) => (
            <IdeaItem key={index} {...idea} />
          ))}
        </div>
        : <p>no upvoted ideas yet... browse some!</p>
      }
    </div>
  )}
}

export default Home