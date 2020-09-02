import _ from 'lodash';
import * as actions from '../actions/eventActions';

export const initialState = {
  events: [],
  operationEvents: [],
  amoEvents: [],
  loading: false,
  hasErrors: false,
  rdvPageInfos: {},
};

export default function eventsReducer(state = initialState, action) {
  let newEvents = [];
  let newEventsPostDelete = [];

  switch (action.type) {
    case actions.GET_EVENTS:
    case actions.GET_OPERATION_EVENTS:
    case actions.GET_AMO_EVENTS:
    case actions.PUT_EVENTS:
    case actions.UPDATE_EVENT:
    case actions.DELETE_EVENT:
    case actions.GET_NOAUTH_INFOS:
    case actions.PUT_NOAUTH_EVENT:
      return { ...state, loading: true };

    case actions.GET_EVENTS_SUCCESS_MERGE:
      newEvents = _.reduceRight(action.payload, (flattened, other) => {
        _.remove(flattened, (item) => item.id === other.id);
        return flattened.concat(other);
      }, state.events);
      return { events: newEvents, loading: false, hasErrors: false };
      
    case actions.GET_AMO_EVENTS_SUCCESS:
      return { ...state, events: action.payload, loading: false, hasErrors: false };

    case actions.GET_EVENTS_SUCCESS:
      return { ...state, events: action.payload, loading: false, hasErrors: false };

    case actions.GET_OPERATION_EVENTS_SUCCESS:
      return { ...state, operationEvents: action.payload, loading: false, hasErrors: false };
      
    case actions.GET_NOAUTH_INFOS_SUCCESS:
      return { ...state, rdvPageInfos: {rdvs: action.payload.rdvs, settings: JSON.parse(action.payload.settings.rdvs_settings)}, loading: false, hasErrors: false };

    case actions.GET_OPERATION_EVENTS_SUCCESS_MERGE:
      newEvents = _.reduceRight(action.payload, (flattened, other) => {
        _.remove(flattened, (item) => item.id === other.id);
        return flattened.concat(other);
      }, state.operationEvents);
      return { ...state, operationEvents: newEvents, loading: false, hasErrors: false };

    case actions.DELETE_EVENT_SUCCESS:
      newEventsPostDelete = _.remove(state.events, (item) => item.id !== action.payload);
      return { ...state, events: newEventsPostDelete, loading: false, hasErrors: false };
      
    case actions.PUT_NOAUTH_EVENT_SUCCESS:
    case actions.UPDATE_EVENT_SUCCESS:
    case actions.PUT_EVENTS_SUCCESS:
      return { ...state, loading: false, hasErrors: false };

    case actions.GET_EVENTS_FAILURE:
    case actions.GET_OPERATION_EVENTS_FAILURE:
    case actions.GET_AMO_EVENTS_FAILURE:
    case actions.UPDATE_EVENT_FAILURE:
    case actions.PUT_EVENTS_FAILURE:
    case actions.DELETE_EVENT_FAILURE:
    case actions.PUT_NOAUTH_EVENT_FAILURE:
    case actions.GET_NOAUTH_INFOS_FAILURE:
      return { ...state, loading: false, hasErrors: true };

    default:
      return state;
  }
}
