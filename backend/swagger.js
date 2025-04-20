import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger Definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Code Reviewer API",
      version: "1.0.0",
      description: "API for interactive AI-powered code review",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Points to route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
