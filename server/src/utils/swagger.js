import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "../config.js";

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
        url: config.clientUrl ? "/api" : "http://localhost:4000/api",
        description: "VenusFlow API",
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
