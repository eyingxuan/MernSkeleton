import React, {Component} from 'react';
import { create } from './api-user.js';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import { Icon, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from '@material-ui/core';

const styles = theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing.unit * 5,
      paddingBottom: theme.spacing.unit * 2
    },
    error: {
      verticalAlign: 'middle'
    },
    title: {
      marginTop: theme.spacing.unit * 2,
      color: theme.palette.openTitle
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 300
    },
    submit: {
      margin: 'auto',
      marginBottom: theme.spacing.unit * 2
    }
  })

class Signup extends Component{
    
    state = {
        name: '',
        password: '',
        email: '',
        open: false,
        error: ''
    }
    

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    }

    clickSubmit = () => {
        const user = {
            name: this.state.name || undefined,
            email: this.state.email || undefined,
            password: this.state.password || undefined
        }
        create(user).then((data) => {
            if (data.error){
                this.setState({error: data.error});
            } else {
                this.setState({error: '', open: true}); 
            }
        })
    }

    render(){
        const {classes} = this.props;
        return (<div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                        Sign Up!
                    </Typography>
                    <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} margin="normal"/>
                    <br/>
                    <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal"/>
                    <br/>
                    <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} margin="normal"/>
                    <br/>
                    {this.state.error && (<Typography component="p" color="error">
                        <Icon color="error" className={classes.error}>error</Icon>
                        {this.state.error}
                    </Typography>)}
                </CardContent>
                <CardActions>
                    <Button color="primary" raised="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
            <Dialog open={this.state.open} disableBackdropClick={true}>
                <DialogTitle>
                    New Account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New account successfully created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" autoFocus="autoFocus" variant="raised">
                            Signin
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </div>)
    }
    
}

Signup.propTypes = {
    classes: PropTypes.object.isRequired
  }
  
  export default withStyles(styles)(Signup)
  