import React, {Component} from 'react';
import auth from './../auth/auth-helper';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Paper, List, Divider } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Person from '@material-ui/icons/Person'
import { read } from './api-user';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom'
import Edit from '@material-ui/icons/Edit'
import DeleteUser from './DeleteUser'


const styles = theme => ({
    root: theme.mixins.gutters({
      maxWidth: 600,
      margin: 'auto',
      padding: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 5
    }),
    title: {
      margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 2}px`,
      color: theme.palette.protectedTitle
    }
  })

class Profile extends Component{
    constructor({match}) {
        super();
        this.state = {
            user: '',
            redirectToSignin: false
        }
        this.match = match
    }

    init = (userId) => {
        const jwt = auth.isAuthenticated()
        read({
            userId: userId
        }, {t: jwt.token}).then((data) => {
            if (data.error) {
                this.setState({redirectToSignin: true})
            } else {
                this.setState({user: data})
            }
        })
        console.log(this.userId);
    }

    componentDidMount = () => {
        console.log("hi");
        this.init(this.match.params.userId);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps !== this.props) {
            this.init(this.props.match.params.userId);
        }
    }

    render() {
        const {classes} = this.props;
        const redirectToSignin = this.state.redirectToSignin;
        if (redirectToSignin) {
            return <Redirect to='/signin'/>
        }
        return (<div>
            <Paper className={classes.root} elavation={4}>
                <Typography type="title" className={classes.title}>
                    Profile
                </Typography>
                <List dense>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Person/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={this.state.user.name} secondary={this.state.user.email}/>
                        { auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id &&
                            (<ListItemSecondaryAction>
                                <Link to={"/user/edit/" + this.state.user._id}>
                                    <IconButton>
                                        <Edit/>
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={this.state.user._id}/>
                            </ListItemSecondaryAction>)
                        }
                    </ListItem>
                    <Divider/>
                    <ListItem>
                        <ListItemText primary={"Joined: " + (new Date(this.state.user.created)).toDateString()}/>
                    </ListItem>
                </List>
            </Paper>
        </div>)
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
  }
  
  export default withStyles(styles)(Profile)