import React, {
	Component
} from 'react';
import classNames from 'classnames';
import './styles.scss'
import CheckBox from '../CheckBox';
import SettingsMenu from './components/settingsMenu'
import TeamMenu from './components/teamMenu'
import InvitationPopup from '../../pages/calendar/invitationPopup';

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isToggled: true,
			menuToggle: -1,
		}
	}

	setToggle = (toggle) => () => {
		this.setState({isToggled: toggle})
	}

	setSubMenuToggle = (toggle) => () => {
		this.setState({menuToggle: toggle})
	}


	render() {
		const { recipients, toggleRecipient, openInvitationPopup } = this.props;
		const { isToggled, menuToggle } = this.state;

		const sidebarClass = classNames({
			"sidebar-container": true,
			"sidebar-container--toggled": isToggled,
		});

		const sidebarLabelClass = classNames({
			"sidebar-item-label": true,
			"sidebar-item-label--toggled": isToggled,
		});

		const submenuContainerClass = classNames({
			"submenu-container": true,
			"submenu-container--toggled": menuToggle !== -1,
		})
		
		const submenuHaloClass = classNames({
			"submenu-halo-container": true,
			"submenu-halo-container--toggled": menuToggle !== -1,
		})

		return (
			<div className="sidebar-big-container" >
				<div className={sidebarClass} >
						{/* <div>
							<svg viewBox="0 0 512 512" width="20" height="20">
							<path d="m474.667969 0h-437.335938c-20.585937 0-37.332031 16.746094-37.332031 37.332031v49.386719c0 10.410156 4.394531 20.4375 12.097656 
								27.542969l171.242188 156.863281c5.523437 5.011719 8.660156 12.183594 8.660156 19.648438v205.226562c0 5.886719 3.242188 11.328125 8.449219 
								14.101562 2.367187 1.28125 4.96875 1.898438 7.550781 1.898438 3.113281 0 6.207031-.894531 8.875-2.6875l86.507812-57.664062c10.410157-6.933594 
								16.617188-18.558594 16.617188-31.0625v-129.8125c0-7.464844 3.136719-14.636719 8.660156-19.667969l171.242188-156.886719c7.703125-7.0625 
								12.097656-17.089844 12.097656-27.5v-49.386719c0-20.585937-16.746094-37.332031-37.332031-37.332031zm0 0"/>
							</svg>
						</div> */}
					<div className="recipients-container">
						{_.map(recipients, recipient => <div className="recipient-container"> {`${recipient.name}`}<CheckBox applyToggle={toggleRecipient} id={recipient.id} /></div>)}
					</div>
					<div className="sidebar-bottom-menu">
					<div className="sidebar-item-container" onClick={openInvitationPopup}>
							<div>
								<svg viewBox="0 0 512 512" width="20" height="20">
									<g>
										<g>
											<path d="M438.09,273.32h-39.596c4.036,11.05,6.241,22.975,6.241,35.404v149.65c0,5.182-0.902,10.156-2.543,14.782h65.461
												c24.453,0,44.346-19.894,44.346-44.346v-81.581C512,306.476,478.844,273.32,438.09,273.32z"/>
										</g>
									</g>
									<g>
										<g>
											<path d="M107.265,308.725c0-12.43,2.205-24.354,6.241-35.404H73.91c-40.754,0-73.91,33.156-73.91,73.91v81.581
												c0,24.452,19.893,44.346,44.346,44.346h65.462c-1.641-4.628-2.543-9.601-2.543-14.783V308.725z"/>
										</g>
									</g>
									<g>
										<g>
											<path d="M301.261,234.815h-90.522c-40.754,0-73.91,33.156-73.91,73.91v149.65c0,8.163,6.618,14.782,14.782,14.782h208.778
												c8.164,0,14.782-6.618,14.782-14.782v-149.65C375.171,267.971,342.015,234.815,301.261,234.815z"/>
										</g>
									</g>
									<g>
										<g>
											<path d="M256,38.84c-49.012,0-88.886,39.874-88.886,88.887c0,33.245,18.349,62.28,45.447,77.524
												c12.853,7.23,27.671,11.362,43.439,11.362c15.768,0,30.586-4.132,43.439-11.362c27.099-15.244,45.447-44.28,45.447-77.524
												C344.886,78.715,305.012,38.84,256,38.84z"/>
										</g>
									</g>
									<g>
										<g>
											<path d="M99.918,121.689c-36.655,0-66.475,29.82-66.475,66.475c0,36.655,29.82,66.475,66.475,66.475
												c9.298,0,18.152-1.926,26.195-5.388c13.906-5.987,25.372-16.585,32.467-29.86c4.98-9.317,7.813-19.946,7.813-31.227
												C166.393,151.51,136.573,121.689,99.918,121.689z"/>
										</g>
									</g>
									<g>
										<g>
											<path d="M412.082,121.689c-36.655,0-66.475,29.82-66.475,66.475c0,11.282,2.833,21.911,7.813,31.227
												c7.095,13.276,18.561,23.874,32.467,29.86c8.043,3.462,16.897,5.388,26.195,5.388c36.655,0,66.475-29.82,66.475-66.475
												C478.557,151.509,448.737,121.689,412.082,121.689z"/>
										</g>
									</g>
								</svg>
							</div>
						</div>
						<div className="sidebar-item-container" onClick={this.setSubMenuToggle(0)}>
							<div>
								<svg viewBox="0 0 512 512" width="20" height="20">
								<path d="M496.659,312.107l-47.061-36.8c0.597-5.675,1.109-12.309,1.109-19.328c0-7.019-0.491-13.653-1.109-19.328l47.104-36.821
									c8.747-6.912,11.136-19.179,5.568-29.397L453.331,85.76c-5.227-9.557-16.683-14.464-28.309-10.176l-55.531,22.293
									c-10.645-7.68-21.803-14.165-33.344-19.349l-8.448-58.901C326.312,8.448,316.584,0,305.086,0h-98.133
									c-11.499,0-21.205,8.448-22.571,19.456l-8.469,59.115c-11.179,5.035-22.165,11.435-33.28,19.349l-55.68-22.357
									C76.52,71.531,64.04,76.053,58.856,85.568L9.854,170.347c-5.781,9.771-3.392,22.464,5.547,29.547l47.061,36.8
									c-0.747,7.189-1.109,13.44-1.109,19.307s0.363,12.117,1.109,19.328l-47.104,36.821c-8.747,6.933-11.115,19.2-5.547,29.397
									l48.939,84.672c5.227,9.536,16.576,14.485,28.309,10.176l55.531-22.293c10.624,7.659,21.781,14.144,33.323,19.349l8.448,58.88
									C185.747,503.552,195.454,512,206.974,512h98.133c11.499,0,21.227-8.448,22.592-19.456l8.469-59.093
									c11.179-5.056,22.144-11.435,33.28-19.371l55.68,22.357c2.688,1.045,5.483,1.579,8.363,1.579c8.277,0,15.893-4.523,19.733-11.563
									l49.152-85.12C507.838,331.349,505.448,319.083,496.659,312.107z M256.019,341.333c-47.061,0-85.333-38.272-85.333-85.333
									s38.272-85.333,85.333-85.333s85.333,38.272,85.333,85.333S303.08,341.333,256.019,341.333z"/>
								</svg>
							</div>
						</div>
					</div>
				</div>
				<div className={submenuContainerClass}>
					{menuToggle === 0 &&
						<SettingsMenu />
					}
					{menuToggle === 1 &&
						<TeamMenu />
					}
				</div>
				<div  onClick={this.setSubMenuToggle(-1)} className={submenuHaloClass} />
			</div>
		);
	}
}

export default Sidebar;