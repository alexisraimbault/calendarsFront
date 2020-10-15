import React, {
    Component,
} from 'react';
import './styles.scss';

import img from '../../images/orchestra_logo.jpeg';

class PrivacyPopup extends Component {

    render() {
    
    return (
        <div className="privacy-popup-container">
            <div className="privacy-big-title">DÉCLARATION DE CONFIDENTIALITÉ</div>
            <div className="privacy-title">ARTICLE 1 – RENSEIGNEMENTS PERSONNELS RECUEILLIS</div>
            <div className="privacy-deco" />
            <div className="privacy-content">Lorsque vous effectuez une réservation de rendez-vous en ligne sur notre site, nous recueillons les renseignements personnels que vous nous fournissez, tels que votre nom et votre adresse e-mail.</div>
            <div className="privacy-content">Lorsque vous naviguez sur notre site, nous recevons également automatiquement l’adresse de protocole Internet (adresse IP) de votre ordinateur, qui nous permet d’obtenir plus de détails au sujet du navigateur et du système d’exploitation que vous utilisez.</div>
            <div className="privacy-title">ARTICLE 2 - CONSENTEMENT</div>
            <div className="privacy-deco" />
            <div className="privacy-content">Comment obtenez-vous mon consentement?</div>
            <div className="privacy-content">Lorsque vous nous fournissez vos renseignements personnels pour prendre rendez-vous, nous présumons que vous consentez à ce que nous recueillions vos renseignements et à ce que nous les utilisions à cette fin uniquement.</div>
            <div className="privacy-content">Comment puis-je retirer mon consentement?</div>
            <div className="privacy-content">Si après nous avoir donné votre consentement, vous changez d’avis et ne consentez plus à ce que nous puissions vous contacter, vous pouvez nous en aviser en nous contactant à alexis.raimbault.web@gmail.com ou par courrier à: Orchestra conseil 6 Rue Mouton-Duvernet, Paris, J, 75014, France</div>
            <div className="privacy-title">ARTICLE 3 – DIVULGATION</div>
            <div className="privacy-deco" />
            <div className="privacy-content">Nous pouvons divulguer vos renseignements personnels si la loi nous oblige à le faire ou si vous violez nos Conditions Générales de Vente et d’Utilisation.</div>
            <div className="privacy-title">ARTICLE 4 – SÉCURITÉ</div>
            <div className="privacy-deco" />
            <div className="privacy-content">Pour protéger vos données personnelles, nous prenons des précautions raisonnables et suivons les meilleures pratiques de l’industrie pour nous assurer qu’elles ne soient pas perdues, détournées, consultées, divulguées, modifiées ou détruites de manière inappropriée.</div>
            <div className="privacy-title">QUESTIONS ET COORDONNÉES</div>
            <div className="privacy-deco" />
            <div className="privacy-content">Si vous souhaitez: accéder à, corriger, modifier ou supprimer toute information personnelle que nous avons à votre sujet, déposer une plainte, ou si vous souhaitez simplement avoir plus d’informations, contactez notre agent responsable des normes de confidentialité à alexis.raimbault.web@gmail.com ou par courrier à Orchestra conseil</div>
            <div className="privacy-content">[Re: Agent des Normes de Confidentialité]</div>
            <div className="privacy-content">[6 Rue Mouton-Duvernet, Paris, J, 75014, France]</div>
            <div className="logo-container">
                <img src={img} className="orchestra-logo" />
            </div>
        </div>
    );
    }
}
export default PrivacyPopup;