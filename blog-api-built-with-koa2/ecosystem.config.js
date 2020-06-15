module.exports = {
  apps : [
    {
      name: "blog-api-native-nodejs",
      script: "./bin/www",
      instances: 3,
      instance_var: 'INSTANCE_ID', // every process instance has process.env.INSTANCE_ID
      exec_mode: "cluster",
      watch: true,
      ignore_watch: [
        "node_modules",
        "logs"
      ],
      env_dev: {
        "NODE_ENV": "dev",
      },
      env_prod: {
        "NODE_ENV": "prod",
        "author": "west", // inject NodeJs application environment variables
      },
    },
  ],
}
