import React, {
	Component
} from 'react';
import './styles.scss'

import EditableLabel from '../../../components/EditableLabel'
import UserSelector from '../../../components/UserSelector'

import ActionButton from '../../../components/ActionButton';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { postUpdateEvent } from '../../../redux/actions/eventActions'
import { fetchUsers } from '../../../redux/actions/userActions'
import * as moment from 'moment';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import TimePicker from 'react-time-picker';

class EventDetailsPopup extends Component {
	constructor(props) {
        super(props);

        this.state = {
			title: props.title,
            description: props.description,
            eventDate: props.date,
            start_time: props.startTime,
            end_time: props.endTime,
            selectedUsersIds: _.map(props.invited, user => user.id),
		}
    }

    componentDidMount() {
        const { fetchUsers, sessionToken } = this.props;
        //TODO unmock corp_id
        fetchUsers(1, sessionToken);
    }

    handleChangeDate = date => {
        this.setState({
            eventDate: date
        });
    };

    setSelectedUsersIds = array => this.setState({ selectedUsersIds: array })

    onChangeStartTime = time => this.setState({ start_time: time })

    onChangeEndTime = time => this.setState({ end_time: time })

    updateTitle = e => this.setState({title: e.target.value})

    updateDescription = e => this.setState({description: e.target.value})

    sendCreateEventRequest = () => {
        const {
            title,
            description,
            start_time,
            end_time,
            selectedUsersIds
        } = this.state;
        const { postUpdateEvent, fetchEventsData, closePopup, sessionToken, eventId } = this.props

        const selectedUserIds = _.join(selectedUsersIds, ',');

        postUpdateEvent(eventId, title, description, start_time, end_time, selectedUserIds, sessionToken).then( () => {
            fetchEventsData();
            closePopup();
        });

    }

	render() {
        const { title, description } = this.state; 
        const { invited } = this.props;

        return (
            <div className="new-event-popup-container">
                <div className="top-popup-container">
                <div className="title">{"Event details"}</div>
                    <div className="edit-box" >
                        <EditableLabel value={title} onChange={this.updateTitle} placeholder={"Title here"} />
                        <EditableLabel value={description} onChange={this.updateDescription} placeholder={"Description here"} />
                        <div className="date-picker">
                            {this.state.eventDate}
                        </div>
                        <div className="time-pickers-container">
                            <div className="time-picker">
                                <TimePicker
                                    onChange={this.onChangeStartTime}
                                    value={this.state.start_time}
                                />
                            </div>
                            <div className="time-picker">
                                <TimePicker
                                    onChange={this.onChangeEndTime}
                                    value={this.state.end_time}
                                />
                            </div>
                        </div>
                        <UserSelector setSelectedUsersIds={this.setSelectedUsersIds} defaultSelected={invited}/>
                        {/* TODO assign users to the event -> searchBar and scrollbar */}
                    </div>
                </div>
                <div className="save-btn">
                    <ActionButton clickAction={this.sendCreateEventRequest} label={"Save modifications"}/>
                </div>
            </div>
        );
    }

}


// Map Redux state to React component props
const mapStateToProps = state => ({
    loading: state.users.loading,
    users: state.users.users,
    hasErrors: state.users.hasErrors,
    sessionToken: state.me.sessionToken,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    postUpdateEvent: postUpdateEvent,
    fetchUsers: fetchUsers,
}, dispatch);
    // Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsPopup)