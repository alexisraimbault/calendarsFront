import React, {
	Component
} from 'react';
import './styles.scss'

import LabelClickToEdit from '../../../components/LabelClickToEdit'
import UserSelector from '../../../components/UserSelector'

import ActionButton from '../../../components/ActionButton';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { createEvent } from '../../../redux/actions/eventActions'
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
            selectedUsers: props.invited,
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
        //TODO edit event instead of creating it
        // const {
        //     title,
        //     description,
        //     eventDate,
        //     start_time,
        //     end_time,
        //     selectedUsersIds
        // } = this.state;
        // const { createEvent, fetchEventsData, closePopup, sessionToken } = this.props

        // const formattedDate = `${moment(eventDate).year()}-${moment(eventDate).month() + 1}-${moment(eventDate).date()}`;

        // const selectedUserIds = _.join(selectedUsersIds, ',');

        // createEvent(title, description, formattedDate, start_time, end_time, selectedUserIds, sessionToken).then( () => {
        //     fetchEventsData();
        //     closePopup();
        // });

    }

	render() {
        const { title, description, selectedUsers } = this.state; 

        return (
            <div className="new-event-popup-container">
                <div className="top-popup-container">
                <div className="title">{"New event"}</div>
                    <div className="edit-box" >
                        <LabelClickToEdit value={title} onChange={this.updateTitle} placeholder={"Title here"} />
                        <LabelClickToEdit value={description} onChange={this.updateDescription} placeholder={"Description here"} />
                        <div className="date-picker">
                            <DatePicker
                                selected={this.state.eventDate}
                                onChange={this.handleChangeDate}
                            />
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
                        <UserSelector setSelectedUsersIds={this.setSelectedUsersIds} defaultSelected={selectedUsers}/>
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
    createEvent: createEvent,
    fetchUsers: fetchUsers,
}, dispatch);
    // Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsPopup)