import React from "react";
import "./styles.scss";
import Button from "@/components/Button/Button";

type NextButtonPropsType = {
    setActiveTab: (newState: number)=>void;
    nextTab: number;
}
const NextButton:React.FC<NextButtonPropsType> = ({setActiveTab, nextTab}) => {

    const handleNextButtonClick = () => {
        setActiveTab(nextTab);
    }

    return (
        <div className='next-button__container'>
            <Button icon='arrow-right' iconOnTheRight onClick={handleNextButtonClick}>Next</Button>
        </div>
    );
};

export default NextButton;