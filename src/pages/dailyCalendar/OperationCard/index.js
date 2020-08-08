import React, {
    Component,
} from 'react';
import './styles.scss';
import { Scrollbars } from 'react-custom-scrollbars';

class OperationCard extends Component {

    generateRGBAFromHex = (hex, a) => {
        return 'rgba('+parseInt(hex.substring(1,3),16)+','+parseInt(hex.substring(3,5),16)+','+parseInt(hex.substring(5,7),16)+','+a+')';
    }

    render() {
        const { operation: {name, color, data}, amos } = this.props;

        return (
            <div className="operation-card-container"
                style={{backgroundColor: this.generateRGBAFromHex(color, 0.3)}}
            >
                <Scrollbars
                    autoHeight
                    autoHeightMin={0}
                    autoHeightMax={260}
                >
                    <div className="op-card-title">{name}</div>
                    <div className="op-card-desc">{data}</div>
                    <div className="op-card-amos">
                        {_.map(amos, amo => (
                            <div className="op-card-amo">
                                <b>{amo.name}</b>{` : ${_.get(amo, 'phone', 'pas de téléphone renseigné') || 'Pas de téléphone renseigné'}`}
                            </div>
                        ))}
                    </div>
                </Scrollbars>
                
            </div>
        );
    }
}

export default OperationCard;
