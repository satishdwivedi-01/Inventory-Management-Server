import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMS API",
      version: "1.0.0",
    },
  },
  apis: ["./src/modules/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
