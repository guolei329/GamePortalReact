import React from 'react';
import './css/MyGroups.css';
import {db, auth} from '../firebase';
import { Tooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export default class MyGroups extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tooltipOpen: false,
            participants: [],
            content:[]
        };
        this.toggle = this.toggle.bind(this);
    }

    componentWillMount(){
        let groupsRef = db.ref('users/'+auth.currentUser.uid+'/privateButAddable/groups');
        let self = this;
        groupsRef.on('value', function(snapshot){
            if(snapshot.exists()){
                let myGroupList = [];
                Object.keys(snapshot.val()).forEach((groupId)=>{
                    let groupRef = db.ref('gamePortal/groups/'+groupId);
                    groupRef.once('value').then(function(snapshot){
                        if(snapshot.exists()){
                            let groupName = snapshot.val().groupName;
                            let groupId = snapshot.ref.key;
                            let groupVal = {
                                name: groupName,
                                id: groupId
                            };
                            let groupParticipants = snapshot.val().participants;
                            let participants = [];
                            let numParticipants = Object.keys(groupParticipants).length;
                            Object.keys(groupParticipants).forEach((participant)=>{
                                let userRef = db.ref('users/'+participant+'/publicFields');
                                userRef.once('value').then(function(snapshot){
                                    let userName = snapshot.val().displayName;
                                    participants.push(userName);
                                    if(participants.length === numParticipants){
                                        groupVal.participants = participants;
                                        myGroupList.push(groupVal);
                                        self.setState({
                                            content: myGroupList
                                        });
                                    }
                                }).catch(self.handleFirebaseException);
                            });
                        }
                    }).catch(self.handleFirebaseException);
                });
            }
        });
    }

    handleMouseEnter(participants){
        this.setState({
            participants: participants
        });
    }

    handleFirebaseException(exception, param){
        console.log('catching firebase exception:');
    }

    toggle() {
        this.setState({
          tooltipOpen: !this.state.tooltipOpen
        });
    }

    render(){
        let content = this.state.content.map((group)=>{
            return(
                <li
                    className="groups-item"
                    key={group.id}
                    onMouseEnter={this.handleMouseEnter.bind(this, group.participants)}>
                    <Link to={'/play/'+group.id} className='item-link'>
                        <div className='item-span-div'>{group.name}</div>
                    </Link>
                </li>
            );
        });
        return(
            <div className="mygroups-inner-container">
                <div className='mygroups-title'>
                    My Groups
                </div>
                <span id="group-participants-tooltip">
                    <ul className="groups-item-container">
                        {content}
                    </ul>
                </span>
                <Tooltip placement="left" isOpen={this.state.tooltipOpen} target="group-participants-tooltip" toggle={this.toggle}>
                  <ul className="participants-list">
                      {this.state.participants.map((participant, index)=>{
                          return(
                          <li key={index} className='participant-list-item'>
                              {participant}
                          </li>
                          )})}
                  </ul>
                </Tooltip>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        style={{width:'50%'}}
                        className='show-component-for-small-screens'
                        color='success'
                        onClick={()=>{this.props.hideMyGroups()}}>
                        Back
                    </Button>
                </div>
            </div>
        );
    }
}
