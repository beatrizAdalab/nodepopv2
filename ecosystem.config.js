module.exports = {
  apps: [
    {
      name: 'nodepop',
      script: './bin/www',
      watch: '.'
    },
    {
      name: 'microservice-thumb',
      script: 'microservices/createThumbnails.js',
      watch: ['microservices/createThumbnails.js'],
    }

  ],
};
