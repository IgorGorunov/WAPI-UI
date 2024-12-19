const videoFileBlock = {
    name: 'videoFileBlock',
    title: 'Video block',
    type: 'object',
    fields: [
        {
            name: 'heading',
            type: 'string',
            title: 'Heading (optional)',
            description: 'if filled, will be displayed above video player as h3 heading'
        },

        {
            name: 'video',
            type: 'file',
            title: 'Video file',
            options: {
                accept: 'video/*'
            }
        },
    ],
}

export default videoFileBlock;