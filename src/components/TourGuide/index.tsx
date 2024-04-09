import React from 'react';
import Joyride, {ACTIONS, EVENTS, ORIGIN, STATUS, CallBackProps} from 'react-joyride';
import './styles.scss';
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages, TourGuideStepType} from "@/types/tourGuide";


type TourGuidePropsType = {
    steps: TourGuideStepType[];
    run: boolean;
    setRunTourOpt?: (val:boolean)=>void;
    pageName: TourGuidePages;
    disableAnimation?: boolean;
    //handleStop?: ()=>void;
}

export const handleTourGuideCallback = (props: CallBackProps, setRun: (val:boolean)=>void, setTutorialAsWatched, pageName) => {
    const { action, index, origin, status, type } = props;

    if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
        // do something
    }

    if (status && (status===STATUS.FINISHED || status===STATUS.SKIPPED)) {
        // Need to set our running state to false, so we can restart if we click start again.
        setRun(false);
        setTutorialAsWatched(pageName);
    }
}

const TourGuide: React.FC<TourGuidePropsType> = ({steps, run, setRunTourOpt, pageName, disableAnimation=true}) => {
    const {setRunTour, setTutorialAsWatched} = useTourGuide();

    const handleStop = (data: CallBackProps) => {
        handleTourGuideCallback(data, setRunTourOpt ? setRunTourOpt : setRunTour, setTutorialAsWatched, pageName)
    }

    return <div className='tour-guide'>
        <Joyride
            continuous={true}
            showSkipButton={true}
            scrollToFirstStep
            showProgress
            run={run}
            steps={steps}
            callback={handleStop}
            floaterProps={{disableAnimation: disableAnimation}}
            styles={{
                options: {
                    primaryColor: 'var(--color-light-blue-gray)',
                    textColor: 'var(--color-gray-blue)',
                    zIndex: 1011,
                },
                spotlight: {
                    borderRadius: '20px',
                },
                beacon: {
                    zIndex: 999,
                },
                tooltip: {
                    fontFamily: 'var(--inter-font)',
                    borderRadius: 16,
                    fontSize: 14,
                    fontWeight: 'bold',
                    padding: 24,
                    position: 'relative' as const,
                },
                buttonNext: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    backgroundColor: 'var(--color-blue)',
                    borderRadius: 20,
                    color: '#fff',
                    padding: '14px 16px',
                    boxShadow: '0 2px 5px 0 var(--color-blue)',
                    outline: 'none',
                },
                buttonBack: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#5380F5',
                    marginLeft: 'auto',
                    marginRight: 12,
                    outline: 'none',
                },
                buttonSkip: {
                    fontFamily: 'var(--inter-font)',
                    color: 'var(--color-gray-blue)',
                    fontSize: 12,
                    fontWeight: 'bold',
                    backgroundColor: 'var(--color-white)',
                    boxShadow: '0 2px 5px 0 var(--color-light-blue-gray)',
                    borderRadius: 20,
                    padding: '14px 16px',
                    outline: 'none',
                },
            }}
        />
    </div>
}

export default TourGuide;