import React from 'react';
import './style.css'

interface MyButtonProps {
      text: string;
      disable?: boolean; 
     onClick?: () => void;
     style?:any
    }

const MyButton = (props:MyButtonProps) =>{
    const {text, disable=false, onClick,style} = props;
    return (
        <button type='submit' style={{...style,opacity:disable?'0.6':1}} onClick={()=>!disable && onClick && onClick()} className='btn_container'>{text}</button>
    )
}

export default MyButton;    