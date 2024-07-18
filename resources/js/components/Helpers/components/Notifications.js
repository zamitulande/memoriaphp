import React, { Component, PropTypes } from 'react';
import {Portal, Segment, Header, Button, Icon, Grid } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { actRemoveNotification, actRemoveAllNotifications } from '../../../redux/notifications/actions';

const Notifications = ({notifications, removeNotification, removeAllNotifications}) => {
	//Default center
	let styles = { 
					position: 'fixed',
					bottom: '0%',
					zIndex: 1000,
					width:'100%',
					minWidth:'100%',
					padding:'0px',
					pointerEvents:'none',
					margin:'1rem 0px'
				};

		
	let notification_list = _.map(notifications, (el, i) => {
		let header = "";
		let message = "";
		let button = "";
		let component = ""

		if("header" in el){
			if(typeof el.header == "string")
				header = <Header style={{paddingTop:"0px",marginTop:"0px"}}>{el.header}</Header>;
			else
				header = <Segment basic style={{padding:"0px"}}>{el.header}</Segment>;

			if("message" in el){
				if(typeof el.message == "string")
					message = <p>{el.message}</p>;
				else
					message = <Segment basic style={{padding:"0px"}}>{el.message}</Segment>;
			}

			button = el.showButtonClose?<Button style={{marginTop:"0px"}} notification_id={el.id} basic circular floated="right" icon="remove" inverted compact size="mini" onClick={removeNotification}/>:"";

			component = <Grid.Row key={i} style={{margin:".5rem 0px",padding:"0"}}>
        		<Grid.Column computer={5} tablet={10} mobile={16} style={{pointerEvents:"visible"}}>
						<Segment inverted style={{position:"relative"}}>
							{button}
							{header}
							{message}
						</Segment>
        		</Grid.Column>
    		</Grid.Row>

		}else{
			if("message" in el){
				if(typeof el.message == "string")
					message = <p>{el.message}</p>;
				else
					message = <Segment basic>{el.message}</Segment>;
			}

			button = el.showButtonClose?<Button style={{marginTop:"-5px"}} notification_id={el.id} basic circular floated="right" icon="remove" inverted compact size="mini" onClick={removeNotification}/>:"";

			component = <Grid.Row key={i} style={{margin:'.5rem 0px',padding:'0'}}>
        		<Grid.Column computer={5} tablet={10} mobile={16} style={{pointerEvents:"visible"}}>
						<Segment inverted style={{position:"relative"}}>
							{button}
							{message}
						</Segment>
        		</Grid.Column>
    		</Grid.Row>
		}

		return component;
	})

	let btnRemoveAll = "";

	if(notifications.length > 1)
		btnRemoveAll = <Grid.Row style={{margin:'.5rem 0px',padding:'0'}}>
        		<Grid.Column computer={5} tablet={10} mobile={16} style={{pointerEvents:"visible"}}>
		    		<Button onClick={removeAllNotifications} fluid color="red"><Icon name="trash alternate outline"/> Quitar todo</Button>
	    		</Grid.Column>
    		</Grid.Row>

    return (
    	<Grid style={styles}>
    		{notification_list}

    		{btnRemoveAll}
		</Grid>       
    );
}

const mapStateToProps = (state) => {
	return {
		notifications:state.notifications.notifications
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		removeNotification:(e, {notification_id}) => {
			dispatch(actRemoveNotification(notification_id));
		},

		removeAllNotifications:() => {
			dispatch(actRemoveAllNotifications());
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
