import { createBrowserRouter } from "react-router";
import HomePage from "./../pages/HomePage.tsx";
import DetailsPage from "./../pages/DetailsPage.tsx";
import MainLayout from "./../layouts/MainLayout.tsx";
import LoginPage from "./../pages/LoginPage.tsx";
import ProjectPage from "./../pages/ProjectPage.tsx";
import RegisterPage from "./../pages/RegisterPage.tsx";
import { ProtectedRoute } from "../auth/ProtectedRoute.tsx";
import { PublicRoute } from "../auth/PublicRoute.tsx";
import DashboardPage from "../pages/DashboardPage.tsx";
import TestPage from "../pages/TestPage.tsx";
import ProjectDetailPage from "../pages/ProjectDetailPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        ),
      },
      {
        path: "details",
        element: (
          <ProtectedRoute>
            <DetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "project",
        element: (
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        ),
      },
      {
        // Dynamic route for viewing a specific project
        path: "/project/:id",
        element: (
          <ProtectedRoute>
            <ProjectDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "test",
        element: <TestPage />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: "*",
        element: <div>error </div>,
      },
    ],
  },
]);
