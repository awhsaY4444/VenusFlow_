import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VenusFlow API",
      version: "1.0.0",
      description: "Production-grade Task Management API for VenusFlow",
    },
    servers: [
      {
        url: "https://venusflow.onrender.com",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // files containing annotations as above
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("Swagger UI available at /api-docs");
}
