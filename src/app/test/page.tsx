// src/app/test/page.tsx
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material/";
import ClientPageContent from "@/components/ClientPageContent";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";

export default function TestPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // 直接指定またはCSS変数使用
        margin: "auto 0",
      }}
    >
      {/* サーバーサイドでレンダリングされる静的なコンテンツ sxやvariantはデフォルプロパティなのでSSRで使用可 */}
      <Typography variant="h1" sx={{ mb: 2, color: "#1976d2" }}>
        This is a Test Page (SSR)
      </Typography>

      <Typography variant="h2" sx={{ mb: 4, color: "#dc004e" }}>
        Powered by MUI & Next.js (SSR)
      </Typography>

      <TableContainer sx={{ width: 900 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Column 1</TableCell>
              <TableCell>Column 2</TableCell>
              <TableCell>Column 3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 }, // 最後の行の下線を消す（任意）
                }}
              >
                <TableCell sx={{ border: 0 }}>Data {index + 1}A</TableCell>
                <TableCell sx={{ border: 0 }}>Data {index + 1}B</TableCell>
                <TableCell sx={{ border: 0 }}>Data {index + 1}C</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* テーマが必要な部分だけをクライアントコンポーネントに */}
      <ThemeProviderWrapper>
        <ClientPageContent />
      </ThemeProviderWrapper>
    </Box>
  );
}
