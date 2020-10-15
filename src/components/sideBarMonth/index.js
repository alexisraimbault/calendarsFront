import React, {
  Component,
} from 'react';
import classNames from 'classnames';
import './styles.scss';
import CheckBox from '../CheckBox';
import SettingsMenu from './components/settingsMenu';
import TeamMenu from './components/teamMenu';

import { Scrollbars } from 'react-custom-scrollbars';
import InvitationPopup from '../../pages/calendar/invitationPopup';
import SingleUser from '../SingleUser'

class SidebarMonth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggled: true,
      menuToggle: -1,
    };
  }

  setToggle = (toggle) => () => {
    this.setState({ isToggled: toggle });
  };

  setSubMenuToggle = (toggle) => () => {
    this.setState({ menuToggle: toggle });
  };


  render() {
    const {
      recipients, toggleRecipient, openInvitationPopup, logout, userName, operations, toggleOperation, openOperationsPopup, towardsOffDaysBoard, openRdvSettingsPopup, isAdmin,
    } = this.props;
    const { isToggled, menuToggle } = this.state;

    const sidebarClass = classNames({
      'sidebar-container-month': true,
      'sidebar-container-month--toggled': isToggled,
    });

    const sidebarLabelClass = classNames({
      'sidebar-item-label': true,
      'sidebar-item-label--toggled': isToggled,
    });

    const submenuContainerClass = classNames({
      'submenu-container': true,
      'submenu-container--toggled': menuToggle !== -1,
    });

    const submenuHaloClass = classNames({
      'submenu-halo-container': true,
      'submenu-halo-container--toggled': menuToggle !== -1,
    });

    const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
    console.log('ALEXIS ', height)

    return (
      <div className="sidebar-big-container">
        <div className="sidebar-user-display">
        </div>
        <div className={sidebarClass}>
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
          <Scrollbars
            autoHeight
            autoHeightMin={0}
            autoHeightMax={height - 420}
          >
          <div className="recipients-container">
              {_.map(recipients, (recipient) => (
                <div className="recipient-container">
                  {' '}
                  {`${recipient.name}`}
                  <CheckBox applyToggle={toggleRecipient} id={recipient.id} />
                </div>
              ))}
              <div className="space-div" />
              {_.map(operations, (operation) => (
                <div className="recipient-container">
                  {' '}
                  {`${operation.name}`}
                  <CheckBox applyToggle={toggleOperation} id={operation.id} color={operation.color} />
                </div>
              ))}
              </div>
          </Scrollbars>
            </div>
          <div className="sidebar-bottom-menu">
            <div className="sidebar-item-container" onClick={openOperationsPopup}>
                <div className="label">
                  {'Operations'}
                </div>
              <svg id="bold" enable-background="new 0 0 24 24" height="20" viewBox="0 0 24 24" width="20">
                <path d="m13.03 1.87-10.99-1.67c-.51-.08-1.03.06-1.42.39-.39.34-.62.83-.62 1.34v21.07c0 .55.45 1 1 1h3.25v-5.25c0-.97.78-1.75 1.75-1.75h2.5c.97 0 
            1.75.78 1.75 1.75v5.25h4.25v-20.4c0-.86-.62-1.59-1.47-1.73zm-7.53 12.88h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 
            .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 
            0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 
            .75.336.75.75s-.336.75-.75.75zm5 9h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 
            0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 
            .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 
            0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75s-.336.75-.75.75z"/>
                <path d="m22.62 10.842-7.12-1.491v14.649h6.75c.965 0 1.75-.785 1.75-1.75v-9.698c0-.826-.563-1.529-1.38-1.71zm-2.37 
            10.158h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 
            0 .75.336.75.75s-.336.75-.75.75zm0-3h-1.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.5c.414 0 .75.336.75.75s-.336.75-.75.75z"/>
              </svg>
            </div>
            <div className="sidebar-item-container" onClick={towardsOffDaysBoard}>
              <div className="label">
                {'Jours Off'}
              </div>
              <svg height="20" viewBox="0 0 64 64" width="20">
                <path d="m12 47h4.001v3h-4.001z" />
                <path d="m49 38a11 11 0 1 0 11 11 11.013 11.013 0 0 0 -11-11zm7.192 8.222-8.485 8.485a1 1 0 0 1 -1.414 0l-4.242-4.243a1 1 0 0 1 
            1.414-1.414l3.535 3.536 7.778-7.778a1 1 0 0 1 1.414 1.414z"/>
                <path d="m24 29h4.001v3h-4.001z" />
                <path d="m36 29h4v3h-4z" />
                <path d="m12 38h4.001v3h-4.001z" />
                <path d="m24 38h4.001v3h-4.001z" />
                <path d="m12 29h4.001v3h-4.001z" />
                <path d="m16 14a2.006 2.006 0 0 0 2-2v-6a2 2 0 0 0 -4 0v6a2.006 2.006 0 0 0 2 2z" />
                <path d="m32 14a2.006 2.006 0 0 0 2-2v-6a2 2 0 0 0 -4 0v6a2.006 2.006 0 0 0 2 2z" />
                <path d="m48 14a2.006 2.006 0 0 0 2-2v-6a2 2 0 0 0 -4 0v6a2.006 2.006 0 0 0 2 2z" />
                <path d="m48 29h4v3h-4z" />
                <path d="m57 10h-5v2a4 4 0 0 1 -8 0v-2h-8v2a4 4 0 0 1 -8 0v-2h-8v2a4 4 0 0 1 -8 0v-2h-5a3.009 3.009 0 0 0 -3 3v7h56v-7a3.009 3.009 0 0 0 -3-3z" />
                <path d="m24 47h4.001v3h-4.001z" />
                <path d="m4 22v31a3.009 3.009 0 0 0 3 3h31.063a12.984 12.984 0 1 1 21.937-13.9v-20.1zm14 28a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 
            2zm0-9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm0-9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 
            2zm12 18a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm0-9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 
            2zm0-9a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm10 6h-4v3a1 1 0 0 1 0 2 2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a1 1 0 0 1 0 
            2zm2-6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm12 0a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="sidebar-item-container" onClick={openInvitationPopup}>
              <div className="label">
                {'Utilisateurs'}
              </div>
              <svg viewBox="0 0 512 512" width="20" height="20">
                <g>
                  <g>
                    <path d="M438.09,273.32h-39.596c4.036,11.05,6.241,22.975,6.241,35.404v149.65c0,5.182-0.902,10.156-2.543,14.782h65.461
												c24.453,0,44.346-19.894,44.346-44.346v-81.581C512,306.476,478.844,273.32,438.09,273.32z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M107.265,308.725c0-12.43,2.205-24.354,6.241-35.404H73.91c-40.754,0-73.91,33.156-73.91,73.91v81.581
												c0,24.452,19.893,44.346,44.346,44.346h65.462c-1.641-4.628-2.543-9.601-2.543-14.783V308.725z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M301.261,234.815h-90.522c-40.754,0-73.91,33.156-73.91,73.91v149.65c0,8.163,6.618,14.782,14.782,14.782h208.778
												c8.164,0,14.782-6.618,14.782-14.782v-149.65C375.171,267.971,342.015,234.815,301.261,234.815z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M256,38.84c-49.012,0-88.886,39.874-88.886,88.887c0,33.245,18.349,62.28,45.447,77.524
												c12.853,7.23,27.671,11.362,43.439,11.362c15.768,0,30.586-4.132,43.439-11.362c27.099-15.244,45.447-44.28,45.447-77.524
												C344.886,78.715,305.012,38.84,256,38.84z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M99.918,121.689c-36.655,0-66.475,29.82-66.475,66.475c0,36.655,29.82,66.475,66.475,66.475
												c9.298,0,18.152-1.926,26.195-5.388c13.906-5.987,25.372-16.585,32.467-29.86c4.98-9.317,7.813-19.946,7.813-31.227
												C166.393,151.51,136.573,121.689,99.918,121.689z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M412.082,121.689c-36.655,0-66.475,29.82-66.475,66.475c0,11.282,2.833,21.911,7.813,31.227
												c7.095,13.276,18.561,23.874,32.467,29.86c8.043,3.462,16.897,5.388,26.195,5.388c36.655,0,66.475-29.82,66.475-66.475
												C478.557,151.509,448.737,121.689,412.082,121.689z"
                    />
                  </g>
                </g>
              </svg>
            </div>
            {isAdmin && (
              <div className="sidebar-item-container" onClick={openRdvSettingsPopup}>
                <div className="label">
                  {'Prise de rdv'}
                </div>
                <svg viewBox="0 0 512 512" width="20" height="20">
                  <g id="_30-appointment" data-name="30-appointment"><path d="M393.265,129.522a12,12,0,1,0,0-24,28,28,0,1,1,14.405-52h31.7a51.991,51.991,0,1,0-46.107,76Z"/><path d="M272.211,129.522a12,12,0,1,0,0-24,28,28,0,1,1,14.4-52h31.7a51.991,51.991,0,1,0-46.107,76Z"/><path d="M468.927,80.349a12,12,0,0,0-11.662-14.827H382.717a15.979,15.979,0,0,0,10.548,28,24,24,0,1,1,0,48,63.957,63.957,0,0,1-62.856-76H261.664a15.978,15.978,0,0,0,10.547,28,24,24,0,1,1,0,48,63.953,63.953,0,0,1-62.855-76H140.61a15.978,15.978,0,0,0,10.547,28,24,24,0,1,1,0,48,63.953,63.953,0,0,1-62.855-76H81.265A12,12,0,0,0,69.6,74.695L50.978,151.522h400.7Z"/><path d="M151.157,129.522a12,12,0,1,0,0-24,28,28,0,1,1,14.405-52h31.7a51.992,51.992,0,1,0-46.108,76Z"/><path d="M469.265,298.541V129.889l-36.727,151.5A119.558,119.558,0,0,1,469.265,298.541Z"/><path d="M401,277.174a120.287,120.287,0,0,1,19.813,1.645l27.951-115.3H48.069L5.6,338.694a12,12,0,0,0,11.662,14.827H289.221A120.2,120.2,0,0,1,401,277.174Zm-59.735-79.652h32a12,12,0,0,1,0,24h-32a12,12,0,0,1,0-24Zm-232,120h-32a12,12,0,1,1,0-24h32a12,12,0,0,1,0,24Zm8-48h-32a12,12,0,1,1,0-24h32a12,12,0,1,1,0,24Zm16-48h-32a12,12,0,1,1,0-24h32a12,12,0,0,1,0,24Zm56,96h-32a12,12,0,0,1,0-24h32a12,12,0,0,1,0,24Zm8-48h-32a12,12,0,1,1,0-24h32a12,12,0,1,1,0,24Zm16-48h-32a12,12,0,0,1,0-24h32a12,12,0,0,1,0,24Zm56,96h-32a12,12,0,0,1,0-24h32a12,12,0,0,1,0,24Zm8-48h-32a12,12,0,1,1,0-24h32a12,12,0,1,1,0,24Zm16-48h-32a12,12,0,0,1,0-24h32a12,12,0,0,1,0,24Zm32,24h32a12,12,0,1,1,0,24h-32a12,12,0,1,1,0-24Z"/><path d="M69.265,365.521v32a12,12,0,0,0,12,12H281.632a120.352,120.352,0,0,1,3.613-44Z"/><path d="M497.265,65.522H478.036a23.845,23.845,0,0,1,3.229,12V308.049a120.677,120.677,0,0,1,28,37.394V77.522A12,12,0,0,0,497.265,65.522Z"/><path d="M401,289.174a108,108,0,1,0,108,108A108.122,108.122,0,0,0,401,289.174ZM413,480.3V469.174a12,12,0,0,0-24,0V480.3a84.171,84.171,0,0,1-71.129-71.129H329a12,12,0,0,0,0-24H317.871A84.17,84.17,0,0,1,389,314.045v11.129a12,12,0,0,0,24,0V314.045a84.17,84.17,0,0,1,71.129,71.129H473a12,12,0,0,0,0,24h11.129A84.171,84.171,0,0,1,413,480.3Z"/><path d="M424.515,356.688l-25.884,25.884L374.366,370.44a12,12,0,0,0-10.732,21.467l32,16a12,12,0,0,0,13.851-2.248l32-32a12,12,0,0,0-16.97-16.971Z"/></g>
                </svg>
              </div>)}
            {/* <div className="sidebar-item-container" onClick={this.setSubMenuToggle(0)}>
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
						</div> */}
            <div className="sidebar-item-container" onClick={logout}>
              <div className="label">
                {'Déconnexion'}
              </div>
              <svg viewBox="0 0 512 512" width="20" height="20">
                <path d="m320 277.335938c-11.796875 0-21.332031 9.558593-21.332031 21.332031v85.335937c0 11.753906-9.558594
									21.332032-21.335938 21.332032h-64v-320c0-18.21875-11.605469-34.496094-29.054687-40.554688l-6.316406-2.113281h99.371093c11.777344
									0 21.335938 9.578125 21.335938 21.335937v64c0 11.773438 9.535156 21.332032 21.332031 21.332032s21.332031-9.558594
									21.332031-21.332032v-64c0-35.285156-28.714843-63.99999975-64-63.99999975h-229.332031c-.8125
									0-1.492188.36328175-2.28125.46874975-1.027344-.085937-2.007812-.46874975-3.050781-.46874975-23.53125 0-42.667969
									19.13281275-42.667969 42.66406275v384c0 18.21875 11.605469 34.496093 29.054688 40.554687l128.386718 42.796875c4.351563
									1.34375 8.679688 1.984375 13.226563 1.984375 23.53125 0 42.664062-19.136718 42.664062-42.667968v-21.332032h64c35.285157 0
									64-28.714844 64-64v-85.335937c0-11.773438-9.535156-21.332031-21.332031-21.332031zm0 0"
                />
                <path d="m505.75 198.253906-85.335938-85.332031c-6.097656-6.101563-15.273437-7.9375-23.25-4.632813-7.957031
									3.308594-13.164062 11.09375-13.164062 19.714844v64h-85.332031c-11.777344 0-21.335938 9.554688-21.335938 21.332032 0
									11.777343 9.558594 21.332031 21.335938 21.332031h85.332031v64c0 8.621093 5.207031 16.40625 13.164062 19.714843 7.976563
									3.304688 17.152344 1.46875 23.25-4.628906l85.335938-85.335937c8.339844-8.339844 8.339844-21.824219 0-30.164063zm0 0"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={submenuContainerClass}>
          {menuToggle === 0
            && <SettingsMenu />}
          {menuToggle === 1
            && <TeamMenu />}
        </div>
        <div onClick={this.setSubMenuToggle(-1)} className={submenuHaloClass} />
      </div>
    );
  }
}

export default SidebarMonth;
