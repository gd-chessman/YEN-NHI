import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItem from './list-items/ListItem.jsx';
import LogoQuizcard from '../../../../../components/icon/LogoQuizcard.jsx';
import React from 'react';
import sitemap from "./sitemap.jsx";

const DrawerItems = () => {
    return (
        <>
            <Stack
                pt={5}
                pb={3.5}
                px={4.5}
                position="sticky"
                top={0}
                bgcolor="info.light"
                alignItems="center"
                justifyContent="flex-start"
                borderBottom={1}
                borderColor="info.main"
                zIndex={1000}
            >
                <ButtonBase component={Link} href="/" disableRipple>
                    {/*<Image src={LogoImg} alt="logo" height={52} width={52} sx={{ mr: 1.75 }} />*/}
                    <LogoQuizcard size={32}/>
                    <Box>
                        <Typography
                            mt={0.25} // Margin top (cách phía trên một chút, đơn vị mặc định là rem)
                            variant="h5" // Kích thước và kiểu chữ dựa trên theme (h3 thường là font-size lớn)
                            color="primary.main" // Màu sắc theo theme Material-UI (thường là màu chính của chủ đề)
                            textTransform="uppercase" // Chuyển đổi toàn bộ chữ sang chữ in hoa
                            fontWeight="700" // Độ đậm của font, 700 tương đương với bold
                            letterSpacing={1} // Khoảng cách giữa các chữ cái (1px)
                            fontFamily="inherit" // Sử dụng font-family của thành phần cha
                        >
                            quizcard
                        </Typography>
                        <Typography
                            mt={-0.35}
                            variant="body2"
                            color="primary.main"
                            fontFamily="inherit" // Sử dụng font-family của thành phần cha
                            textTransform="none"
                            fontWeight={500}
                        >
                            Admin Page
                        </Typography>
                    </Box>
                </ButtonBase>
            </Stack>

            <List component="nav" sx={{mt: 2.5, mb: 10, px: 4.5}}>
                {sitemap.map((route) =>
                    (
                        <ListItem key={route.id} {...route} />
                    ),
                )}
            </List>
        </>
    );
};

export default DrawerItems;
