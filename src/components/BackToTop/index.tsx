import React, { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import './styles.scss';


const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when the user scrolls down
    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setIsVisible(scrollPosition > 300); // Show button when scrolled down 300px
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {isVisible ?  (
                <button onClick={scrollToTop} title="Back to top" className='back-to-top'>
                    {/*<Icon name={'keyboard-arrow-up'} />*/}
                    <FiArrowUp className={'back-to-top__icon'} />
                </button>
            ) : null}
        </>
    );
};

// Inline styles for the button
// const styles = {
//     button: {
//         position: "fixed",
//         bottom: "2rem",
//         right: "2rem",
//         backgroundColor: "#333",
//         color: "#fff",
//         border: "none",
//         borderRadius: "50%",
//         padding: "0.75rem",
//         cursor: "pointer",
//         zIndex: 1000,
//         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
//     },
//     icon: {
//         fontSize: "1.5rem",
//     },
// };

export default BackToTop;