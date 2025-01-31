import { Box, Typography } from "@mui/material";

export const Description = () => {
  return (
    <>
      <Typography variant="h5">アプリケーション概要</Typography>
      <Box bgcolor="#eee" p={0.5} borderRadius={1}>
        <Typography variant="body1">
          このアプリケーションは、人やモノの流れを、年代・種類ごとに分けて可視化できるものである。
        </Typography>
      </Box>
    </>
  );
};
