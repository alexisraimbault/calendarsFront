import React, {
  Component,
} from 'react';
import classNames from 'classnames';
import './styles.scss';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggled: true,
    };
  }

	setToggle = () => {
	  const { applyToggle, id } = this.props;
	  this.setState((prevState) => ({ isToggled: !prevState.isToggled }),
	    () => {
	      applyToggle(id, this.state.isToggled);
	    });
	};

	render() {
    const { isToggled } = this.state;

	  const white = '#ffffff';
	  const black = '#000000';
	  const blue = _.isEmpty(this.props.color) ? '#43d8c9' : this.props.color;

	  const sidebarClass = classNames({
	    'sidebar-container': true,
	    'sidebar-container--toggled': isToggled,
	  });

	  const sidebarLabelClass = classNames({
	    'sidebar-item-label': true,
	    'sidebar-item-label--toggled': isToggled,
	  });

	  return (
  <div className="checkbox" onClick={this.setToggle}>
    <svg viewBox="0 0 512 512" width="20" height="20">
      <path
        d="m512 58.667969c0-32.363281-26.304688-58.667969-58.667969-58.667969h-394.664062c-32.363281
                    0-58.667969 26.304688-58.667969 58.667969v394.664062c0 32.363281 26.304688 58.667969 58.667969
                    58.667969h394.664062c32.363281 0 58.667969-26.304688 58.667969-58.667969zm0 0"
        fill={isToggled ? blue : white}
      />
      <path
        d="m385.75 171.585938c8.339844 8.339843 8.339844 21.820312 0 30.164062l-138.667969 138.664062c-4.160156
                    4.160157-9.621093 6.253907-15.082031 6.253907s-10.921875-2.09375-15.082031-6.253907l-69.332031-69.332031c-8.34375-8.339843-8.34375-21.824219
                    0-30.164062 8.339843-8.34375 21.820312-8.34375 30.164062 0l54.25 54.25 123.585938-123.582031c8.339843-8.34375 21.820312-8.34375 30.164062 0zm0 0"
        fill={isToggled ? black : white}
      />
    </svg>
  </div>
	  );
	}
}
