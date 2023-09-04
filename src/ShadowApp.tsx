import React from "react";
// @ts-ignore - ignore the error for now
import styles from './css/styling.css?inline'

const App = (): JSX.Element => {
  return (
    <>
     <style type="text/css">{styles.toString()}</style>
     <div 
    className="absolute right-2 top-[100px] flex z-10 pointer-events-auto">

    <div 
    onClick={() => {
        console.log('clicked')
    }}
    className="flex items-center justify-center h-10 w-10 rounded-md text-white bg-[#12141d] z-10 cursor-pointer">
        Hi
    </div>
        </div>
    </>
  );
};

export default App;
