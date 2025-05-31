import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { MovieDetail } from "./pages/movieInfos";
import { MovieList } from "./pages/movieList";
import { Register } from "./pages/register";
import PrivateRoute from "./routes/privateRoutes";
import PublicRoute from "./routes/publicRoutes";
import { ThemeProvider } from "./components/theme-provider";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/movieList" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        {/* outras rotas privadas */}
      </Route>
    </Routes>
    </ThemeProvider>
  );
};

export default App;
