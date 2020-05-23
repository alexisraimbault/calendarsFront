import React, {
	Component
} from 'react';
import './styles.scss'

import EditableLabel from '../../../components/EditableLabel'
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

class NewEventPopup extends Component {
	constructor(props) {
        super(props);
        this.state = {
			title: 'Title',
            description: 'Description',
            eventDate: new Date(),
            start_time: '10:00',
            end_time: '12:00',
		}
    }

    componentDidMount() {
        //TODO unmock corp_id
        this.props.fetchUsers(1);
    }

    handleChangeDate = date => {
        this.setState({
            eventDate: date
        });
    };

    onChangeStartTime = time => this.setState({ start_time: time })

    onChangeEndTime = time => this.setState({ end_time: time })

    updateTitle = e => this.setState({title: e.target.value})

    updateDescription = e => this.setState({description: e.target.value})

    sendCreateEventRequest = () => {
        const {
            title,
            description,
            eventDate,
            start_time,
            end_time,
        } = this.state;
        const { createEvent, fetchEventsData, closePopup } = this.props

        const formattedDate = `${moment(eventDate).year()}-${moment(eventDate).month() + 1}-${moment(eventDate).date()}`;
        const newFormattedDate = moment(eventDate).format();

        createEvent(title, description, formattedDate, start_time, end_time).then( () => {
            fetchEventsData();
            closePopup();
        });

    }

	render() {
        const { title, description } = this.state; 

        return (
            <div className="new-event-popup-container">
                <div className="title">{"New event"}</div>
                <div className="edit-box" >
                    <EditableLabel value={title} onChange={this.updateTitle} placeholder={"Title here"} />
                    <EditableLabel value={description} onChange={this.updateDescription} placeholder={"Description here"} />
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
                    <UserSelector />
                    {/* TODO assign users to the event -> searchBar and scrollbar */}
                </div>
                <div className="save-btn">
                    <ActionButton clickAction={this.sendCreateEventRequest} label={"Save"}/>
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
})

const mapDispatchToProps = dispatch => bindActionCreators({
    createEvent: createEvent,
    fetchUsers: fetchUsers,
}, dispatch);
    // Connect Redux to React
export default connect(mapStateToProps, mapDispatchToProps)(NewEventPopup)