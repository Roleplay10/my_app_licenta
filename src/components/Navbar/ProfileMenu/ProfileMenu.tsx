import { Link } from "react-router-dom";
import "./ProfileMenu.css";

interface ProfileMenuProps {
    img: string;
    text: string;
    location: string;
    onClick?: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = (props) => {
    return (
        <li className="dropdownItem">
            {!props.onClick ? (
                <Link to={props.location}>
                    <img src={props.img} alt={props.text}></img>
                    <span>{props.text}</span>
                </Link>
            ) : (
                <Link to={props.location} onClick={props.onClick}>
                  <img src={props.img} alt={props.text}></img>
                  <span>{props.text}</span>
                </Link>
            )}
        </li>
    );
}

export default ProfileMenu;