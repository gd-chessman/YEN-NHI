const Drawer = {
    styleOverrides: {
        root: {
            '&:hover, &:focus': {
                '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
                    visibility: 'visible',
                },
            },
        },
        paper: ({ theme }) => ({
            padding: 0,
            width: '290px',
            height: '100vh',
            border: 0,
            borderRadius: 0,
            backgroundColor: "#f0f1f5",
            boxShadow: 'none',
            boxSizing: 'border-box',
        }),
    },
};

export default Drawer;