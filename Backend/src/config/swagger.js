import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medicare Hospital Portal — Interactive API Engine",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for the Medicare booking platform. Authenticate using Bearer JWT tokens to access protected doctor scheduling, patient clinical operations, and assistant engines.",
      contact: {
        name: "Support Team",
        email: "support@medicare.com",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "Local Proxy Server",
      },
      {
        url: "https://medicare-healthcare-app.onrender.com/api/v1",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your secure Access JWT token to authorize requests.",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
