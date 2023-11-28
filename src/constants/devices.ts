export const breakpoints = {
    mobile: 600,
    tablet: 900,
    laptop: 1024,
    desktop: 1200,
};

export const upTo = {
    tablet: breakpoints.tablet - 1,
    laptop: breakpoints.laptop - 1,
    desktop: breakpoints.desktop - 1,
};

export const getScreenSize = () => {
    const width = window.innerWidth;
    if (width <= upTo.tablet) {
        return 'mobile';
    } else if (width <= upTo.laptop) {
        return 'tablet';
    } else if (width <= upTo.desktop) {
        return 'laptop';
    } else {
        return 'desktop';
    }
};
