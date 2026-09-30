import React from 'react'

const Button = ({title,textCol,fontsize = 30,extraclass}) => {
    const fontColor = `text-${textCol}`;
  return (
    <button 
    className={`scale-y-[0.8] w-max hover:text-white transition-all duration-300 ease-linear ${fontColor} py-1 px-6 rounded-full bg-gradient-to-b from-[#00B1DB] to-[#01F8DF] ${extraclass}`}
    style={{fontSize: `${fontsize}px`}}
    >
        {title}
    </button>
  )
}

export default Button