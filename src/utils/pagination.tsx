export const itemRender = (tGen) => (_, type, originalElement) => {
    if (type === 'prev') {
        return <a>{tGen('previous')}</a>;
    }
    if (type === 'next') {
        return <a>{tGen('next')}</a>;
    }
    return originalElement;
};