import { useNavigate } from 'react-router-dom';
import styles from './Suggest.moduile.css';

const Buttons = [
    { name: '메뉴 A', value: 'a' },
  { name: '메뉴 B', value: 'b' },
  { name: '메뉴 C', value: 'c' },
  { name: '메뉴 D', value: 'd' },
  { name: '메뉴 E', value: 'e' },
];

export default function Suggest() {
    const navigate = useNavigate();

    const handleButtonClick = async (buttonValue) =>{
        
    };

    return{
      
    };
}