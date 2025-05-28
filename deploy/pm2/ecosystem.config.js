module.exports = {
  apps: [
    {
      // Staging Backend
      name: "payroll-backend-staging",
      script: "/var/www/payroll/staging/backend/dist/main.js",
      instances: 2, // Số lượng instances
      exec_mode: "cluster", // Chế độ cluster để load balancing
      watch: false, // Không watch file changes
      max_memory_restart: "1G", // Restart nếu memory vượt quá 1GB
      env: {
        NODE_ENV: "staging",
        PORT: 3001,
        DB_HOST: process.env.STAGING_DB_HOST,
        DB_PORT: process.env.STAGING_DB_PORT,
        DB_USERNAME: process.env.STAGING_DB_USERNAME,
        DB_PASSWORD: process.env.STAGING_DB_PASSWORD,
        DB_DATABASE: process.env.STAGING_DB_DATABASE,
        JWT_SECRET: process.env.STAGING_JWT_SECRET,
      },
      error_file: "/var/log/pm2/payroll-backend-staging-error.log",
      out_file: "/var/log/pm2/payroll-backend-staging-out.log",
      time: true, // Thêm timestamp vào logs
    },
    {
      // Production Backend
      name: "payroll-backend-production",
      script: "/var/www/payroll/production/backend/dist/main.js",
      instances: 4, // Nhiều instances hơn cho production
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        DB_HOST: process.env.PROD_DB_HOST,
        DB_PORT: process.env.PROD_DB_PORT,
        DB_USERNAME: process.env.PROD_DB_USERNAME,
        DB_PASSWORD: process.env.PROD_DB_PASSWORD,
        DB_DATABASE: process.env.PROD_DB_DATABASE,
        JWT_SECRET: process.env.PROD_JWT_SECRET,
      },
      error_file: "/var/log/pm2/payroll-backend-production-error.log",
      out_file: "/var/log/pm2/payroll-backend-production-out.log",
      time: true,
    },
  ],
};
